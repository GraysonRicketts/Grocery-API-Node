import mongoose from 'mongoose'


if (process.env.NODE_ENV === 'test') {
    process.env.DB_HOST = 'mongodb://localhost:27017/test-grocery'
}

mongoose.connect(process.env.DB_HOST, { useMongoClient: true })

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