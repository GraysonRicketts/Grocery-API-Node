import db from './../models/'


// TODO: post, put, delete all have similiar pattern; possibly abstract and pullout
const basketController = {}

basketController.get = function getBasket(req, res) {
    db.Basket.findById(req.params.basketId)
        .then(basket => {
            if (!basket) {
                return res.status(404).json({
                    success: false
                })
            }

            res.status(200).json({
                basket,
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

basketController.post = function postToBasket(req, res) {
    const delta = req.body.delta
    const basketId = req.params.basketId

    if (!delta || !delta.newItems) {
        res.status(400).json({
            success: false
        })

        return
    }

    addNewItemsToBasket(delta.newItems, basketId).then(() => {
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

    let modifyPromises = modifyItemsInBasket(delta.modItems, req.params.basketId)

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

    let deletePromises = deleteItemsInBasket(delta.deletedItems, req.params.basketId)

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
        return createAddToBasketPromise(basketId, newBasketItems)
    })
}

/**
 * Creates a promise that will add new / update items in the basket
 * @param {mongoose.ObjectId} basketId
 * @param {Object[]} newBasketItems
 * @param {Object} newBasketItems[].itemDef
 * @param {mongoose.ObjectId} newBasketItems[].itemDef._id
 * @param {String} newBasketItems[].itemDef.title
 * @param {String} newBasketItems[].itemDef.category
 * @param {Number} newBasketItems[].quantity
 * @param {String} newBasketItems[].size
 * @param {String} newBasketItems[].note
 */
function createAddToBasketPromise(basketId, newBasketItems) {
    return db.Basket.findById(basketId).then((basket) => {
        newBasketItems.forEach((basketItem) => {
            // See if item already exists in database
            let index = basket.items.findIndex((element) => {
                const sameId = element.itemDef._id.equals(basketItem.itemDef._id)
                const sameSize = element.size === basketItem.size

                return sameId && sameSize
            })

            // Item already exists in basket so update or add on to
            if (index !== -1) {
                addToExistingItem(basket.items[index], basketItem)
                return
            }

            basket.items.push(basketItem)
        })

        return db.Basket.findByIdAndUpdate(basketId, { $set: { items: basket.items } })
    })
}

/**
 * Increases quantity and updates fields of basket item
 * @param {mongoose.ObjectId} newBasketItems.itemDef._id
 * @param {String} oldBasketItem.itemDef.title
 * @param {String} oldBasketItem.itemDef.category
 * @param {Number} oldBasketItem.quantity
 * @param {String} oldBasketItem.size
 * @param {String} oldBasketItem.note
 * @param {String} newBasketItems.itemDef.title
 * @param {String} newBasketItems.itemDef.category
 * @param {Number} newBasketItems.quantity
 * @param {String} newBasketItems.size
 * @param {String} newBasketItems.note
 */
function addToExistingItem(oldBasketItem, newBasketItem) {
    oldBasketItem.quantity += newBasketItem.quantity

    if (newBasketItem.note) {
        oldBasketItem.note += "\n\n" + newBasketItem.note
    }
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

/**
 * Checks to see if the user has access to the basket
 * @param {String} user
 * @param {mongoose.ObjectId} basketId
 * @returns {bool}
 */
async function doesUserHaveAccesToBasket(user, basketId) {
    return await db.Basket.findById(basketId)
        .then((basket) => {
            if (!basket) {
                throw { errorCode: 404 }
            }

            if (!isUserInUsersArray(basket.users, user)) {
                return false
            }

            return true
        })
        .catch((err) => {
            console.error(err)
            throw { errorCode: 400 }
        })
}

export default basketController
