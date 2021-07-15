const Inventory = require('../models/inventory_model');
const InventoryLog = require('../models/inventoryLog_model');

const inventoryGet = async(req, res) => {
    const resp = await Inventory.find();

    res.status(200).json({
        resp        
    })
}

const inventoryPut = async(req, res) => {
    const id = req.params.id;
    const uid = req.user._id;
    const { location, space, item } = req.body;

    const inventoryDB = await Inventory.findOne({item})
    if (!inventoryDB) {
        return res.status(400).json({
            msg: `El item no se encuentra en el inventario`
        })
    }

    await Inventory.findByIdAndUpdate(id, {location, space})

    const newInventoryLog = new InventoryLog({location, item, space, user: uid, type: 'MODIFY'})
    await newInventoryLog.save();

    res.status(200).json({
        newInventoryLog
    })
}

const inventoryPost = async(req, res) => {
    const uid = req.user._id;
    const { location, item, space } = req.body;

    const inventoryDB = await Inventory.findOne({item});
    if (inventoryDB) {
        return res.status(400).json({
            msg: `El item ya se encuentra en el inventario`
        })
    }

    const newInventory = new Inventory({location, item, space});
    await newInventory.save();
    const newInventoryLog = new InventoryLog({location, item, space, user: uid, type: 'ADD'})
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

    const newInventoryLog = new InventoryLog({item, user: uid, type: 'REMOVE'})
    await newInventoryLog.save();

    res.status(200).json({
        newInventoryLog
    })
}

module.exports = {
    inventoryGet,
    inventoryPut,
    inventoryPost,
    inventoryDelete
}