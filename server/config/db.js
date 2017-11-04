import mongoose from 'mongoose'


let db = {}

db.connect = async function() {
    try {
        await mongoose.connect(process.env.DB_HOST, { useMongoClient: true })
    }
    catch(err) {
        throwMongooseError(err)
    }

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
}

function throwMongooseError(msg) {
    console.error('Mongoose error: ' + msg)
    process.exit(1)
}

mongoose.Promise = global.Promise

export default db