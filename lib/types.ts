export type UserRole = 'citizen' | 'authority' | 'admin'

export type ComplaintCategory = 'roads' | 'water' | 'electricity' | 'sanitation' | 'streetlights' | 'drainage'

export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected'

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: "user" | "admin"
  created_at: string
} | null

export interface Complaint {
  id: string
  user_id: string
  category: ComplaintCategory
  title: string
  description: string
  latitude: number | null
  longitude: number | null
  address: string | null
  status: ComplaintStatus
  priority: ComplaintPriority
  assigned_to: string | null
  image_url: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
  // Joined data
  profiles?: Profile
  assigned_profile?: Profile
}

export interface ComplaintUpdate {
  id: string
  complaint_id: string
  user_id: string
  status: ComplaintStatus
  comment: string | null
  created_at: string
  // Joined data
  profiles?: Profile
}

export const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  roads: 'Roads & Potholes',
  water: 'Water Supply',
  electricity: 'Electricity',
  sanitation: 'Sanitation & Garbage',
  streetlights: 'Street Lights',
  drainage: 'Drainage & Flooding',
}

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  rejected: 'Rejected',
}

export const PRIORITY_LABELS: Record<ComplaintPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}
