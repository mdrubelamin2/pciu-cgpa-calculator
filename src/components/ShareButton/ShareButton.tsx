'use client'

import { $studentInfo } from '@/atoms/global'
import { copyToClipboard, showToast } from '@/utils/helpers'
import { useAtomValue } from 'jotai'
import Image from 'next/image'
import styles from './style.module.css'

export default function ShareButton() {
  const studentInfo = useAtomValue($studentInfo)
  const copyShareUrl = () => {
    const domain = window.location.origin
    let studentId = studentInfo.studentIdNo || ''
    studentId = studentId.replace(/[^a-zA-Z0-9]/g, '')
    const shareUrl = encodeURI(`${domain}/${studentId}`)
    copyToClipboard(shareUrl)
      .then(() => showToast('Shareable link copied to clipboard', 'success'))
      .catch(() => showToast('Failed to copy'))
  }

  return (
    <button className={styles.btn} onClick={copyShareUrl}>
      <Image
        src='/images/share.svg'
        className='share-img'
        width={13}
        height={13}
        alt='Share'
      />
      <span>Share</span>
    </button>
  )
}
