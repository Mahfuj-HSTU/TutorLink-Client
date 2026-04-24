import type {
	ApiResponse,
	TutorProfile,
	Category,
	TutorQueryParams,
	PlatformStats,
	FeaturedTutorStats
} from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL
	? `${process.env.NEXT_PUBLIC_API_URL}/api`
	: 'http://localhost:5000/api'

export async function fetchTutors(
	params?: TutorQueryParams
): Promise<TutorProfile[]> {
	const qs = new URLSearchParams()
	if (params?.search) qs.set('search', params.search)
	if (params?.category) qs.set('category', params.category)
	if (params?.minRate != null) qs.set('minRate', String(params.minRate))
	if (params?.maxRate != null) qs.set('maxRate', String(params.maxRate))
	const url = `${BASE}/tutors${qs.toString() ? `?${qs}` : ''}`

	const res = await fetch(url, { next: { revalidate: 60 } })
	if (!res.ok) return []
	const json: ApiResponse<TutorProfile[]> = await res.json()
	return json.data ?? []
}

export async function fetchTutorById(id: string): Promise<TutorProfile | null> {
	const res = await fetch(`${BASE}/tutors/${id}`, { cache: 'no-store' })
	if (!res.ok) return null
	const json: ApiResponse<TutorProfile> = await res.json()
	return json.data ?? null
}

export async function fetchCategories(): Promise<Category[]> {
	const res = await fetch(`${BASE}/categories`, { next: { revalidate: 3600 } })
	if (!res.ok) return []
	const json: ApiResponse<Category[]> = await res.json()
	return json.data ?? []
}

export async function fetchPlatformStats(): Promise<PlatformStats> {
	const fallback: PlatformStats = {
		tutorCount: 0,
		studentCount: 0,
		subjectCount: 0,
		avgRating: 0,
		avgHourlyRate: 0
	}
	const res = await fetch(`${BASE}/stats`, { next: { revalidate: 300 } })
	if (!res.ok) return fallback
	const json: ApiResponse<PlatformStats> = await res.json()
	return { ...fallback, ...(json.data ?? {}) }
}

export async function fetchFeaturedTutor(): Promise<FeaturedTutorStats | null> {
	const res = await fetch(`${BASE}/stats/featured-tutor`, {
		next: { revalidate: 300 }
	})
	if (!res.ok) return null
	const json: ApiResponse<FeaturedTutorStats | null> = await res.json()
	return json.data ?? null
}
