export default defineEventHandler((event) => {
  // Only applies to requests starting with /api
  if (getRequestURL(event).pathname.startsWith('/api')) {

    // Add headers manually (If the above routeRules are not enough)
    setResponseHeaders(event, {
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Origin': '*', // Or fill in a specific domain: 'https://domain-khach-hang.com'
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Credentials': 'true'
    })

    // If it is an OPTIONS method (Preflight), return OK immediately -> Do not run into API logic
    if (event.method === 'OPTIONS') {
      event.node.res.statusCode = 204
      event.node.res.statusMessage = 'No Content'
      return 'OK'
    }
  }
})
