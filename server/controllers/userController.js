const userController = {}

userController.logout = (req, res) => {
    req.logout()
    req.session.destroy(() => {
        res.status(200).json({
            success: true
        })
    })
}

// userController.delete = (req, res) => {
//     // TODO: Soft delete user
// }

// userController.put = (req, res) => {
//     // TODO: Allow password or email to be reset
// }



export default userController
