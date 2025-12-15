import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
      default: 'Legit - The infrastructure for write-enabled AI',
      template: '%s | Legit'
    },
    description: 'AI is moving from a passive assistant to an active collaborator. Legit provides the infrastructure to track, control, and coordinate every change in a world where agents can write.',
    keywords: ['AI', 'artificial intelligence', 'version control', 'AI infrastructure', 'write-enabled AI', 'AI collaboration', 'AI agents', 'machine learning'],
    authors: [{ name: 'Legit Control' }],
    creator: 'Legit Control',
    publisher: 'Legit Control',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://legitcontrol.com'),
    alternates: {
      canonical: '/',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://legitcontrol.com',
      siteName: 'Legit',
      title: 'Legit - The infrastructure for write-enabled AI',
      description: 'AI is moving from a passive assistant to an active collaborator. Legit provides the infrastructure to track, control, and coordinate every change in a world where agents can write.',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'Legit - The infrastructure for write-enabled AI',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Legit - The infrastructure for write-enabled AI',
      description: 'AI is moving from a passive assistant to an active collaborator. Legit provides the infrastructure to track, control, and coordinate every change in a world where agents can write.',
      images: ['/og-image.png'],
      creator: '@legitcontrol',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code', // Replace with actual verification code
    },
  }