// composables/useNotify.ts
type NotificationType = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'neutral'
export const useNotify = (args: { message: string, title?: string, type?: NotificationType }) => {
  const toast = useToast()
  const typeConfig: Record<NotificationType, { icon: string; color: string, title: string }> = {
    primary: { icon: 'i-lucide-bell-ring', color: 'primary', title: 'Notification' },
    secondary: { icon: 'i-lucide-bell', color: 'secondary', title: 'Notification' },
    success: { icon: 'i-lucide-badge-check', color: 'success', title: 'Notification' },
    error: { icon: 'i-lucide-circle-x', color: 'error', title: 'Notification' },
    warning: { icon: 'i-lucide-triangle-alert', color: 'warning', title: 'Notification' },
    info: { icon: 'i-lucide-info', color: 'info', title: 'Notification' },
    neutral: { icon: 'i-lucide-bubbles', color: 'neutral', title: 'Notification' }
  }
  // const notify = (message: string, title?: string, type: NotificationType = 'primary') => {
  //   const config = typeConfig[type]

  //   // If no title is passed, automatically capitalize the first letter of the type (eg: success -> Success)
  //   const defaultTitle = title || (type.charAt(0).toUpperCase() + type.slice(1))

  //   toast.add({
  //     title: defaultTitle,
  //     description: message,
  //     icon: config.icon || 'i-lucide-bell-ring',
  //     color: config.color as any, // Cast to match Nuxt UI's color prop
  //     duration: type === 'error' ? 5000 : 3000, // Errors appear a little longer (5s)
  //     // ui: { ... }// Custom CSS class if needed
  //   })
  // }

  toast.add({
    title: args.title || typeConfig[args.type || 'primary'].title,
    description: args.message,
    icon: typeConfig[args.type || 'primary'].icon || 'i-lucide-bell-ring',
    color: args.type, // Cast to match Nuxt UI's color prop
    duration: args.type === 'error' ? 5000 : 3000, // Errors appear a little longer (5s)
    // ui: { ... }// Custom CSS class if needed
  })

  return true
  // notifySuccess: (msg: string, title?: string) => notify(msg, title, 'success'),
  // notifyError: (msg: string, title?: string) => notify(msg, title, 'error'),
  // notifyWarning: (msg: string, title?: string) => notify(msg, title, 'warning'),
  // notifyInfo: (msg: string, title?: string) => notify(msg, title, 'info'),
}
