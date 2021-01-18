import t from 'tap'
import fastify from 'fastify'
import fp from 'fastify-plugin'
import app from '../../app.js'

const { test } = t

test('load inside a folder', async ({ is }) => {
  const server = fastify()

  // so we can access decorators
  server.register(fp(app))

  const res = await server.inject('/foo')
  is(res.body, 'foo bar')

  await server.close()
})

test('insert to database', async ({ is }) => {
  const server = fastify()

  // so we can access decorators
  server.register(fp(app))
  const res = await server.inject({ method: 'POST', url: '/foo/user', payload: { username: 'santosam72', password: 'pass' } })
  is(res.statusCode, 201)
  is(res.body, '{"id":1,"username":"santosam72","password":"pass"}')
  await server.close()
})

test('access to database', async ({ is }) => {
  const server = fastify()

  // so we can access decorators
  server.register(fp(app))

  const res = await server.inject('/foo/user/1')
  is(res.body, '[{"id":1,"username":"santosam72","password":"pass"}]')

  await server.close()
})

t.tearDown(async () => {
  const server = fastify()

  // so we can access decorators
  server.register(fp(app))
  const client = await app.pg.connect()
  const result = await client.query('TRUNCATE TABLE users')
  console.log(result)
})
