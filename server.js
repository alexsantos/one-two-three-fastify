import fastify from 'fastify'

const app = fastify({
  logger: {
    prettyPrint: true
  }
})

app.register(import('./app.js'))

const start = async function () {
  try {
    await app.listen(process.env.PORT || 3000)
  } catch (e) {
    app.log.error(e)
    process.exit(1)
  }
}

start()
