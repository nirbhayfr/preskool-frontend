import { Calendar, Clock } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { ModeToggle } from './ModeToggle'
import { FullscreenButton } from './FullscreenToggle'
import { ProfileMenu } from './Profile'
import { SidebarTrigger } from '../ui/sidebar'
import AddNew from './AddNew'
import ClockDisplay from './ClockDisplay'

function Header() {
  const currentYear = new Date().getFullYear()
  const nextYear = currentYear + 1
  return (
    <header className="p-3 px-2 md:px-6 flex justify-between md:justify-end items-center w-full ">
      <SidebarTrigger className="md:hidden" />
      <div className="flex gap-2 items-center">
        <ClockDisplay />

        <Button variant="outline" size="sm" className="gap-2 pointer-events-none">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <p className="font-medium">
            <span className="hidden sm:inline-block mr-2">Academic Year</span>
            {currentYear} – {nextYear}
          </p>
        </Button>

        <AddNew />

        <ModeToggle />

        <FullscreenButton />

        <ProfileMenu />
      </div>
    </header>
  )
}

export default Header
