'use strict'

import server from './server.js'

const app = server()

// Run the server!
try {
  await app.listen({ host: '0.0.0.0', port: 8000 })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}