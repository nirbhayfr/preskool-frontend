import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState, memo } from 'react'

const ClockDisplay = memo(function ClockDisplay() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatted = now.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2 pointer-events-none max-lg:hidden"
    >
      <Clock className="h-4 w-4 text-muted-foreground" />
      <span className="font-medium">{formatted}</span>
    </Button>
  )
})

export default ClockDisplay
