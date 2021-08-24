const Item = require('../models/item_model');
const InventoryLog = require('../models/inventoryLog_model');

const inventoryLogsGet = async(req, res) => {
    // const skip = req.query.skip ? Number(req.query.skip) : 0
    const {type, id} = req.params;
    let query;

    if (type === "1") {
        query = {area: id}
    } else if (type === "2") {
        query = {item: id}
    }

    const resp = await InventoryLog.find(query)
        // .skip(skip)
        .sort({'time': -1})
        .limit(7)
        .populate({
            path: 'item',
            select: '-description -__v -category'
        })
        .populate({
            path: 'space',
            select: '-area -__v -rows -columns'
        })
        .populate({
            path: 'user',
            select: '-__v -password -email -active',
        })

    res.status(200).json({
        resp        
    })
}

const inventoryGetBySpace = async(req, res) => {
    const spaceId = req.params.id;
    const resp = await Item.find({space: spaceId})
        .select('-space')
        .populate({
            path: 'category',
            select: '-__v -area -space'
        })

    res.status(200).json({
        resp        
    })
}

const inventoryGet = async(req, res) => {
    const resp = await Item.find();

    res.status(200).json({
        resp        
    })
}

const itemPut = async(req, res) => {
    try {
        const itemId = req.params.id;
        const uid = req.user._id;
        const { name, description, category, column, row, area } = req.body;
        
        const itemDB = await Item.findById(itemId)
        if (!itemDB) {
            return res.status(400).json({
                msg: `No existe un item con el id ${itemId}`
            })
        }

        const data = {
            name: name || itemDB.name,
            description: description || itemDB.description,
            category: category || itemDB.category,
            column: column || itemDB.column,
            row: row || itemDB.row
        }; 
    
        const updatedItem = await Item.findByIdAndUpdate(itemId, data, {new: true})
    
        if (itemDB.row !== updatedItem.row && itemDB.column !== updatedItem.column) {
            const newInventoryLog = new InventoryLog({column, row, item: updatedItem._id, itemName: updatedItem.name, space : updatedItem.space, user: uid, area, type: 'MODIFY'})
            await newInventoryLog.save();
        }

        res.status(200).json({
            updatedItem
        })
    } catch (error) {
        console.log(error);
    }
}

const itemPost = async(req, res) => {
    try {
        const uid = req.user._id;
        const { name, description, category, column, row, space, area } = req.body;
        const data = {
            name,
            description,
            category,
            column,
            row,
            space
        };
    
        const newItem = new Item(data);
        await newItem.save();
    
        // Se crea el registro de movimiento - Creacion de item
        const newInventoryLog = new InventoryLog({column, row, item: newItem._id, itemName: newItem.name, space, user: uid, area, type: 'ADD'})
        await newInventoryLog.save();
    
        res.status(201).json({
            newItem
        });
    } catch (error) {
        console.log(error);
    }
}

const itemDelete = async(req, res) => {
    try {
        const itemId = req.params.id;
        const uid = req.user._id;
        const { area, type } = req.body;
    
        const itemDB = await Item.findById(itemId)
        if (!itemDB) {
            return res.status(400).json({
                msg: `No existe un item con el id ${itemId}`
            })
        }
    
        switch (type) {
            case 1:
                    await Item.findByIdAndDelete(itemId)
                break;
        
            case 2:
                    await Item.findByIdAndUpdate(itemId, {active: false})
                break;

            case 3:
                    await Item.findByIdAndUpdate(itemId, {active: true})
                break;

            default:
                break;
        }
    
        const newInventoryLog = new InventoryLog({column: null, row: null, itemName: itemDB.name, space: itemDB.space, user: uid, area, type: 'DELETE'})
        await newInventoryLog.save();
    
        res.status(200).json({
            newInventoryLog
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    inventoryLogsGet,
    inventoryGetBySpace,
    inventoryGet,
    itemPut,
    itemPost,
    itemDelete
}