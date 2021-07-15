const Item = require('../models/item_model');

const itemGet = async(req, res) => {
    const resp = await Item.find();

    res.status(200).json({
        resp        
    })
}

const itemPut = async(req, res) => {
    const id = req.params.id;
    const data = req.body;

    const itemDB = await Item.findById(id)
    if (!itemDB) {
        return res.status(400).json({
            msg: `No existe un item con el id ${id}`
        })
    }

    const updatedItem = await Item.findByIdAndUpdate(id, data, {new: true})

    res.status(200).json({
        updatedItem
    })
}

const itemPost = async(req, res) => {
    const { name, description, category } = req.body;

    const newItem = new Item({name, description, category});
    await newItem.save();

    res.status(201).json({
        newItem
    });
}

const itemDelete = async(req, res) => {
    const id = req.params.id;

    const itemDB = await Item.findById(id)
    if (!itemDB) {
        return res.status(400).json({
            msg: `No existe un item con el id ${id}`
        })
    }

    const deletedItem = await Item.findByIdAndDelete(id)

    res.status(200).json({
        deletedItem
    })
}

module.exports = {
    itemGet,
    itemPut,
    itemPost,
    itemDelete
}