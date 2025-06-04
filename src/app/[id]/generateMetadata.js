import { formatStudentId, isObjectEmpty } from '@/utils/helpers'
import { PRIMARY_DOMAIN, SECONDARY_DOMAIN } from '@/utils/domains'

export async function generateMetadata({ params }) {
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
        // Reference to secondary domain for SEO
        other: {
          backup: `${SECONDARY_DOMAIN}/${id}`,
        },
      },
    }
  } catch (error) {
    // Fallback metadata
    return {
      title: `Student Result | PCIU Result`,
      description:
        'View student results and CGPA at Port City International University.',
    }
  }
}
