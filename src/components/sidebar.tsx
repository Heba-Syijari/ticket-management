import { UsersRound, FileText, Ticket, Settings, LogOut, LayoutGrid } from "lucide-react"
import logoImage from '../assets/Logo.png';
import squaresImage from '../assets/squares-2x2.svg';
import ticketImage from '../assets/ticket.svg';
import vectorImage from '../assets/Vector.svg';
import documentImage from '../assets/document-chart-bar.svg';
import settingImage from '../assets/Setting.svg';

import { cn } from "../lib/utils"
import { useTheme } from "../context/theme-provider"
import { Button } from "./ui/button"
import { Moon, Sun } from "lucide-react"

export default function Sidebar() {
  const { theme, setTheme } = useTheme()

  const navItems = [
    { img: squaresImage, alt: "Dashboard" },
    { img: ticketImage, alt: "Tickets", active: true },
    { img: vectorImage, alt: "Users" },
    { img: documentImage, alt: "Products" },
    { img: settingImage, alt: "Settings" },
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
            aria-label={item.alt}
          >
            {/* <item.icon size={20} fill="hsla(0, 0%, 100%, 0.9)" /> */}
            <img src={item.img} alt={item.alt} className="w-6 h-6" />
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
