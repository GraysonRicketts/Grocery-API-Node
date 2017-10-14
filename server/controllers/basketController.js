import db from './../models/'


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
                res.status(400).json({
                    success: false
                })
            }
            
        })
        .catch((err) => {
            res.status(500).json({
                message: err
            })
        })
}

// Req must have b
basketController.post = function postBasket(req, res) {
    if (!req.delta) {
        res.status(400).json({
            success: false
        })

        return
    }

    const basketId = req.user.basketId

    let promises = []
    promises.concat(addNewItemsToBasket(req.delta.newItems, basketId, promises))
    // removeItemsFromBasket(req.delta.removeItems, basketId)
    // modifyItemsInBasket(req.delta.modItems, basketId)

    Promise.all(promises)
        .then(() => {
            res.status(200).json({
                success: true
            })
        })
        .catch((err) => {
            res.status(400).json({
                success: false
            })
        })
}

function addNewItemsToBasket(newBasketItems, basketId) {
    if (!newBasketItems) {
        return
    }

    let addPromises = []

    // Iterate over items
    newBasketItems.forEach(function(basketItem) {
        const itemDef = findItemDefinition(basketItem.item)

        const newItem = new db.BasketItem({
            item: itemDef,
            quantity: basketItem.quantity,
            size: basketItem.size
        })

        // Add item to basket
        let promise = db.Basket.findByIdAndUpdate(
                basketId,
                { $push: { 'items': newItem }},
                { safe: true, upsert: true }
            ).exec()
        
        addPromises.push(promise)
    })

    return addPromises
}

async function findItemDefinition(item, basketId) {
    const dbItemDef = await db.Item.find(item).exec()

    if (!itemDef) {
        for (field in item) {
            item[field] = String.prototype.toLocaleLowerCase(item[field])
        }

        return item
    }

    return dbItemDef
}

function removeItemsFromBasket(removeItems, basketId) {
    if (!removeItems) {
        return
    }

}

function modifyItemsInBasket(modItems, basketId) {
    if (!modItems) {
        return
    }

}

export default basketController