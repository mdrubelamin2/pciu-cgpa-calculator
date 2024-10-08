import ToggleThemeButton from '@/components/ToggleThemeButton/ToggleThemeButton';
import { ThemeProvider } from '@designcise/next-theme-toggle';
import { themes } from '@designcise/next-theme-toggle/server';
import { GoogleAnalytics } from '@next/third-parties/google';
import 'large-small-dynamic-viewport-units-polyfill';
import { Poppins } from 'next/font/google';
import "toastify-js/src/toastify.css";
import './globals.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata = {
  title: 'Port City International University Online Result',
  description: 'Check Results and calculate the Cumulative Grade Point Average(CGPA/GPA) for Port City International University (PCIU) students on online',
  keywords: ['PCIU', 'Port City International University', 'PCIU CGPA Calculator', 'PCIU Result', 'PCIU GPA'],
  authors: [{ name: 'Md Rubel Amin', url: 'https://github.com/mdrubelamin2/' }],
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  themeColor: '#fffbef',
  icons: { apple: '/images/pciu-logo.png' }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} before-search`}>
        <ThemeProvider storageKey="pciu-cgpa-calculator" defaultTheme={themes.light.type}>
          <ToggleThemeButton />
          {children}
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-5XCDC75JBJ" />
    </html>
  )
}
