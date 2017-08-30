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
    process.exit(0)
})

mongoose.connection.on('disconnected', () => {  
    console.error('Mongoose default connection disconnected')
    process.exit(0)
})

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
    mongoose.connection.close(() => { 
    console.error('Mongoose default connection disconnected through app termination')
        process.exit(0)
    })
})

mongoose.Promise = global.Promise