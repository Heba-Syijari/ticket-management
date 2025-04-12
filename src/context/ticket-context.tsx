import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type TicketStatus = "open" | "pending" | "closed"

export interface Ticket {
  id: number
  customer_name: string
  subject: string
  status: TicketStatus
  timestamp: string
  messages: Message[]
}

export interface Message {
  id: string
  ticketId: number
  message: string
  sender: "customer" | "agent"
  timestamp: string
}

interface StatusCounts {
  open: number
  pending: number
  closed: number
}

interface TicketContextType {
  activeStatus: TicketStatus
  setActiveStatus: (status: TicketStatus) => void
  selectedTicket: Ticket | null
  setSelectedTicket: (ticket: Ticket | null) => void
  statusCounts: StatusCounts
  activeSection: string
  setActiveSection: (section: string) => void
  tickets: Ticket[]
  setTickets: (tickets: Ticket[]) => void
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

export function TicketProvider({ children }: { children: ReactNode }) {
  const [activeStatus, setActiveStatus] = useState<TicketStatus>("open")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [activeSection, setActiveSection] = useState("tickets")
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    open: 0,
    pending: 0,
    closed: 0,
  })
  useEffect(() => {
    const counts = {
      open: tickets.filter(ticket => ticket.status === "open").length,
      pending: tickets.filter(ticket => ticket.status === "pending").length,
      closed: tickets.filter(ticket => ticket.status === "closed").length,
    }
    setStatusCounts(counts)
  }, [tickets])


  return (
    <TicketContext.Provider
      value={{
        activeStatus,
        setActiveStatus,
        selectedTicket,
        setSelectedTicket,
        statusCounts,
        activeSection,
        setActiveSection,
        tickets,
        setTickets,
      }}
    >
      {children}
    </TicketContext.Provider>
  )
}

export function useTickets() {
  const context = useContext(TicketContext)
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketProvider")
  }
  return context
}
