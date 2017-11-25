import app from './app'


// Pre-app initializations
require('./config')

app.listen(process.env.APP_PORT, () => {
    console.log('App running on port ' + process.env.APP_PORT + '...')
})