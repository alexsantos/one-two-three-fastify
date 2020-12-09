import fastify from 'fastify'
import App from './app.js'

const app = fastify({
  logger: {
    prettyPrint: true
  }
})

app.register(App)

async function start () {
  try {
    await app.listen(process.env.PORT || 3000)
  } catch (e) {
    app.log.error(e)
    process.exit(1)
  }
}

start()
