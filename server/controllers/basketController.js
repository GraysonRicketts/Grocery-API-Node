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
    let addPromises = []

    // Iterate over items
    newBasketItems.forEach((basketItem) => {
        const itemDef = findItemDefinition(basketItem.itemDef)

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

async function findItemDefinition(item) {
    let dbItem = await db.Item.findOne(item).exec()

    if (!dbItem) {
        for (field in item) {
            dbItem[field] = String.prototype.toLocaleLowerCase(item[field])
        }
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