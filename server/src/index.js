import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'

const MODE_PRODUCTION = 'production'
const MODE_DEVELOPMENT = 'development'

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('port', process.env.API_PORT || 3001)

const isProduction = () => process.env.NODE_ENV === MODE_PRODUCTION
const isDevelopment = () => process.env.NODE_ENV === MODE_PRODUCTION

if (isProduction()) {
  app.use(express.static('../client/build'))
}

app.get('*', (req, res) => {
  if (!isProduction()) {
    res
      .status(200)
      .send(
        'you should not access the server when NODE_ENV is in development mode or other modes'
      )
  }
})

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`) // eslint-disable-line no-console
})
