import { useState } from "react"
import { ThemeProvider } from "./components/theme-provider"
import { TicketProvider } from "./context/ticket-context"
import Sidebar from "./components/sidebar"
import TicketList from "./components/ticket-list"
import ChatPanel from "./components/chat-panel"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Header from "./components/header"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

// Create a client
const queryClient = new QueryClient()

function App() {
  const [isChatVisible, setIsChatVisible] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ticket-ui-theme">
        <TicketProvider>
          <div className="flex h-screen bg-background overflow-hidden">
            <Sidebar />
            <div className="flex flex-1 flex-col h-full overflow-hidden">
              <Header
                isChatVisible={isChatVisible}
                searchQuery={searchQuery}
                onChatToggle={() => setIsChatVisible(!isChatVisible)}
                onSearchChange={(value) => setSearchQuery(value)}
              />

              <ResizablePanelGroup direction="horizontal" className="flex-1">
                <ResizablePanel
                  defaultSize={70}
                  minSize={30}
                  className="min-w-[300px]"
                >
                  <TicketList
                    onChatToggle={() => setIsChatVisible(!isChatVisible)}
                    isChatVisible={isChatVisible}
                  />
                </ResizablePanel>

                {isChatVisible && (
                  <>
                    <ResizableHandle withHandle className="mx-1" />
                    <ResizablePanel
                      defaultSize={30}
                      minSize={20}
                      maxSize={50}
                      className="relative"
                    >
                      <div className="w-full h-full relative border-l border-border">
                        <ChatPanel onClose={() => setIsChatVisible(false)} />
                      </div>
                    </ResizablePanel>
                  </>
                )}
              </ResizablePanelGroup>
            </div>
          </div>
        </TicketProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App