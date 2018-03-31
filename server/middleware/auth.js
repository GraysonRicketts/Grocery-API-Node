import bcrypt from 'bcryptjs'

/**
 * Checks to see if the password provided matches the password in the database
 * @param {string} user
 * @param {string} password
 */
export function checkUserPassword(user, password) {
    return bcrypt.compare(password, user.password)
}

export const jwtSecret = 'super secrete phrase'
