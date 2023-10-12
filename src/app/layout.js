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
      {/* <link rel="icon" href="./favicon.svg" type="image/svg" /> */}
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

      <Script id="tawk.to">
        {`
          var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
          (function () {
            var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/60eac4b6d6e7610a49aab375/1faah0r3e';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode.insertBefore(s1, s0);
          })();
        `}
      </Script>

      <Script id="bit-assist">
        {`
        var bit_assist_ = {api: {"base": "https://formsintegrations.com/wp-json/bit-assist/v1", "separator": "?" } };
        (function () { var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://formsintegrations.com/wp-content/plugins/bit-assist/iframe/bit-assist.js'; t = document.getElementsByTagName('script')[0]; t.parentNode.insertBefore(s, t) })()
        `}
      </Script>
    </html>
  )
}
