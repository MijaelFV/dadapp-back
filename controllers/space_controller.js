const { deleteImage } = require('../helpers/delete-image');
const Category = require('../models/category_model');
const InventoryLog = require('../models/inventoryLog_model');
const Item = require('../models/item_model');
const Space = require('../models/space_model');

const spaceGetByArea = async(req, res) => {
    const id = req.params.id;

    const resp = await Space.find({area: id})

    res.status(200).json(resp)
}

const spaceGet = async(req, res) => {
    const resp = await Space.find()

    res.status(200).json(resp)
}

const spacePut = async(req, res) => {
    try {
        const id = req.params.id;
        const {name, rows, columns} = req.body;

        const spaceDB = await Space.findById(id)
        if (!spaceDB) {
            return res.status(400).json({
                msg: `No existe un espacio con el id ${id}`
            })
        }

        if (rows !== spaceDB.rows || columns !== spaceDB.columns) {
            const matchedItems = await Item.findOne({space:id}).or([{row: {$gt: rows}}, {column: {$gt: columns}}])
            if (matchedItems.length !== 0) {
                return res.status(400).json({
                    msg: `Las posiciones que quieres remover contienen articulos`
                });
            } else {
                const updatedSpace = await Space.findByIdAndUpdate(id, {name, rows, columns}, {new: true})
                res.status(200).json(updatedSpace)
            }
        }

        const updatedSpace = await Space.findByIdAndUpdate(id, {name}, {new: true})
        res.status(200).json(updatedSpace)

    } catch (error) {
        console.log(error);
    }
}

const spacePost = async(req, res) => {
    const { name, rows, columns, area } = req.body;

    const newSpace = new Space({name, rows, columns, area});
    await newSpace.save();

    res.status(201).json(newSpace);
}

const spaceDelete = async(req, res) => {
    const id = req.params.id;

    const spaceDB = await Space.findById(id)
    if (!spaceDB) {
        return res.status(400).json({
            msg: `No existe un espacio con el id ${id}`
        })
    }

    await InventoryLog.deleteMany({space: id});
    await Item.find({space:id}).then((items) => {
        items.forEach(item => {
            deleteImage(item, "items")
        })
    })
    await Item.deleteMany({space: id}).then()
    await Category.deleteMany({space: id});
    const deletedSpace = await Space.findByIdAndDelete(id)

    res.status(200).json(deletedSpace)
}

module.exports = {
    spaceGetByArea,
    spaceGet,
    spacePut,
    spacePost,
    spaceDelete
}