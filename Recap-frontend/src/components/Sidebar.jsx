"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import {
  PlusCircle,
  BarChart,
  Eye,
  Calculator,
  Users,
  Activity,
  BrainCog,
  Settings,
  LogOut,
  User,
  Menu,
  Book,
  Clipboard,
  GroupIcon,
  
} from "lucide-react"
import { IconCards } from "@tabler/icons-react"
import { signOut } from "firebase/auth"
import { auth } from "../config/Firebaseconfig"
import toast from "react-hot-toast"

const handleLogout = async () => {
  try {
    await signOut(auth)
    toast.success("You have been logged out!")
    localStorage.removeItem("user")
    window.location.href = "/"
  } catch (error) {
    console.error("Error logging out:", error.message)
    toast.error("Failed to log out. Please try again.")
  }
}

const Sidebar = () => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed")
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed))
  }, [isCollapsed])

  const navigationLinks = [
    { to: "/main-dashboard", icon: BarChart, label: "Dashboard", category: "main" },
    { to: "/upload-note", icon: PlusCircle, label: "Upload Notes", category: "main" },
    { to: "/my-notes", icon: Eye, label: "View Notes", category: "main" },
    { to: "/flashcards", icon: IconCards, label: "Flashcards", category: "main" },
    { to: "/quizzes", icon: Calculator, label: "Quizzes", category: "main" },
    { to: "/pyq-practice", icon: Clipboard, label: "PYQ Practice", category: "main" },
    { to: "/community", icon: GroupIcon, label: "Community", category: "main" },
    { to: "/collaboration", icon: Users, label: "Collaboration", category: "main" },
    { to: "/ai-insights", icon: Activity, label: "AI Insights", category: "main" },
    { to: "/leaderboard", icon: Book, label: "LeaderBoard", category: "main" },
    { to: "/premium", icon: BrainCog, label: "Premium", category: "main" },
    { to: "/aiquestionbank", icon:Clipboard, label: "Learn With AI", category: "main" }
    // { to: "/pwa", icon: BrainCog, label: "Install app", category: "main" },
    // { to: "/settings", icon: Settings, label: "Settings", category: "bottom" },
    // { to: "/profile", icon: User, label: "Profile", category: "bottom" },
  ]

  return (
    <div
      className={`h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Logo and Toggle Section */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <Link to="/" className={`flex items-center space-x-2 ${isCollapsed ? "justify-center" : ""}`}>
          {!isCollapsed && (
            <span className="text-2xl font-bold">
              Re<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">cap</span>
            </span>
          )}
          {isCollapsed && <span className="text-2xl font-bold text-purple-400">R</span>}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-300 hover:text-white focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {navigationLinks
            .filter((link) => link.category === "main")
            .map((link) => {
              const Icon = link.icon
              const isActive = location.pathname === link.to
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center space-x-3 p-2 rounded-md transition-all duration-200 group
                    ${
                      isActive
                        ? "bg-purple-900 text-white shadow-md"
                        : "text-gray-300 hover:bg-purple-800 hover:text-white"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${isActive ? "text-purple-400" : "text-current"} transition-transform group-hover:scale-110`}
                    />
                    {!isCollapsed && <span className="font-medium">{link.label}</span>}
                  </Link>
                </li>
              )
            })}
        </ul>
      </nav>

      {/* Bottom Links */}
      <div className="mt-auto border-t border-gray-700 pt-4 px-2">
        <ul className="space-y-2">
          {navigationLinks
            .filter((link) => link.category === "bottom")
            .map((link) => {
              const Icon = link.icon
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`flex items-center space-x-3 p-2 rounded-md text-gray-300 hover:bg-purple-800 hover:text-white transition-all duration-200`}
                  >
                    <Icon className="w-5 h-5" />
                    {!isCollapsed && <span className="font-medium">{link.label}</span>}
                  </Link>
                </li>
              )
            })}
          <li>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 p-2 w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-md transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar

