import db from './../models/'
import mongoose from 'mongoose'


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

    if (!delta || !delta.newItem) {
        return res.status(400).json({
            success: false
        })
    }

    let { newItem } = delta

    // See if item already exists in database
    db.Item.findOne({ name: newItem.name })
        .then((itemDef) => {
            if (!itemDef) {
                itemDef = new db.Item({
                    name: newItem.name,
                    category: 'Uncategorized'
                })
            }

            return itemDef
        })
        .then((itemDef) => {
            let basketItem = {}
            basketItem.itemDef = itemDef
            basketItem.number = newItem.number

            newItem = new db.BasketItem(basketItem)
        })
        // See if the item exists in the basket already
        .then(() => db.Basket.findById(basketId))
        .then((basket) => {
            let index = basket.items.findIndex((element) => {
                const sameId = element.itemDef._id.equals(newItem.itemDef._id)
                const sameSize = element.size === newItem.size

                return sameId && sameSize
            })

            // Item already exists in basket so update or add on to
            if (index !== -1) {
                addToExistingItem(basket.items[index], newItem)
            } else {
                basket.items.push(newItem)
            }

            return basket.save()
        })
        .then(() => {
            return res.status(200).json({
                success: true,
                newItem
            })
        })
        .catch((err) => {
            return res.status(500).json({
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
 * Increases number and updates fields of basket item
 * @param {mongoose.ObjectId} newBasketItems.itemDef._id
 * @param {String} oldBasketItem.itemDef.name
 * @param {String} oldBasketItem.itemDef.category
 * @param {Number} oldBasketItem.number
 * @param {String} oldBasketItem.size
 * @param {String} oldBasketItem.note
 * @param {String} newBasketItems.itemDef.name
 * @param {String} newBasketItems.itemDef.category
 * @param {Number} newBasketItems.number
 * @param {String} newBasketItems.size
 * @param {String} newBasketItems.note
 */
function addToExistingItem(oldBasketItem, newBasketItem) {
    oldBasketItem.number += newBasketItem.number

    if (newBasketItem.note) {
        oldBasketItem.note += "\n\n" + newBasketItem.note
    }
}

function modifyItemsInBasket(modItems, basketId) {
    let modifyPromises = []

    modItems.forEach((basketItem) => {
        basketItem.number = parseInt(basketItem.number)
        const query = {
            '_id': mongoose.Types.ObjectId(basketId),
            'items._id': mongoose.Types.ObjectId(basketItem._id)
        }

        let promise = db.Basket.update(query, {
            '$set': {
                'items.$.number': basketItem.number,
                'items.$.size': basketItem.size,
                'items.$.note': basketItem.note
            }
        })

        modifyPromises.push(promise)
    })

    return modifyPromises
}

function deleteItemsInBasket(deletedItems, basketId) {
    let deletionPromises = []

    deletedItems.forEach((basketItem) => {
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
