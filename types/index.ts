// Student Information Types
export interface StudentInfo {
  studentIdNo?: string
  StudentName?: string
  studentProgram?: string
  studentSession?: string
  studentBatch?: string
  Shift?: string
}

// Course and Grade Types
export interface Course {
  courseCode: string
  courseTitle: string
  creditHr: number
  LetterGrade: string
  GradePoint: number
  status?: string
  semester?: string
  GPA?: number
}

export interface Grade {
  letter: string
  point: number
}

// Trimester Result Types
export interface TrimesterResult {
  trimester: string
  year: string
  currentGPA: number
  totalCreditHrs: number
  completedCreditHrs: number
  individuals: Course[]
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Next.js Page Props Types
export interface PageProps {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export interface TrimesterPageProps {
  params: { 
    studentId: string
    trimester: string 
  }
}

// Component Props Types
export interface ChildrenProps {
  children: React.ReactNode
}

export interface SSRProviderProps extends ChildrenProps {
  studentId: string
  studentInfo: StudentInfo
  allResults: TrimesterResult[]
}

// Cache Types
export interface CacheOptions {
  ttl: number
  max: number
}

// Chart Data Types
export interface ChartDataset {
  label: string
  data: number[]
  borderColor: string
  backgroundColor: string
  tension: number
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

// Form Event Types
export type FormEvent = React.FormEvent<HTMLFormElement>
export type ChangeEvent = React.ChangeEvent<HTMLInputElement>
export type MouseEvent = React.MouseEvent<HTMLElement>

// Utility Types
export type SetStateAction<T> = React.Dispatch<React.SetStateAction<T>>
