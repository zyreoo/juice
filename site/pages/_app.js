import "@/styles/globals.css";
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        defer
        data-domain="juice.hackclub.com"
        src="https://plausible.io/js/script.js"
      />
      <Component {...pageProps} />
    </>
  );
}
