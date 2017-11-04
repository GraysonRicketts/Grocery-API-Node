import db from './db'

// Set node environment variables
require('dotenv').config()

// DB Startup and Configuration
db.connect()