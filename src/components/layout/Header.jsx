import { Calendar, Clock, Download } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { ModeToggle } from './ModeToggle'
import { FullscreenButton } from './FullscreenToggle'
import { ProfileMenu } from './Profile'
import { SidebarTrigger } from '../ui/sidebar'
import AddNew from './AddNew'
import ClockDisplay from './ClockDisplay'
import { decryptData } from '@/utils/crypto'
import { installApp } from '../extra/InstallButton'
import { useIsPWA } from '@/hooks/usePWA'

function Header() {
  const encryptedUser = localStorage.getItem('user')
  const user = encryptedUser ? decryptData(encryptedUser) : null
  const currentYear = new Date().getFullYear()
  const nextYear = currentYear + 1
  const isPWA = useIsPWA()
  return (
    <header className="p-3 px-2 md:px-6 flex justify-between md:justify-end items-center w-full ">
      <SidebarTrigger className="mr-auto" />
      <div className="flex gap-2 items-center">
        <ClockDisplay />

        <Button variant="outline" size="sm" className="gap-2 pointer-events-none">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <p className="font-medium">
            <span className="hidden sm:inline-block mr-2">Academic Year</span>
            {currentYear} – {nextYear}
          </p>
        </Button>

        {user?.Role === 'Admin' && <AddNew />}

        <ModeToggle />

        <FullscreenButton />

        <ProfileMenu />

        {!isPWA && (
          <Button onClick={installApp} className="flex items-center justify-center gap-2">
            <Download className="h-5 w-5 sm:hidden" />
            <span className="hidden sm:flex items-center gap-2">
              <Download className="h-4 w-4" />
              Install App
            </span>
          </Button>
        )}
      </div>
    </header>
  )
}

export default Header
