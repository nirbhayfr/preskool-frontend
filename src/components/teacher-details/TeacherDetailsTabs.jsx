import { useLocation, useNavigate } from 'react-router-dom'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { User, ClipboardCheck, CreditCard, BookOpen } from 'lucide-react'

const tabs = [
  { label: 'Teacher Details', value: 'details', icon: User },
  {
    label: 'Leave & Attendance',
    value: 'attendance',
    icon: ClipboardCheck,
  },
  { label: 'Salary', value: 'salary', icon: CreditCard },
  { label: 'Library', value: 'library', icon: BookOpen },
]

function TeacherDetailsTabsLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const activeTab = location.pathname.split('/').pop() ?? 'details'

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto rounded-none">
        <ToggleGroup
          type="single"
          value={activeTab}
          onValueChange={(val) => val && navigate(val)}
          className="
						w-full flex-nowrap justify-start
						border-b
						min-w-max
						rounded-xs
					"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon

            return (
              <ToggleGroupItem
                key={tab.value}
                value={tab.value}
                className="
									flex items-center gap-2
									whitespace-nowrap
									rounded-none px-4 py-2
									border-b-2 border-transparent
									text-muted-foreground
									transition-colors
									hover:text-foreground
									hover:bg-muted/50
									data-[state=on]:border-primary
									data-[state=on]:text-primary
									data-[state=on]:bg-transparent
								"
              >
                <Icon className="size-4" />
                <span className="text-sm font-normal">{tab.label}</span>
              </ToggleGroupItem>
            )
          })}
        </ToggleGroup>
      </div>
    </div>
  )
}

export default TeacherDetailsTabsLayout
