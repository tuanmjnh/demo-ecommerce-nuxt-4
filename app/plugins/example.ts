// plugins/hello.ts
export default defineNuxtPlugin((nuxtApp) => {
  // Code này chạy khi Vue App khởi tạo
  return {
    provide: {
      hello: (msg: string) => `Hello ${msg}!`
    }
  }
})
