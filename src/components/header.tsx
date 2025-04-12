import { Search, Filter, Bell, MessageSquare, X, UserRound } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface HeaderProps {
  isChatVisible: boolean
  searchQuery: string
  onChatToggle: () => void
  onSearchChange: (value: string) => void
}

export default function Header({
  isChatVisible,
  searchQuery,
  onChatToggle,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="h-16 px-4 flex items-center justify-between border-b border-border bg-background z-20 shadow-sm">
      <div className="flex items-center gap-2">
        <h2 className="text-primary font-semibold text-lg lg:mr-7 hidden sm:block">
          Ticket List
        </h2>

        <div className="relative">
          <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="w-40 sm:w-64 pl-3 h-9 bg-backgroundelem border-input text-sm rounded-2xl"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-input rounded-full hidden sm:flex bg-backgroundelem"
        >
          <Filter className="h-5 w-5 text-muted-foreground" fill="gray" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 text-muted-foreground rounded-full hidden sm:flex bg-backgroundelem"
        >
          <Bell className="h-5 w-5 text-muted-foreground" fill="gray" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-input rounded-full hidden sm:flex bg-gray-200"
        >
          <UserRound className="h-5 w-5 text-muted-foreground" fill="white" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-input rounded-full bg-backgroundelem"
          onClick={onChatToggle}
        >
          {isChatVisible ? <X className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  )
}