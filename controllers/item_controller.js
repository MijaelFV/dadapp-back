const Item = require('../models/item_model');
const InventoryLog = require('../models/inventoryLog_model');
const Space = require('../models/space_model');
const { deleteImage } = require('../helpers/delete-image');

const inventoryLogsGet = async(req, res) => {
    // const skip = req.query.skip ? Number(req.query.skip) : 0
    const {type, id} = req.params;
    let query;

    if (type === "1") {
        query = {area: id}
    } else if (type === "2") {
        query = {item: id}
    } else if (type === "3") {
        query = {user: id}
    }

    const resp = await InventoryLog.find(query)
        // .skip(skip)
        .sort({'time': -1})
        .limit(10)
        .populate({
            path: 'item',
            select: 'name column row takedBy'
        })
        .populate({
            path: 'space',
            select: 'name'
        })
        .populate({
            path: 'user',
            select: 'name',
        })

    res.status(200).json(resp)
}

const inventoryGetByTaked = async(req, res) => {
    const uid = req.user._id;
    const areaId = req.params.id;

    const spacesFromArea = await Space.find({area: areaId}).select("_id")
    const uidList = spacesFromArea.map((uid) => (
        JSON.stringify(uid).replace(/[^a-zA-Z0-9]/g, '').substring(3)
    ));

    const resp = await Item.find({takedBy: uid}).where('space').in(uidList).select('name image takedDate');

    res.status(200).json(resp)
}

const inventoryGetBySpace = async(req, res) => {
    const spaceId = req.params.id;
    
    const resp = await Item.find({space: spaceId})
        .populate({
            path: 'category',
            select: 'name'
        })
        .populate({
            path: 'takedBy',
            select: 'name'
        })
        .populate({
            path: 'space',
            select: 'name'
        })

    res.status(200).json(resp)
}

const itemGetById = async(req, res) => {
    const id = req.params.id;

    const item = await Item.findOne({_id: id})
        .populate({
            path: 'category',
            select: 'name'
        })
        .populate({
            path: 'takedBy',
            select: 'name'
        })
        .populate({
            path: 'space',
            select: 'name'
        })

    res.status(200).json(item)
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
    
        if (itemDB.row !== updatedItem.row || itemDB.column !== updatedItem.column) {
            const newInventoryLog = new InventoryLog({column, row, item: updatedItem._id, itemName: updatedItem.name, space : updatedItem.space, user: uid, area, type: 'MODIFY'})
            await newInventoryLog.save();
        }

        res.status(200).json(updatedItem)
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
    
        res.status(201).json(newItem);
    } catch (error) {
        console.log(error);
    }
}

const itemReturn = async(req, res) => {
    try {
        const itemId = req.params.id;
        const uid = req.user._id;
        const { space, column, row, area } = req.body;
        
        const itemDB = await Item.findById(itemId)
        if (!itemDB) {
            return res.status(400).json({
                msg: `No existe un item con el id ${itemId}`
            })
        }
    
        const returnedItem = await Item.findByIdAndUpdate(itemId, {space, column, row, takedBy: null, takedDate: null}, {new: true})
    
        const newInventoryLog = new InventoryLog({column, row, item: returnedItem._id, itemName: returnedItem.name, space : returnedItem.space, user: uid, area, type: 'RETURNED'})
        await newInventoryLog.save();

        res.status(200).json(returnedItem)
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

        let model;
        let newInventoryLog
    
        switch (type) {
            case 1:
                    model = await Item.findByIdAndDelete(itemId)
                break;
        
            case 2:
                    model = await Item.findByIdAndUpdate(itemId, {takedBy: uid, takedDate: new Date})
                    newInventoryLog = new InventoryLog({column: null, row: null, itemName: itemDB.name, space: itemDB.space, user: uid, area, type: 'TAKED'})
                    await newInventoryLog.save();
                
                    return res.status(200).json(newInventoryLog)
                break;
        }

        // Eliminar imagen del item
        deleteImage(model, "items")

        newInventoryLog = new InventoryLog({column: null, row: null, itemName: itemDB.name, space: itemDB.space, user: uid, area, type: 'DELETE'})
        await newInventoryLog.save();
    
        res.status(200).json(newInventoryLog)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    inventoryGetByTaked,
    inventoryLogsGet,
    inventoryGetBySpace,
    itemGetById,
    itemPut,
    itemPost,
    itemReturn,
    itemDelete
}