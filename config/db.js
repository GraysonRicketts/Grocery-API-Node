import mongoose from 'mongoose'


if (process.env.NODE_ENV === 'test') {
    process.env.DB_HOST = 'mongodb://localhost:27017/test-grocery'
}

mongoose.connect(process.env.DB_HOST, { useMongoClient: true })

mongoose.connection.on('error', (err) => {  
    throwMongooseError(err)
})

mongoose.connection.on('disconnected', () => {  
    throwMongooseError('Mongoose default connection disconnected')
})

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
    mongoose.connection.close(() => { 
        throwMongooseError('Mongoose default connection disconnected through app termination SIGINT')
    })
})

function throwMongooseError(msg) {
    console.error('Mongoose error: ' + msg)
    process.exit(1)
}

mongoose.Promise = global.Promise