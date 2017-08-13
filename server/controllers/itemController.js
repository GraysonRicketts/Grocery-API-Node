import db from './../models/'

const itemController = {}

itemController.post = (req, res) => {
    const {
        title,
        description,
        category
    } = req.body

    const post = new db.Item({
        title,
        description,
        category
    })

    // TODO: Validation

    post
        .save()
        .then((newItem) => {
            return res.status(200).json({
                success: true,
                data: newItem
            })

        })
        .catch((err) => {
            return res.status(500).json({
                message: err
            })
    })
}

export default itemController