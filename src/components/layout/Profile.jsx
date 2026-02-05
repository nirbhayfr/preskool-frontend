import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Settings, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { decryptData } from '@/utils/crypto'
import { useMemo } from 'react'

export function ProfileMenu() {
  const navigate = useNavigate()

  const user = useMemo(() => {
    try {
      const encrypted = localStorage.getItem('user')
      return encrypted ? decryptData(encrypted) : null
    } catch {
      return null
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  const initials = user?.Username?.slice(0, 2).toUpperCase() ?? 'NA'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-ring">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/img/avatar.jpg" alt="User" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User info */}
        <DropdownMenuLabel className="flex gap-3 items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/img/avatar.jpg" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col leading-tight">
            <span className="font-medium">{user?.Username ?? 'Unknown User'}</span>
            <span className="text-xs text-muted-foreground">{user?.Role ?? '—'}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
