import db from './../models/'

const basketController = {}

basketController.get = (req, res) => {
    const {
        basketId
    } = req.params

    // TODO: Validate basket belongs to current user

    db.Basket
        .findById(basketId)
        .populate({
            path: '_items._item',
            select: 'title category brand description'
        })
        .then((basket) => {
            res.status(200).json({
                basket: basket
            })
        })
        .catch((err) => {
            res.status(500).json({
                message: err
            })
        })
}

basketController.post = (req, res) => {
    const {
        basketId
    } = req.params

    // TODO: Validate basket belongs to current user

    // TODO: Validate basket items
    const newItems = req.body

    db.Basket
        .findById(basketId)
        .then((basket) => {
            let updateItems = { 
                $push: { _items: [] },
                $set: { _items: [] }
            }

            // TODO: Check if items in basket already => update them
            
            // Map for fast checking
            // TODO: Possibly move map to object, so that doesn't have to be created each time
            const itemIdIndexMap = new Map()
            basket._items.map((item, index) => { itemIdIndexMap.set(item,index) })

            for (item in newItems) {
                let index = itemIdIndexMap.get(item._id)
                
                if (index === undefined) {
                    updateItems.$push._items.push(item)
                }
                else {
                    updateItems.$set._items.push(item)
                }
            }

            basket
                .update(updateItems)
                .then(() => {
                    res.status(200).json({
                        message: 'Basket updated',
                        updateItems: updateItems
                    })
                })
                .catch((err) => {
                    res.status(500).json({
                        message: err
                    })
                })
        })
        .catch((err) => {
            res.status(500).json({
                message: err
            })
        })
}

export default basketController