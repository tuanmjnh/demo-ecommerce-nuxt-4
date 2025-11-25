export default defineAppConfig({
  toaster: {
    position: 'top-center' as const,
    duration: 5000,
    max: 5,
    process: false,
    expand: true
  },
  theme: {
    radius: 0.25,
    blackAsPrimary: false
  },
  ui: {
    colors: {
      primary: 'gold',//'blue',
      neutral: 'slate',
      gray: 'neutral',
    }
  }
})
