// ─── Enums ───────────────────────────────────────────────────────────────────

export type UserRole = "STUDENT" | "TUTOR" | "ADMIN";
export type TeachingMode = "ONLINE" | "OFFLINE" | "BOTH";
export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";

// ─── Core Models ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role: UserRole;
  phone?: string;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TutorProfile {
  id: string;
  userId: string;
  headline?: string;
  bio?: string;
  hourlyRate: number;
  experience?: number;
  qualification?: string;
  languages: string[];
  teachingMode: TeachingMode;
  isVerified: boolean;
  isAvailable: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  categories: Category[];
  reviews?: Review[];
}

export interface Booking {
  id: string;
  studentId: string;
  tutorId: string;
  startTime: string;
  endTime: string;
  price: number;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  tutor?: {
    user: Pick<User, "id" | "name" | "image">;
  };
  student?: Pick<User, "id" | "name" | "image">;
  review?: Review;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  studentId: string;
  tutorId: string;
  bookingId: string;
  createdAt: string;
  student?: Pick<User, "id" | "name" | "image">;
}

// ─── API Request Payloads ─────────────────────────────────────────────────────

export interface CreateTutorProfilePayload {
  headline?: string;
  bio?: string;
  hourlyRate: number;
  experience?: number;
  qualification?: string;
  languages?: string[];
  teachingMode: TeachingMode;
}

export interface CreateBookingPayload {
  tutorId: string;
  startTime: string;
  endTime: string;
  price: number;
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
  tutorId: string;
  bookingId: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  isActive?: boolean;
}

export interface TutorQueryParams {
  category?: string;
  minRate?: number;
  maxRate?: number;
  search?: string;
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ─── Auth Session ─────────────────────────────────────────────────────────────

export interface AuthSession {
  user: User;
  session: {
    id: string;
    token: string;
    expiresAt: string;
  };
}
