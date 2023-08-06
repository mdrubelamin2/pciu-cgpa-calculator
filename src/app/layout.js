import 'large-small-dynamic-viewport-units-polyfill';
import { Poppins } from 'next/font/google';
import Script from 'next/script';
import "toastify-js/src/toastify.css";
import './globals.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata = {
  title: 'PCIU CGPA Calculator - CGPA Calculator for Port City International University',
  description: 'Generate the CGPA (Cumulative Grade Point Average) based on your PCIU (Port City International University) results in a single click.',
  keywords: ['PCIU', 'Port City International University', 'PCIU CGPA Calculator', 'PCIU Result', 'PCIU CGPA'],
  authors: [{ name: 'Md Rubel Amin', url: 'https://github.com/mdrubelamin2/' }],
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} before-search`}>{children}</body>
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
