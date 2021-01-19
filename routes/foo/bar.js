// import fastify from 'fastify'
import S from 'fluent-json-schema'

export default async function (app, opts) {
  app.get('/', async () => {
    return 'foo bar'
  })
  app.get('/user/:id', async (req, res) => {
    const client = await app.pg.connect()
    try {
      const { rows } = await client.query('SELECT * from users where id = $1', [req.params.id])
      if (rows.length === 0) {
        res.code(404)
          .send(`User with id ${req.params.id} not found`)
      }
      res.send(rows)
    } catch (err) {
      console.error(err)
      res.code(500)
        .send({ status: 500, message: err })
    } finally {
      client.release()
    }
  })
  app.post('/user', {
    schema: {
      body: S.object()
        .prop('username', S.string().required())
        .prop('password', S.string().required())
    }
  }, async (req, res) => {
    const client = await app.pg.connect()
    try {
      const { rows } = await client.query('INSERT into users(username, password) VALUES ($1, $2) RETURNING *', [req.body.username, req.body.password])
      res.code(201)
        .header('x-generated-id', rows[0].id)
        .send(rows[0])
    } catch (err) {
      console.log('bar.js:' + err)
      res.code(500)
        .send({ status: 500, message: err })
    } finally {
      client.release()
    }
  })
}
