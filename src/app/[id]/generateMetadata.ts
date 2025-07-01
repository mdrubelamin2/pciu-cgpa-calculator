import { formatStudentId, isObjectEmpty } from '@/utils/helpers'
import type { PageProps } from '../../../types'

export async function generateMetadata({ params }: PageProps) {
  try {
    const { id } = await params
    const studentId = formatStudentId(id)

    const response = await fetch(`/api/student/${studentId}`)
    const studentInfo = await response.json()

    if (isObjectEmpty(studentInfo)) {
      return {
        title: 'Student Not Found | PCIU Result',
        description: 'The requested student ID was not found in our database.',
      }
    }

    // Create optimized metadata for this specific student
    return {
      title: `${studentInfo.studentName} (${studentId}) | PCIU Result`,
      description: `View academic results and CGPA for ${studentInfo.studentName}, ${studentInfo.studentDepartment}, ${studentInfo.studentSession} session at Port City International University.`,
      openGraph: {
        title: `${studentInfo.studentName} | PCIU Result`,
        description: `${studentInfo.studentDepartment} student results and CGPA calculation for ${studentInfo.studentName} (${studentId}).`,
      },
      twitter: {
        title: `${studentInfo.studentName} | PCIU Result`,
        description: `${studentInfo.studentDepartment} student results and CGPA calculation for ${studentInfo.studentName}.`,
      },
      alternates: {
        canonical: `/${id}`,
      },
    }
  } catch (_error) {
    // Fallback metadata
    return {
      title: `Student Result | PCIU Result`,
      description:
        'View student results and CGPA at Port City International University.',
    }
  }
}
