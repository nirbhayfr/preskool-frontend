import * as React from 'react'
import {
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  UserCog,
  Users,
  ChevronsUpDown,
  LogOut,
  Calendar,
  Clock,
  CircleDollarSign,
  HandCoins,
  CalendarDays,
  ListCheck,
  Banknote,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { decryptData } from '@/utils/crypto'

const data = {
  user: {
    name: 'Global International',
    image: '/img/icons/global-img.svg',
  },
  main: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutDashboard,
    },
  ],
  people: [
    {
      title: 'Student List',
      url: '/student-list',
      icon: GraduationCap,
    },
    {
      title: 'Teacher List',
      url: '/teacher-list',
      icon: Users,
    },
    {
      title: 'Staff List',
      url: '/staff-list',
      icon: UserCog,
    },
  ],
  attendance: [
    {
      title: 'Student Attendance',
      url: '/student-attendance',
      icon: GraduationCap,
    },
    {
      title: 'Teacher Attendance',
      url: '/teacher-attendance',
      icon: Users,
    },
    {
      title: 'Staff Attendance',
      url: '/staff-attendance',
      icon: UserCog,
    },
  ],
  attendanceMark: [
    {
      title: 'Take Student Attendance',
      url: '/take-student-attendance',
      icon: GraduationCap,
    },
    {
      title: 'Take Teacher Attendance',
      url: '/take-teacher-attendance',
      icon: Users,
    },

    {
      title: 'Take Staff Attendance',
      url: '/take-staff-attendance',
      icon: UserCog,
    },
  ],

  fees: [
    {
      title: 'Fee Structure',
      url: '/fee-structure',
      icon: CircleDollarSign,
    },
  ],
  salary: [
    {
      title: 'Teacher Salary',
      url: '/teacher-salary',
      icon: HandCoins,
    },
    {
      title: 'Pay Teacher Salary',
      url: '/pay-teacher-salary',
      icon: Banknote,
    },
    {
      title: 'Staff Salary',
      url: '/staff-salary',
      icon: HandCoins,
    },

    {
      title: 'Pay Staff Salary',
      url: '/pay-staff-salary',
      icon: Banknote,
    },
  ],
  additional: [
    {
      title: 'Exam Result',
      url: '/exam-result',
      icon: ListCheck,
    },
    {
      title: 'Class TimeTable',
      url: '/class-timetable',
      icon: CalendarDays,
    },
  ],
}

function getSidebarDataByRole(role) {
  if (role === 'Admin') return data

  if (role === 'Teacher') {
    return {
      ...data,
      people: data.people.filter((item) => item.title === 'Student List'),
      attendance: data.attendance.filter((item) => item.title === 'Student Attendance'),
      attendanceMark: data.attendanceMark.filter(
        (item) => item.title === 'Take Student Attendance'
      ),
      fees: [], // teachers don’t see fees
      salary: [],
    }
  }

  if (role === 'Student') {
    return {
      ...data,
      people: [],
      attendance: [],
      attendanceMark: [],
      fees: [],
      salary: [],
      additional: [],
    }
  }

  if (role === 'Librarian') {
    return {
      ...data,
      people: [],
      attendance: [],
      attendanceMark: [],
      fees: [],
      salary: [],
      additional: [],
    }
  }

  return data
}

export function AppSidebar({ ...props }) {
  const encryptedUser = localStorage.getItem('user')
  const user = encryptedUser ? decryptData(encryptedUser) : null
  const sidebarData = getSidebarDataByRole(user?.Role)

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      variant="inset"
      className="border text-muted-foreground"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between w-full">
          <div className="group-data-[state=collapsed]:hidden">
            <img src="/img/logo.svg" alt="logo" className="w-32 dark:hidden" />
            <img src="/img/logo-dark.svg" alt="logo" className="w-32 hidden dark:block" />
          </div>

          <div className="hidden group-data-[state=collapsed]:flex">
            <img src="/img/logo-small.svg" alt="logo" className="w-8 h-8 mb-6" />
          </div>
        </div>

        <NavUser user={data.user} />
      </SidebarHeader>

      <SidebarContent className="sidebar-scroll">
        <NavSecondary items={sidebarData.main} name="main" />

        {sidebarData.people?.length > 0 && (
          <NavSecondary items={sidebarData.people} name="people" />
        )}

        {sidebarData.attendance?.length > 0 && (
          <NavSecondary items={sidebarData.attendance} name="attendance list" />
        )}

        {sidebarData.attendanceMark?.length > 0 && (
          <NavSecondary items={sidebarData.attendanceMark} name="mark attendance" />
        )}

        {sidebarData.salary?.length > 0 && (
          <NavMain items={sidebarData.salary} name="salary" />
        )}

        {sidebarData.additional?.length > 0 && (
          <NavSecondary items={sidebarData.additional} name="additional" />
        )}

        {sidebarData.fees?.length > 0 && (
          <NavSecondary items={sidebarData.fees} name="fees" />
        )}
      </SidebarContent>

      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}

function NavMain({ items, name }) {
  return (
    <SidebarGroup>
      <Collapsible defaultOpen className="group/navmain">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={name}>
              <span className="text-xs font-medium uppercase tracking-wide text-sidebar-foreground/70">
                {name}
              </span>

              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/navmain:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible className="group/sub">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/sub:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarGroup>
  )
}

function NavSecondary({ items, name }) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : ''

  const isActive = (url) => {
    if (url === '/') return pathname === '/'
    return pathname === url || pathname.startsWith(url + '/')
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase font-semibold">{name}</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => {
          const active = isActive(item.url)

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={active}
                className="data-[active=true]:text-sidebar-primary"
              >
                <a href={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavUser({ user }) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
