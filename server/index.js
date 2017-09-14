import app from './app'


// Pre-app initializations
require('./../config')

app.listen(3000, () => {
    console.log('App running on port 3000...')
})