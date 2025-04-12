import { UsersRound, FileText, Ticket, Settings, LogOut, LayoutGrid } from "lucide-react"
import logoImage from '../assets/Logo.png';
import { cn } from "../lib/utils"
import { useTheme } from "./theme-provider"
import { Button } from "./ui/button"
import { Moon, Sun } from "lucide-react"

export default function Sidebar() {
  // const { activeSection, setActiveSection } = useTickets()
  const { theme, setTheme } = useTheme()

  const navItems = [
    { icon: LayoutGrid, label: "Dashboard" },
    { icon: Ticket, label: "Tickets", active: true },
    { icon: UsersRound, label: "Users" },
    { icon: FileText, label: "Products" },
    { icon: Settings, label: "Settings" },
  ]

  return (
    <div className="w-16 bg-sidebar flex flex-col items-center py-4 border-r border-sidebar-border">
      <img src={logoImage} alt="Logo" className="w-6 h-6" />

      <div className="flex flex-col items-center gap-8 mt-4 flex-1">
        {navItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "w-12 h-12 flex items-center justify-center text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors",
              item.active && "text-sidebar-foreground bg-sidebar-accent",
            )}
            aria-label={item.label}
          >
            <item.icon size={20} fill="hsla(0, 0%, 100%, 0.9)" />
          </button>
        ))}
      </div>

      {/* Theme toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      {/* Logout button */}
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent mt-4"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  )
}
