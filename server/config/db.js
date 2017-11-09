import mongoose from 'mongoose'


let db = {}

db.connect = async function() {
    try {
        const dbUri = 'mongodb://mongodb:' + process.env.MONGODB_PORT
        await mongoose.connect(dbUri, { useMongoClient: true })
    }
    catch(err) {
        throwMongooseError('Failed to connect', err)
    }

    mongoose.connection.on('error', (err) => {
        throwMongooseError('General error', err)
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

function throwMongooseError(msg, err) {
    let errMsg = '(' + msg + ')'

    if (err) {
        errMsg = errMsg + err
    }

    console.error('Mongoose error: ' + errMsg)
    process.exit(1)
}

mongoose.Promise = global.Promise

export default db