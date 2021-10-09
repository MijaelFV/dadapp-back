const Item = require('../models/item_model');
const InventoryLog = require('../models/inventoryLog_model');
const Space = require('../models/space_model');
const { deleteImageCloudinary } = require('../helpers/delete-image');

const inventoryLogsGet = async(req, res) => {
    const {type, id, areaid} = req.params;
    const {page, limit} = req.query;
    let query;

    if (type === "1") {
        query = {area: id}
    } else if (type === "2") {
        query = {item: id}
    } else if (type === "3") {
        query = {user: id, area: areaid}
    }

    const options = {
        sort: { time: -1 },
        page: page,
        limit: limit,
        populate: [
            {path: 'item', select: 'name column row takedBy'},
            {path: 'space', select: 'name'},
            {path: 'user', select: 'name image'}
        ],
    };

    
    InventoryLog.paginate(query, options).then((result) => {
        const docs = result.docs
        const totalPages = result.totalPages

        res.status(200).json({docs, totalPages})
    });
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
    const space = req.params.id;
    const {page, limit, row, column} = req.query;
 
    const options = {
        sort: { expiryDate: -1 },
        page: page,
        limit: limit,
        populate: [
            {path: 'category', select: 'name'},
            {path: 'takedBy', select: 'name'},
            {path: 'space', select: 'name'}
        ],
    };

    let query;
    if (row !== '0' && column !== '0') {
        query = {space, row, column}
    } else {
        query = {space}
    }

    Item.paginate(query, options)
        .then((result) => {
            const docs = result.docs
            const totalPages = result.totalPages

            res.status(200).json({docs, totalPages})
        });
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
        const { name, description, category, column, row, area, expiryDate, quantity} = req.body;
        
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
            row: row || itemDB.row,
            expiryDate: expiryDate === '' ? null : expiryDate,
            quantity: quantity === '' ? null : quantity
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
        const { name, description, category, column, row, space, area, expiryDate, quantity } = req.body;
        const data = {
            name,
            description,
            category,
            column,
            row,
            space,
            expiryDate,
            quantity
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

const itemRemove = async(req, res) => {
    try {
        const itemId = req.params.id;
        const uid = req.user._id;
        const { area, type, consume } = req.body;
    
        const itemDB = await Item.findById(itemId)
        if (!itemDB) {
            return res.status(400).json({
                msg: `No existe un item con el id ${itemId}`
            })
        }

        let newInventoryLog
        switch (type) {
            case 1: 
                    // Retirar un articulo con la posibilidad de devolverlo
                    await Item.findByIdAndUpdate(itemId, {takedBy: uid, takedDate: new Date})
                    newInventoryLog = new InventoryLog({column: null, row: null, item: itemDB._id, itemName: itemDB.name, space: itemDB.space, user: uid, area, type: 'TAKED'})
                    await newInventoryLog.save();
                
                    return res.status(200).json("Se retiro el articulo")
                break;

            case 2:
                    // Consumir una o mas unidades de las disponibles de un articulo 
                    let quantity = itemDB.quantity - consume
                    quantity < 0 ? quantity = 0 : null

                    await Item.findByIdAndUpdate(itemId, {quantity})
                    newInventoryLog = new InventoryLog({column: itemDB.column, row: itemDB.row, item: itemDB._id, itemName: itemDB.name, quantity: consume, space: itemDB.space, user: uid, area, type: 'CONSUMED'})
                    await newInventoryLog.save();
                
                    return res.status(200).json("Se consumio el articulo")
                break;
        }
    } catch (error) {
        console.log(error);
    }
}

const itemDelete = async(req, res) => {
    try {
        const itemId = req.params.id;
        const uid = req.user._id;
        const { area } = req.body;
    
        const itemDB = await Item.findById(itemId)
        if (!itemDB) {
            return res.status(400).json({
                msg: `No existe un item con el id ${itemId}`
            })
        }

        let model;
        let newInventoryLog
    
        // Eliminar permanentemente un articulo
        model = await Item.findByIdAndDelete(itemId);

        // Eliminar imagen del item
        deleteImageCloudinary(model)

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
    itemRemove,
    itemDelete
}