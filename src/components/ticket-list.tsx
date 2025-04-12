import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import { useTickets, Ticket } from "../context/ticket-context"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchTickets } from "../lib/api"
import { Badge } from "./ui/badge"
import openImage from '../assets/open.png';
import closedImage from '../assets/closed.png';
import pendingImage from '../assets/pending.png';

interface TicketListProps {
  onChatToggle: () => void
  isChatVisible: boolean
}

export default function TicketList({ onChatToggle, isChatVisible }: TicketListProps) {
  const { activeStatus, setActiveStatus, selectedTicket, setSelectedTicket, statusCounts, tickets, setTickets } = useTickets()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const { data, isLoading, error } = useQuery<Ticket[]>({
    queryKey: ["tickets"],
    queryFn: fetchTickets
  });

  useEffect(() => {
    if (data) {
      setTickets(data);
    }
  }, [data]);


  const filteredTickets = tickets
    .filter((ticket) => ticket.status === activeStatus)
    .filter(
      (ticket) =>
        ticket.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  // Calculate pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const paginatedTickets = filteredTickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 3

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      if (currentPage <= 2) {
        endPage = 3
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2
      }

      if (startPage > 2) {
        pages.push("...")
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (endPage < totalPages - 1) {
        pages.push("...")
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      {/* Status sidebar */}
      <div className="w-fit border-r border-border bg-backgroundelem">
        <div className="py-4">

          <div className="flex flex-col gap-4">
            <button
              className={`flex items-center gap-2 py-4 px-6 text-sm font-medium ${activeStatus === "open" ? "shadow-xl border-r-4 border-primary" : "text-muted-foreground"
                }`}
              onClick={() => {
                setActiveStatus("open")
                setCurrentPage(1)
              }}
            >
              <img src={openImage} alt="Open" className="w-4 h-4" />
              <span className="hidden sm:inline">Open ({statusCounts.open})</span>
            </button>

            <button
              className={`flex items-center gap-2 py-4 px-6 text-sm font-medium ${activeStatus === "pending" ? "shadow-xl border-r-4 border-primary" : "text-muted-foreground"
                }`}
              onClick={() => {
                setActiveStatus("pending")
                setCurrentPage(1)
              }}
            >
              <img src={pendingImage} alt="Pending" className="w-4 h-4" />
              <span className="hidden sm:inline">Pending ({statusCounts.pending})</span>
            </button>

            <button
              className={`flex items-center gap-2  py-4 px-6 text-sm font-medium ${activeStatus === "closed" ? "shadow-xl border-r-4 border-primary" : "text-muted-foreground"
                }`}
              onClick={() => {
                setActiveStatus("closed")
                setCurrentPage(1)
              }}
            >
              <img src={closedImage} alt="Closed" className="w-4 h-4" />
              <span className="hidden sm:inline">Closed ({statusCounts.closed})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ticket list */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            // Loading state
            <div className="p-4 space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-60" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            // Error state
            <div className="flex flex-col items-center justify-center h-full p-4">
              <p className="text-destructive mb-2">Failed to load tickets</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : filteredTickets.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-full p-4">
              <p className="text-muted-foreground mb-2">No tickets found</p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            // Tickets table
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="font-medium text-left pl-4 py-3 w-1/4">Name</th>
                  <th className="font-medium text-left py-3 w-1/3">Subject</th>
                  <th className="font-medium text-left py-3 w-1/6">Timestamp</th>
                  <th className="font-medium text-left py-3 pr-4 w-1/6">State</th>
                </tr>
              </thead>
              <tbody >
                {paginatedTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className={`border-b border-border bg-backgroundelem hover:bg-accent/80 cursor-pointer ${selectedTicket?.id === ticket.id ? "bg-accent/80" : "bg-backgroundelem"
                      }`}
                    onClick={() => {
                      setSelectedTicket(ticket)
                      if (!isChatVisible) {
                        onChatToggle()
                      }
                    }}
                  >
                    <td className="pl-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {ticket.customer_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">{ticket.customer_name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-foreground">{ticket.subject}</span>
                    </td>
                    <td className="py-3">
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(ticket.timestamp), { addSuffix: true })}
                      </span>
                    </td>
                    <td className="pr-4 py-3">
                      <Badge
                        variant="outline"
                        className={`px-2 py-1 ${ticket.status === "open"
                          ? "bg-opens/90 text-opens-foreground/70 border-opens-foreground/70"
                          : ticket.status === "pending"
                            ? "bg-yellow-400/10 text-yellow-500 border-yellow-400/30"
                            : "bg-destructive/10 text-destructive border-destructive/30"
                          }`}
                      >
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !error && filteredTickets.length > 0 && (
          <div className="h-12 flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:inline">Rows per page:</span>
              <select className="bg-backgroundelem border border-input rounded px-1 py-0.5">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((page, index) =>
                typeof page === "number" ? (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 ${currentPage === page ? "bg-accent/50 text-primary" : "text-muted-foreground"}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ) : (
                  <span key={index} className="text-muted-foreground px-1">
                    {page}
                  </span>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
