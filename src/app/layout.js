import ToggleThemeButton from '@/components/ToggleThemeButton/ToggleThemeButton';
import { ThemeProvider } from '@/components/ThemeProvider';
import { PRIMARY_DOMAIN, SECONDARY_DOMAIN } from '@/utils/domains';
import { GoogleAnalytics } from '@next/third-parties/google';
import 'large-small-dynamic-viewport-units-polyfill';
import { Poppins } from 'next/font/google';
import "toastify-js/src/toastify.css";
import './globals.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata = {
  metadataBase: new URL(PRIMARY_DOMAIN),
  title: 'Port City International University Result & CGPA Calculator',
  description: 'Check Results and calculate the Cumulative Grade Point Average (CGPA/GPA) for Port City International University (PCIU) students online. View semester-wise results and visualize your academic progress.',
  keywords: ['PCIU', 'Port City International University', 'PCIU CGPA Calculator', 'PCIU Result', 'PCIU GPA', 'Port City University', 'CGPA Calculator', 'University Result'],
  authors: [{ name: 'Md Rubel Amin', url: 'https://github.com/mdrubelamin2/' }],
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  icons: { apple: '/images/pciu-logo.png' },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
    other: {
      'backup': SECONDARY_DOMAIN,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'PCIU Result & CGPA Calculator',
    title: 'Port City International University Result & CGPA Calculator',
    description: 'Check Results and calculate the Cumulative Grade Point Average (CGPA/GPA) for Port City International University (PCIU) students online.',
    images: [{
      url: '/images/pciu-logo.png',
      width: 512,
      height: 512,
      alt: 'PCIU Logo',
    }],
  },
  twitter: {
    card: 'summary',
    title: 'PCIU Result & CGPA Calculator',
    description: 'Check Results and calculate CGPA for Port City International University students',
    images: ['/images/pciu-logo.png'],
  }
}

export const viewport = {
  themeColor: '#fffbef',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} before-search`}>
        <ThemeProvider>
          <ToggleThemeButton />
          {children}
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-5XCDC75JBJ" />
    </html>
  )
}
