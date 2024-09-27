import ToggleThemeButton from '@/components/ToggleThemeButton/ToggleThemeButton';
import { ThemeProvider } from '@designcise/next-theme-toggle';
import { themes } from '@designcise/next-theme-toggle/server';
import { Analytics } from '@vercel/analytics/react';
import 'large-small-dynamic-viewport-units-polyfill';
import { Poppins } from 'next/font/google';
import Script from 'next/script';
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
        <Analytics />
      </body>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-5XCDC75JBJ" />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
  
          gtag('config', 'G-5XCDC75JBJ');
        `}
      </Script>
    </html>
  )
}
