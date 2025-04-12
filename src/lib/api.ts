import type { Ticket, Message } from "../context/ticket-context"

const API_BASE_URL = "https://openapi.pythonanywhere.com"

// Fetch all tickets
export async function fetchTickets(): Promise<Ticket[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets`)

    if (!response.ok) {
      throw new Error(`Failed to fetch tickets: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching tickets:", error)
    throw error
  }
}

// Fetch a specific ticket with conversation
export async function fetchConversation(ticketId: number): Promise<Message[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.messages || []
  } catch (error) {
    console.error(`Error fetching conversation for ticket ${ticketId}:`, error)
    throw error
  }
}

// Send a reply to a ticket
export async function sendMessage(ticketId: number, content: string): Promise<Message> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/reply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: "agent",
        message: content

      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error sending message to ticket ${ticketId}:`, error)
    throw error
  }
}

// Update ticket status
export async function updateTicketStatus(ticketId: number, status: "open" | "pending" | "closed"): Promise<Ticket> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to update ticket status: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error updating status for ticket ${ticketId}:`, error)
    throw error
  }
}
