import db from './../models/'


// TODO: post, put, delete all have similiar pattern; possibly abstract and pullout
const basketController = {}

basketController.get = function getBasket(req, res) {
    db.Basket.findById(req.user.basketId)
        .populate({
            path: 'items.itemDef',
            model: 'Item',
            select: 'title category brand'
        })
        .then((basket) => {
            if (basket) {
                res.status(200).json({
                    basket
                })
            }
            else {
                res.status(500).json({
                    success: false
                })
            }

        })
        .catch((err) => {
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

    let addPromises = addNewItemsToBasket(delta.newItems, req.user.basketId)

    Promise.all(addPromises).then((newItems) => {
            res.status(201).json({
                success: true,
                newItems
            })
        })
        .catch((err) => {
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
 * @param {string} newBasketItems[].size
 * @param {Number} newBasketItems[].quantity
 * @param {mongoose.ObjectId} basketId
 */
function addNewItemsToBasket(newBasketItems, basketId) {
    let addPromises = []

    newBasketItems.forEach(async (basketItem) => {
        let itemDef = await db.Item.findOne(basketItem.itemDef)
        if (!itemDef) {
            itemDef = basketItem.itemDef
        }

        const newItem = new db.BasketItem({
            itemDef,
            quantity: basketItem.quantity,
            size: basketItem.size
        })

        // Push item to basket
        let promise = db.Basket.findByIdAndUpdate(
                basketId,
                { $push: { 'items': newItem } },
                { safe: true, upsert: true }
            ).exec()

        addPromises.push(promise)
    })

    return addPromises
}

function modifyItemsInBasket(modItems, basketId) {
    let modifyPromises = []

    modItems.forEach((basketItem) => {
        let promise = db.Basket.update(
            {
                '_id': mongoose.Types.ObjectId(basketId),
                'items._id': mongoose.Types.ObjectId(basketItem._id)
            },
            {
                '$set': {
                    'items.$.quantity': basketItem.quantity,
                    'items.$.size': basketItem.size
                }
            }
        )

        modifyPromises.push(promise)
    })
    
    return modifyPromises
}

function deleteItemsInBasket(deletedItems, basketId) {
    let deletionPromises = []

    deletedItems.forEach((basketItem) => {
        const itemToBeRemoved = 'items' + basketItem._id
        
        let promise = db.Basket.update(
            {
                _id: mongoose.Types.ObjectId(basketId),
            },
            {
                '$pull': { 'items': { '_id': mongoose.Types.ObjectId(basketItem._id) } }
            }
        )

        deletionPromises.push(promise)
    })
    
    return deletionPromises
}

export default basketController