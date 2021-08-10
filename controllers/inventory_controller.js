const Item = require('../models/item_model');
const Inventory = require('../models/inventory_model');
const InventoryLog = require('../models/inventoryLog_model');

const inventoryLogsGetByArea = async(req, res) => {
    // const skip = req.query.skip ? Number(req.query.skip) : 0
    const id = req.params.id;

    const resp = await InventoryLog.find({area: id})
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

const inventoryGet = async(req, res) => {
    const resp = await Inventory.find()

    res.status(200).json({
        resp        
    })
}

const inventoryGetBySpace = async(req, res) => {
    const id = req.params.id;
    const inventory = await Inventory.find({space: id})
        .populate({
            path: 'item',
            select: '-__v',
            populate: {
                path: 'category',
                select: '-_id -__v -area'
            }
        })

    res.status(200).json({
        inventory        
    })
}

const inventoryPut = async(req, res) => {
    const id = req.params.id;
    const uid = req.user._id;
    const data = req.body;

    const inventoryDB = await Inventory.findById(id)
    if (!inventoryDB) {
        return res.status(400).json({
            msg: `El item no se encuentra en el inventario`
        })
    }

    await Inventory.findByIdAndUpdate(id, data)

    const { item, space } = inventoryDB;
    const newInventoryLog = new InventoryLog({...data, item, space, user: uid, type: 'MODIFY'})
    await newInventoryLog.save();

    res.status(200).json({
        newInventoryLog
    })
}

const inventoryPost = async(req, res) => {
    const uid = req.user._id;
    const { column, row, item, space, area } = req.body;

    const inventoryDB = await Inventory.findOne({item});
    if (inventoryDB) {
        return res.status(400).json({
            msg: `El item ya se encuentra en el inventario`
        })
    }

    const itemDB = await Item.findById(item);
    if (!itemDB) {
        return res.status(400).json({
            msg: `El item no existe`
        })
    }

    const newInventory = new Inventory({column, row, item, space});
    await newInventory.save();
    const newInventoryLog = new InventoryLog({column, row, item, space, user: uid, area, type: 'ADD'})
    await newInventoryLog.save();


    res.status(201).json({
        newInventoryLog
    });
}

const inventoryDelete = async(req, res) => {
    const id = req.params.id;
    const uid = req.user._id;

    const inventoryDB = await Inventory.findById(id)
    if (!inventoryDB) {
        return res.status(400).json({
            msg: `El item no se encuentra en el inventario`
        })
    }

    await Inventory.findByIdAndDelete(id)

    const { item, space } = inventoryDB;
    const newInventoryLog = new InventoryLog({item, row: null, column: null, space, user: uid, type: 'REMOVE'})
    await newInventoryLog.save();

    res.status(200).json({
        newInventoryLog
    })
}

module.exports = {
    inventoryLogsGetByArea,
    inventoryGet,
    inventoryGetBySpace,
    inventoryPut,
    inventoryPost,
    inventoryDelete
}