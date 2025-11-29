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
    },
    prose: {
      img: {
        slots: {
          base: 'rounded-md w-full',
          overlay: 'fixed inset-0 bg-default/75 backdrop-blur-sm will-change-opacity',
          content: 'fixed inset-0 flex items-center justify-center cursor-zoom-out focus:outline-none',
          zoomedImage: 'w-full h-auto max-w-[95vw] max-h-[95vh] object-contain rounded-md'
        },
        variants: {
          zoom: {
            true: 'will-change-transform'
          },
          open: {
            true: ''
          }
        },
        compoundVariants: [
          {
            zoom: true,
            open: false,
            class: 'cursor-zoom-in'
          }
        ]
      }
    }
  }
})
