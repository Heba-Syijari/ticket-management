import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Send, Paperclip, Smile, X } from "lucide-react"
import { useTickets } from "../context/ticket-context"
import { format } from "date-fns"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "./ui/skeleton"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchConversation, sendMessage } from "../lib/api"
import phoneImage from '../assets/phone.svg';
import envelopeImage from '../assets/envelope.svg';
import localImage from '../assets/local.svg';

interface ChatPanelProps {
  onClose: () => void
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const { selectedTicket } = useTickets()
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { data: conversation = [], isLoading: loadingConversation } = useQuery({
    queryKey: ["conversation", selectedTicket?.id],
    queryFn: () => (selectedTicket ? fetchConversation(selectedTicket.id) : Promise.resolve([])),
    enabled: !!selectedTicket,
  })

  const mutation = useMutation({
    mutationFn: (content: string) => {
      if (!selectedTicket) throw new Error("No ticket selected")
      return sendMessage(selectedTicket.id, content)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation", selectedTicket?.id] })
    },
  })

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [conversation])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !selectedTicket || mutation.isPending) return

    try {
      mutation.mutate(message)
      setMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  // Group messages by date
  const groupedMessages = conversation.reduce((groups: Record<string, typeof conversation>, message) => {
    const date = format(new Date(message.timestamp), "MMM, dd, yyyy, hh:mm a")
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  if (!selectedTicket) {
    return (
      <div className="w-full h-full bg-background flex flex-col items-center justify-center border-l border-border">
        <div className="text-center p-4">
          <h3 className="text-lg font-medium mb-2">No ticket selected</h3>
          <p className="text-muted-foreground">Select a ticket from the list to view the conversation</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-backgroundelem flex flex-col border-l border-border">
      {/* Header with wavy background */}
      <div className="relative wavy-bg h-32 flex flex-col justify-center bg-background">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-white h-6 w-6 md:hidden"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="p-4 flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white">
            <AvatarFallback className="bg-muted text-muted-foreground">
              {selectedTicket.customer_name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div >
            <h3 className="font-medium text-black">{selectedTicket.customer_name}</h3>
            <div className="flex items-center gap-4 mt-1">
              <button className="flex items-center justify-center h-8 w-8 bg-white/80 rounded-full">
                <img src={phoneImage} alt="phone" className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-center h-8 w-8 bg-white/80 rounded-full">
                <img src={envelopeImage} alt="envelope" className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-center h-8 w-8 bg-white/80 rounded-full">
                <img src={localImage} alt="local" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>



      <div className="flex-1 overflow-auto">
        {/* Ticket subject */}
        <div className="p-4 border-b border-border sticky top-0 w-full  isolate z-50">
          <div className="absolute inset-0 glass-effect -z-10 shadow-inner" />
          <div className="relative z-10">
            <div className="flex justify-between ">
              <h4 className="font-medium">Ticket Subject</h4>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(selectedTicket.timestamp), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{selectedTicket.subject}</p>
          </div>
        </div>
        {loadingConversation ? (
          // Loading state
          <div className="space-y-4 p-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                {index % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full mr-2" />}
                <div className={`space-y-2 ${index % 2 === 0 ? "items-start" : "items-end"}`}>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className={`h-16 ${index % 2 === 0 ? "w-64" : "w-48"} rounded-lg`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Conversation
          Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date} className="space-y-4 p-4">
              <div className="flex items-center justify-center">
                <div className="text-xs text-muted-foreground  px-2 py-1 rounded-full">{date}</div>
              </div>

              {messages.map((message, index) => {
                const isCustomer = message.sender === "customer"
                return (
                  <div key={index} className={`flex flex-col gap-1 ${isCustomer ? "" : "items-end"}`}>
                    <div className="flex items-center gap-2">
                      {isCustomer && (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {selectedTicket.customer_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {isCustomer ? selectedTicket.customer_name : "Agent"}
                      </span>
                      {!isCustomer && (
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">A</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <div
                      className={`${isCustomer
                        ? "ml-8 bg-muted text-foreground rounded-lg rounded-tl-none"
                        : "bg-[#3A2F53] text-white rounded-lg rounded-tr-none"
                        } text-sm p-3 max-w-[85%]`}
                    >
                      {message.message}
                    </div>
                    <div className={`text-xs text-muted-foreground ${isCustomer ? "ml-8" : "mr-0"}`}>
                      {format(new Date(message.timestamp), "h:mm a")}
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 ">
        <div className="relative flex items-center">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter Message"
            className="pr-24 py-2 border-input text-sm rounded-full"
            disabled={mutation.isPending || loadingConversation}
          />
          <div className="absolute right-2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              disabled={mutation.isPending || loadingConversation}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              disabled={mutation.isPending || loadingConversation}
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 bg-[#3A2F53] text-white rounded-full"
              disabled={!message.trim() || mutation.isPending || loadingConversation}
            >
              {mutation.isPending ? (
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
