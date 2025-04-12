
import type { Ticket, Message } from "../context/ticket-context"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Sample data
const sampleTickets: Ticket[] = [
  {
    id: "1",
    customerName: "John Smith",
    subject: "Unable to reset password",
    status: "open",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },
  {
    id: "2",
    customerName: "Emily Johnson",
    subject: "Payment failed on checkout",
    status: "open",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "3",
    customerName: "Michael Brown",
    subject: "Cannot access premium features",
    status: "open",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
  {
    id: "4",
    customerName: "Sarah Wilson",
    subject: "Missing order confirmation",
    status: "pending",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
  {
    id: "5",
    customerName: "David Lee",
    subject: "Subscription renewal issue",
    status: "pending",
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // 18 hours ago
  },
  {
    id: "6",
    customerName: "Jennifer Martinez",
    subject: "App crashes on startup",
    status: "closed",
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "7",
    customerName: "Robert Taylor",
    subject: "Feature request: dark mode",
    status: "closed",
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "8",
    customerName: "Lisa Anderson",
    subject: "Billing address update",
    status: "closed",
    createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(), // 4 days ago
    updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: "9",
    customerName: "James Wilson",
    subject: "Login issues after update",
    status: "open",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: "10",
    customerName: "Patricia Moore",
    subject: "Cannot download invoice",
    status: "pending",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
  },
  {
    id: "11",
    customerName: "Thomas Jackson",
    subject: "Product not as described",
    status: "open",
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
  },
  {
    id: "12",
    customerName: "Jessica White",
    subject: "Refund not processed",
    status: "pending",
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(), // 15 hours ago
    updatedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
  },
  {
    id: "13",
    customerName: "Daniel Harris",
    subject: "Account locked out",
    status: "closed",
    createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: "14",
    customerName: "Nancy Clark",
    subject: "Missing attachment in email",
    status: "closed",
    createdAt: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(), // 6 days ago
    updatedAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: "15",
    customerName: "Christopher Lewis",
    subject: "Website navigation issues",
    status: "closed",
    createdAt: new Date(Date.now() - 168 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
]

// Sample conversations for each ticket
const sampleConversations: Record<string, Message[]> = {
  "1": [
    {
      id: "1-1",
      ticketId: "1",
      content: "I'm trying to reset my password but I'm not receiving the reset email. Can you help?",
      sender: "customer",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    },
    {
      id: "1-2",
      ticketId: "1",
      content:
        "I'd be happy to help you with that. Could you please confirm the email address you're using for your account?",
      sender: "agent",
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours ago
    },
    {
      id: "1-3",
      ticketId: "1",
      content: "It's john.smith@example.com. I've checked my spam folder too, but there's nothing there.",
      sender: "customer",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    },
    {
      id: "1-4",
      ticketId: "1",
      content:
        "Thank you for confirming. I've manually triggered a password reset email to john.smith@example.com. Please check your inbox in the next few minutes. If you still don't receive it, we can try an alternative method.",
      sender: "agent",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    },
    {
      id: "1-5",
      ticketId: "1",
      content:
        "I got the email this time, but when I enter the code, it says 'invalid code'. I've tried multiple times.",
      sender: "customer",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    },
  ],
}

// API functions
export async function fetchTickets(): Promise<Ticket[]> {
  await delay(800)
  return [...sampleTickets]
}

export async function fetchConversation(ticketId: string): Promise<Message[]> {
  await delay(600)
  return sampleConversations[ticketId] || []
}

export async function sendMessage(ticketId: string, content: string): Promise<Message> {
  await delay(500)

  const newMessage: Message = {
    id: `${ticketId}-${Date.now()}`,
    ticketId,
    content,
    sender: "agent",
    timestamp: new Date().toISOString(),
  }

  // Add the message to the conversation
  if (!sampleConversations[ticketId]) {
    sampleConversations[ticketId] = []
  }
  sampleConversations[ticketId].push(newMessage)

  return newMessage
}

export async function updateTicketStatus(ticketId: string, status: "open" | "pending" | "closed"): Promise<Ticket> {
  await delay(400)
  const ticket = sampleTickets.find((t) => t.id === ticketId)
  if (!ticket) {
    throw new Error(`Ticket with ID ${ticketId} not found`)
  }

  ticket.status = status
  ticket.updatedAt = new Date().toISOString()

  return ticket
}
