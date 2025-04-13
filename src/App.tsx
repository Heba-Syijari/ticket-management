import { useState } from "react"
import { ThemeProvider } from "./context/theme-provider"
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
} from "./components/ui/resizable"
import { useMediaQuery } from "./hooks/use-media-query"
import { Drawer, DrawerContent } from "./components/ui/drawer"

const queryClient = new QueryClient()

function App() {
  const [isChatVisible, setIsChatVisible] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [mobileChatOpen, setMobileChatOpen] = useState(false)

  const handleChatToggle = () => {
    if (isMobile) {
      setMobileChatOpen(!mobileChatOpen)
    } else {
      setIsChatVisible(!isChatVisible)
    }
  }

  const handleCloseChat = () => {
    if (isMobile) {
      setMobileChatOpen(false)
    } else {
      setIsChatVisible(false)
    }
  }

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
                onChatToggle={handleChatToggle}
                onSearchChange={(value) => setSearchQuery(value)}
              />

              {/* Desktop Layout */}
              {!isMobile && (
                <ResizablePanelGroup direction="horizontal" className="flex-1">
                  <ResizablePanel
                    defaultSize={70}
                    minSize={30}
                    className="min-w-[300px]"
                  >
                    <TicketList
                      onChatToggle={handleChatToggle}
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
                          <ChatPanel onClose={handleCloseChat} />
                        </div>
                      </ResizablePanel>
                    </>
                  )}
                </ResizablePanelGroup>
              )}

              {/* Mobile Layout */}
              {isMobile && (
                <div className="flex-1 overflow-hidden">
                  <TicketList
                    onChatToggle={handleChatToggle}
                    isChatVisible={mobileChatOpen}
                  />
                  <Drawer
                    open={mobileChatOpen}
                    onOpenChange={setMobileChatOpen}
                  >
                    <DrawerContent className="h-[80%]">
                      <ChatPanel onClose={handleCloseChat} />
                    </DrawerContent>
                  </Drawer>
                </div>
              )}
            </div>
          </div>
        </TicketProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App