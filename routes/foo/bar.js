export default async function (app, opts) {
  app.get('/', async () => {
    return 'foo bar'
  })
  app.get('/user/', async () => {
    const client = await app.pg.connect()
    const { rows } = await client.query('SELECT now()')
    client.release()
    return rows
  })
}
