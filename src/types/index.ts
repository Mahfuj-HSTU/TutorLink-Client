export type UserRole = 'STUDENT' | 'TUTOR' | 'ADMIN'
export type TeachingMode = 'ONLINE' | 'OFFLINE' | 'BOTH'
export type BookingStatus = 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

export interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image?: string
  role: UserRole
  phone?: string
  isBanned: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TutorProfile {
  id: string
  userId: string
  headline?: string
  bio?: string
  hourlyRate: number
  experience?: number
  qualification?: string
  languages: string[]
  teachingMode: TeachingMode
  isVerified: boolean
  isAvailable: boolean
  rating: number
  totalReviews: number
  createdAt: string
  updatedAt: string
  user: User
  categories: Category[]
  reviews?: Review[]
}

export interface Booking {
  id: string
  studentId: string
  tutorId: string
  startTime: string
  endTime: string
  price: number
  questions?: string
  status: BookingStatus
  createdAt: string
  updatedAt: string
  tutor?: {
    user: Pick<User, 'id' | 'name' | 'image'>
  }
  student?: Pick<User, 'id' | 'name' | 'image'>
  review?: Review
}

export interface Review {
  id: string
  rating: number
  comment?: string
  studentId: string
  tutorId: string
  bookingId: string
  createdAt: string
  student?: Pick<User, 'id' | 'name' | 'image'>
}

export interface CreateTutorProfilePayload {
  headline?: string
  bio?: string
  hourlyRate: number
  experience?: number
  qualification?: string
  languages?: string[]
  teachingMode: TeachingMode
}

export interface CreateBookingPayload {
  tutorId: string
  startTime: string
  endTime: string
  price: number
  questions: string
}

export interface CreateReviewPayload {
  rating: number
  comment?: string
  tutorId: string
  bookingId: string
}

export interface CreateCategoryPayload {
  name: string
  slug: string
  isActive?: boolean
}

export interface TutorQueryParams {
  category?: string
  minRate?: number
  maxRate?: number
  search?: string
}
export interface FeaturedTutorStats {
  displayName: string
  subject: string
  monthsOnPlatform: number
  hourlyRate: number
  monthlyEarnings: number
  monthlySessionCount: number
  monthlyStudentCount: number
  totalEarnings: number
  totalSessionCount: number
  rating: number
  weeklyActivity: number[]
}

export interface PlatformStats {
  tutorCount: number
  studentCount: number
  subjectCount: number
  avgRating: number
  avgHourlyRate: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface AuthSession {
  user: User
  session: {
    id: string
    token: string
    expiresAt: string
  }
}
