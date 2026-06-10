import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GameHive - Discover, Track, and Manage Your Games",
  description:
    "GameHive is the ultimate game discovery platform. Search games, track prices, find deals, and manage your collections across IGDB, Steam, and IsThereAnyDeal.",
  keywords: [
    "games",
    "game discovery",
    "game tracker",
    "game deals",
    "game prices",
    "steam",
    "igdb",
    "isthereanydeal",
    "game collection",
    "wishlist",
  ],
  authors: [{ name: "GameHive Team" }],
  creator: "GameHive",
  publisher: "GameHive",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gamehive.com",
    siteName: "GameHive",
    title: "GameHive - Discover, Track, and Manage Your Games",
    description:
      "GameHive is the ultimate game discovery platform. Search games, track prices, find deals, and manage your collections.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameHive - Discover, Track, and Manage Your Games",
    description:
      "GameHive is the ultimate game discovery platform. Search games, track prices, find deals, and manage your collections.",
    creator: "@gamehive",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GameHive",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#101010" },
    { media: "(prefers-color-scheme: dark)", color: "#101010" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

// Service Worker Registration Component
function ServiceWorkerRegistration() {
  return (
    <>
      {/* Register service worker for PWA */}
      <Script id="service-worker-register" strategy="afterInteractive">
        {`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                  console.log('ServiceWorker registration successful');
                })
                .catch(err => {
                  console.log('ServiceWorker registration failed: ', err);
                });
            });
          }
        `}
      </Script>
      
      {/* PWA install prompt */}
      <Script id="pwa-install" strategy="afterInteractive">
        {`
          let deferredPrompt;
          
          window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button
            const installBtn = document.getElementById('pwa-install-btn');
            if (installBtn) {
              installBtn.style.display = 'block';
            }
          });
          
          function showInstallPrompt() {
            if (deferredPrompt) {
              deferredPrompt.prompt();
              deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                  console.log('User accepted the install prompt');
                } else {
                  console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
              });
            }
          }
          
          // Check if app is already installed
          window.addEventListener('appinstalled', (evt) => {
            console.log('GameHive was installed');
            const installBtn = document.getElementById('pwa-install-btn');
            if (installBtn) {
              installBtn.style.display = 'none';
            }
          });
        `}
      </Script>
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external APIs */}
        <link rel="preconnect" href="https://api.igdb.com" />
        <link rel="preconnect" href="https://api.isthereanydeal.com" />
        <link rel="preconnect" href="https://api.steampowered.com" />
        <link rel="preconnect" href="https://images.igdb.com" />
        <link rel="preconnect" href="https://cdn.akamai.steamstatic.com" />
        
        {/* Preload fonts */}
        <link rel="preload" href="/fonts/Inter.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Meta tags for PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="GameHive" />
        <meta name="msapplication-TileColor" content="#101010" />
        <meta name="msapplication-tap-highlight" content="transparent" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="theme-color" content="#101010" />
      </head>
      <body className={inter.className}>
        <Providers>
          <ServiceWorkerRegistration />
          {children}
        </Providers>
      </body>
    </html>
  );
}
