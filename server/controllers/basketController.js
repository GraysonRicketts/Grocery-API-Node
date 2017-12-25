import db from './../models/'


// TODO: post, put, delete all have similiar pattern; possibly abstract and pullout
const basketController = {}

basketController.get = function getBasket(req, res) {
    db.Basket.findById(req.user.basketId)
        .then((basket) => {
            if (basket) {
                res.status(200).json({
                    basket
                })
            } else {
                res.status(500).json({
                    success: false
                })
            }

        })
        .catch((err) => {
            console.error(err)
            res.status(500).json({
                success: false
            })
        })
}

basketController.post = function postToBasket(req, res) {
    const delta = req.body.delta

    if (!delta || !delta.newItems) {
        res.status(400).json({
            success: false
        })

        return
    }

    addNewItemsToBasket(delta.newItems, req.user.basketId).then(() => {
            res.status(201).json({
                success: true
            })
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json({
                success: false
            })
        })
}

basketController.put = function putInBasket(req, res) {
    const delta = req.body.delta

    if (!delta || !delta.modItems) {
        res.status(400).json({
            success: false
        })

        return
    }

    let modifyPromises = modifyItemsInBasket(delta.modItems, req.user.basketId)

    Promise.all(modifyPromises).then((mods) => {
            res.status(200).json({
                success: true,
                mods
            })
        })
        .catch((err) => {
            res.status(500).json({
                success: false
            })
        })
}

basketController.delete = function deleteFromBasket(req, res) {
    const delta = req.body.delta

    if (!delta || !delta.deletedItems) {
        res.status(400).json({
            success: false
        })

        return
    }

    let deletePromises = deleteItemsInBasket(delta.deletedItems, req.user.basketId)

    Promise.all(deletePromises).then((deletions) => {
            res.status(200).json({
                success: true,
                deletions
            })
        })
        .catch((err) => {
            res.status(500).json({
                success: false
            })
        })
}

/**
 * Adds new objects to the database
 * @param {Object[]} newBasketItems
 * @param {Object} newBasketItems[].itemDef
 * @param {mongoose.ObjectId} newBasketItems[].itemDef._id
 * @param {String} newBasketItems[].itemDef.title
 * @param {String} newBasketItems[].itemDef.category
 * @param {Number} newBasketItems[].quantity
 * @param {String} newBasketItems[].size
 * @param {String} newBasketItems[].note
 * @param {mongoose.ObjectId} basketId
 */
function addNewItemsToBasket(newBasketItems, basketId) {
    // Get items if they already exist in database
    const basketTransforms = newBasketItems.map(async(basketItem) => {
        let itemDef = await db.Item.findOne(basketItem.itemDef)
        if (!itemDef) {
            itemDef = new db.Item(basketItem.itemDef)
        }

        basketItem.itemDef = itemDef
        return new db.BasketItem(basketItem)
    })

    return Promise.all(basketTransforms).then(newBasketItems => {
        return db.Basket.findById(basketId).then((basket) => {
            newBasketItems.forEach((basketItem) => {
                // See if item already exists in database
                let index = basket.items.findIndex((element) => {
                    return element.itemDef._id.equals(basketItem.itemDef._id)
                })

                // Item found in basket so update / add on to
                if (index !== -1) {
                    let currQuantity = basket.items[index].quantity
                    basket.items[index].quantity = currQuantity + basketItem.quantity

                    if (basketItem.size) {
                        basket.items[index].size = basketItem.size
                    }

                    if (basketItem.note) {
                        basket.items[index].note = basketItem.note
                    }

                    return
                }

                basket.items.push(basketItem)
            })

            return db.Basket.findByIdAndUpdate(basketId, { $set: { items: basket.items } })
        })
    })
}

function modifyItemsInBasket(modItems, basketId) {
    let modifyPromises = []

    modItems.forEach((basketItem) => {
        let promise = db.Basket.update({
            '_id': mongoose.Types.ObjectId(basketId),
            'items._id': mongoose.Types.ObjectId(basketItem._id)
        }, {
            '$set': {
                'items.$.quantity': basketItem.quantity,
                'items.$.size': basketItem.size
            }
        })

        modifyPromises.push(promise)
    })

    return modifyPromises
}

function deleteItemsInBasket(deletedItems, basketId) {
    let deletionPromises = []

    deletedItems.forEach((basketItem) => {
        const itemToBeRemoved = 'items' + basketItem._id

        let promise = db.Basket.update({
            _id: mongoose.Types.ObjectId(basketId),
        }, {
            '$pull': { 'items': { '_id': mongoose.Types.ObjectId(basketItem._id) } }
        })

        deletionPromises.push(promise)
    })

    return deletionPromises
}

export default basketController