import mongoose from 'mongoose'


let db = {}

db.connect = async function() {
    try {
        const dbUri = 'mongodb://mongodb:' + process.env.MONGODB_PORT + '/' + process.env.MONGODB_NAME
        await mongoose.connect(dbUri, { useMongoClient: true })
    }
    catch(err) {
        logErrorAndExit('Failed to connect', err)
    }

    mongoose.connection.on('error', (err) => {
        logErrorAndExit('General error', err)
    })

    mongoose.connection.on('disconnected', () => {  
        logErrorAndExit('Mongoose default connection disconnected')
    })

    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', function() {
        mongoose.connection.close(() => {
            logErrorAndExit('Mongoose default connection disconnected through app termination SIGINT')
        })
    })
}

/**
 * Logs an error then exits
 * @param {string} msg 
 * @param {Error} [err]
 */
function logErrorAndExit(msg, err) {
    let errMsg = '(' + msg + ')'

    if (err) {
        errMsg = errMsg + err
    }

    console.error('Mongoose error: ' + errMsg)
    process.exit(1)
}

mongoose.Promise = global.Promise

export default db