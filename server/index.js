import app from './app'


// Set node environment variables
require('dotenv').config()

// DB Startup and Configuration
require('./../config/db')

app.listen(3000, () => {
    console.log('Running on port 3000...')
})