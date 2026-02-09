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
}

export function AppSidebar({ ...props }) {
  const { state, setOpen } = useSidebar()

  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      variant="inset"
      className="border text-muted-foreground"
      // onMouseEnter={() => {
      //   if (isDesktop && state === 'collapsed') {
      //     setOpen(true)
      //   }
      // }}
      // onMouseLeave={() => {
      //   if (isDesktop && state === 'expanded') {
      //     setOpen(false)
      //   }
      // }}
    >
      <SidebarHeader>
        <div className="flex items-center justify-between w-full">
          {/* EXPANDED LOGO */}
          <div className="group-data-[state=collapsed]:hidden">
            <img src="/img/logo.svg" alt="logo" className="w-32 dark:hidden" />
            <img src="/img/logo-dark.svg" alt="logo" className="w-32 hidden dark:block" />
          </div>

          {/* COLLAPSED LOGO (ICON) */}
          <div className="hidden group-data-[state=collapsed]:flex">
            <img src="/img/logo-small.svg" alt="logo" className="w-8 h-8 mb-6" />
          </div>
        </div>

        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent className="sidebar-scroll">
        <NavSecondary items={data.main} name="main" />
        <NavSecondary items={data.people} name="people" />
        <NavSecondary items={data.attendance} name="attendance list" />
        <NavSecondary items={data.attendanceMark} name="mark attendance" />
        <NavSecondary items={data.fees} name="fees" />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function NavMain({ items, name }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{name}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
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
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
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
