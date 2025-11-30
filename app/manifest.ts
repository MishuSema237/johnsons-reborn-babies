import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Joanna's Reborns",
        short_name: "Joanna's Reborns",
        description: "Handcrafted silicone reborn babies designed with passion and precision.",
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#db2777',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/assets/baby1.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/assets/baby1.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
