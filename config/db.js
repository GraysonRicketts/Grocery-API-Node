import mongoose from 'mongoose'
import config from 'config'


mongoose.connect (
    config.DBHost, {
        useMongoClient: true
    }, () => {
        console.log('Connected to mongodb...')
    }
)

mongoose.connection.on('error', (err) => {  
    console.error('Mongoose default connection error: ' + err)
})

mongoose.connection.on('disconnected', () => {  
    console.log('Mongoose default connection disconnected')
})

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
    mongoose.connection.close(() => { 
    console.log('Mongoose default connection disconnected through app termination')
        process.exit(0)
    })
})

mongoose.Promise = global.Promise