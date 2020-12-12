import { join } from 'desm'
import jwt from 'fastify-jwt'

export default async function (app, opts) {
  app.register(jwt, {
    secret: 'CHANGEME',
    sign: {
      expiresIn: 3600
    }
  })

  app.register(import('fastify-postgres'), {
    connectionString: 'postgres://springsecurity:pass@localhost/springsecuritydb'
  })

  app.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  app.register(import('fastify-autoload'), {
    dir: join(import.meta.url, 'routes'),
    ignorePattern: /.*(test|spec).js/
  })
}
