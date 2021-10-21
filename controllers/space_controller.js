const { userIsAdmin } = require('../helpers/db-validators');
const { deleteImageCloudinary } = require('../helpers/delete-image');
const Category = require('../models/category_model');
const InventoryLog = require('../models/inventoryLog_model');
const Item = require('../models/item_model');
const Space = require('../models/space_model');

const spaceGetByArea = async(req, res) => {
    try {
        const id = req.params.id;

        const resp = await Space.find({area: id})
    
        res.status(200).json(resp)
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const spacePut = async(req, res) => {
    try {
        const uid = req.user._id;
        const id = req.params.id;
        const {name, rows, columns} = req.body;

        // Verificar que el usuario sea administrador
        if (!await userIsAdmin(uid, id, res, true)) return null;

        const spaceDB = await Space.findById(id);

        if (rows !== spaceDB.rows || columns !== spaceDB.columns) {
            const matchedItems = await Item.find({space:id}).or([{row: {$gt: rows}}, {column: {$gt: columns}}]).limit(1)
            if (matchedItems.length !== 0) {
                return res.status(400).json({
                    msg: `Las posiciones que quieres remover contienen articulos`
                });
            } else {
                const updatedSpace = await Space.findByIdAndUpdate(id, {name, rows, columns}, {new: true})
                res.status(200).json(updatedSpace)
            }
        }

        if (name !== spaceDB.name) {
            const updatedSpace = await Space.findByIdAndUpdate(id, {name}, {new: true})
            res.status(200).json(updatedSpace)
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const spacePost = async(req, res) => {
    try {
        const uid = req.user._id;
        const { name, rows, columns, area } = req.body;

        // Verificar que el usuario sea administrador
        if (!await userIsAdmin(uid, area, res)) return null;
    
        const newSpace = new Space({name, rows, columns, area});
        await newSpace.save();
    
        res.status(201).json(newSpace);
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const spaceDelete = async(req, res) => {
    try {
        const uid = req.user._id;
        const id = req.params.id;
    
        // Verificar que el usuario sea administrador
        if (!await userIsAdmin(uid, id, res, true)) return null;
    
        await InventoryLog.deleteMany({space: id});
        await Item.find({space:id}).then((items) => {
            items.forEach(item => {
                deleteImageCloudinary(item)
            })
        })
        await Item.deleteMany({space: id})
        await Category.deleteMany({space: id});
        const deletedSpace = await Space.findByIdAndDelete(id)
    
        res.status(200).json(deletedSpace)
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

module.exports = {
    spaceGetByArea,
    spacePut,
    spacePost,
    spaceDelete
}