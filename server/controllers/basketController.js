import db from './../models/'


const basketController = {}

basketController.get = function getBasket(req, res) {
    db.Basket.findById(req.user.basketId).exec()
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

basketController.post = function postBasket(req, res) {
    const delta = req.body.delta

    if (!delta || !delta.newItems) {
        res.status(400).json({
            success: false
        })

        return
    }

    let addPromises = addNewItemsToBasket(delta.newItems, req.user.basketId)

    Promise.all(addPromises).then(() => {
            res.status(201).json({
                success: true
            })
        })
        .catch((err) => {
            res.status(500).json({
                success: false
            })
        })
}

function addNewItemsToBasket(newBasketItems, basketId) {
    let addPromises = []

    // Iterate over items
    newBasketItems.forEach(async (basketItem) => {
        let itemDef = null

        try {
            itemDef = await findItemDefinition(basketItem.itemDef)
        }
        catch (err) {
            console.error(err)
            return
        }

        if (!itemDef) {
            return
        }

        const newItem = new db.BasketItem({
            itemDef: itemDef,
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

async function findItemDefinition(item) {
    const dbItem = await db.Item.findOne(item).exec()

    if (!dbItem) {
        return item
    }

    return dbItem
}

// function removeItemsFromBasket(removeItems, basketId) {
//     if (!removeItems) {
//         return
//     }

// }

// function modifyItemsInBasket(modItems, basketId) {
//     if (!modItems) {
//         return
//     }

// }

export default basketController