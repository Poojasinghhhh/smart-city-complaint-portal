"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react"

interface StatusBadgeProps {
  status: string
  className?: string
  showIcon?: boolean
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
          icon: Clock,
          label: "Pending"
        }
      case 'in_progress':
        return {
          className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
          icon: AlertCircle,
          label: "In Progress"
        }
      case 'resolved':
        return {
          className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
          icon: CheckCircle,
          label: "Resolved"
        }
      case 'rejected':
        return {
          className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
          icon: XCircle,
          label: "Rejected"
        }
      default:
        return {
          className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
          icon: Clock,
          label: status
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge
      className={cn(
        "transition-all duration-200 transform hover:scale-105 border",
        config.className,
        className
      )}
    >
      <div className="flex items-center gap-1">
        {showIcon && <Icon className="h-3 w-3" />}
        <span className="font-medium">{config.label}</span>
      </div>
    </Badge>
  )
}

interface PriorityBadgeProps {
  priority: string
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const getPriorityConfig = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return {
          className: "bg-red-500 text-white border-red-600 hover:bg-red-600",
          label: "Urgent"
        }
      case 'high':
        return {
          className: "bg-orange-500 text-white border-orange-600 hover:bg-orange-600",
          label: "High"
        }
      case 'medium':
        return {
          className: "bg-yellow-500 text-white border-yellow-600 hover:bg-yellow-600",
          label: "Medium"
        }
      case 'low':
        return {
          className: "bg-gray-500 text-white border-gray-600 hover:bg-gray-600",
          label: "Low"
        }
      default:
        return {
          className: "bg-gray-500 text-white border-gray-600 hover:bg-gray-600",
          label: priority
        }
    }
  }

  const config = getPriorityConfig(priority)

  return (
    <Badge
      className={cn(
        "transition-all duration-200 transform hover:scale-105 border",
        config.className,
        className
      )}
    >
      <span className="font-medium">{config.label}</span>
    </Badge>
  )
}
