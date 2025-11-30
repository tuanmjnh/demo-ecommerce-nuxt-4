// https://nuxt.com/docs/api/configuration/nuxt-config
// import { fileURLToPath } from 'node:url'
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/i18n',
    'motion-v/nuxt'
  ],

  compatibilityDate: '2025-11-25',

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || ''
    },
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    mongodbName: process.env.MONGODB_NAME || 'demo-ecommerce',
    jwt_secret: process.env.JWT_SECRET || '03890a36-8888-45fe-8aa4-efb24469afb0',
    jwt_expire: '1d',
    jwt_refresh_expire: 2592000000, // 30 Day
    max_devices_pc: 0, // 0 = unlimited
    max_devices_web: 0, // 0 = unlimited
    max_devices_mobile: 0, // 0 = unlimited
    max_devices_tablet: 0, // 0 = unlimited
    route_load_mode: 'static',
    ffmpeg_configuration_sync: true,
    password_reset: 'Bk123456@',
    split_string: '|;*;|',
    // CLOUDINARY
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
    // GOOGLE
    googleClientId: '',     // NUXT_GOOGLE_CLIENT_ID
    googleClientSecret: '', // NUXT_GOOGLE_CLIENT_SECRET
    googleRedirectUri: '',  // NUXT_GOOGLE_REDIRECT_URI
  },

  devtools: {
    enabled: true
  },
  // disable sourcemap for build
  sourcemap: {
    server: false,
    client: false
  },
  // colorMode: {
  //   preference: 'system', // Default value: 'light', 'dark', or 'system'
  //   fallback: 'light',   // If the system is not determined, use this
  //   storageKey: 'luxedesign-color-mode' // Key name saved in LocalStorage/Cookie
  // },

  app: {
    head: {
      titleTemplate: '%s - Công Ty Kiến Trúc Sư Bắc Kạn',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]
    }
  },

  css: ['~/assets/css/main.css'],

  image: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'plus.unsplash.com'],
    alias: {
      cloudinary: 'https://res.cloudinary.com',
      unsplashPlus: 'https://plus.unsplash.com',
      unsplashImages: 'https://images.unsplash.com'
    }
  },

  // routeRules: {
  //   // '/docs': { redirect: '/docs/getting-started', prerender: false },
  //   '/': { prerender: true },
  //   '/api/menu/public': { swr: 3600 },
  //   '/api/company/public': { swr: 3600 },
  //   // '/api/**': {
  //   //   cors: true
  //   // }
  // },

  nitro: {
    preset: 'vercel',
    // prerender: {
    //   routes: [
    //     '/'
    //   ],
    //   crawlLinks: true
    // }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  // configure the module using `pinia` property
  // pinia: {
  //   /**
  //    * Automatically add stores dirs to the auto imports. This is the same as
  //    * directly adding the dirs to the `imports.dirs` option. If you want to
  //    * also import nested stores, you can use the glob pattern `./stores/**`
  //    * (on Nuxt 3) or `app/stores/**` (on Nuxt 4+)
  //    *
  //    * @default `['stores']`
  //    */
  //   storesDirs: ['app/stores/**']
  // },
  // Default Configuration for Persisted State Using Cookies
  piniaPluginPersistedstate: {
    storage: 'cookies',
    cookieOptions: {
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // Save for 7 days
    }
  },
  i18n: {
    // strategy: 'no_prefix',
    // legacy: false,
    defaultLocale: 'viVN',
    langDir: 'locales',
    // locales: [
    //   { code: 'vi', name: 'Tiếng Việt', language: 'vi-VN' },
    //   { code: 'en', name: 'English', language: 'en-US' }
    // ],
    locales: [
      { code: 'enUS', file: 'enUS.json', name: 'Tiếng Việt' },
      { code: 'viVN', file: 'viVN.json', name: 'English' },
      { code: 'jaJP', file: 'jaJP.json', name: 'jaJP' },
      { code: 'koKR', file: 'koKR.json', name: 'koKR' },
      { code: 'zhCN', file: 'zhCN.json', name: 'zhCN' }
    ]
  },
  typescript: {
    includeWorkspace: true,
    tsConfig: {
      include: [
        '../types/**/*.d.ts',
        '../server/**/*'
      ]
    }
  },
  imports: {
    dirs: ['types']
  },
  // alias: {
  //   "~/*": fileURLToPath(new URL('./app/*', import.meta.url)),
  //   "@/*": fileURLToPath(new URL('./*', import.meta.url)),
  //   "#types": fileURLToPath(new URL("./types", import.meta.url)),
  //   'images': fileURLToPath(new URL('./assets/images', import.meta.url)),
  //   'style': fileURLToPath(new URL('./assets/style', import.meta.url)),
  //   'data': fileURLToPath(new URL('./assets/other/data', import.meta.url)),
  //   'types': fileURLToPath(new URL('../demo-ecommerce-api/types', import.meta.url)),
  // }
})
