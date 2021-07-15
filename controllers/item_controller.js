const Item = require('../models/item_model');

const itemGet = async(req, res) => {
    const uid = req.user._id
    const resp = await Space.find({user: uid});

    res.status(200).json({
        resp        
    })
}

const itemPut = async(req, res) => {
    const id = req.params.id;
    const uid = req.user._id;
    const { user, _id, ...rest } = req.body;

    const spaceDB = await Space.findOne({_id: id, user: uid})
    if (!spaceDB) {
        return res.status(400).json({
            msg: `Su usuario no tiene un espacio con el id ${id}`
        })
    }

    const updatedSpace = await Space.findByIdAndUpdate(id, rest, {new: true})

    res.status(200).json({
        updatedSpace
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
    const uid = req.user._id;

    const spaceDB = await Space.findOne({_id: id, user: uid})
    if (!spaceDB) {
        return res.status(400).json({
            msg: `Su usuario no tiene un espacio con el id ${id}`
        })
    }

    const deletedSpace = await Space.findByIdAndDelete(id)

    res.status(200).json({
        deletedSpace,
        msg: 'El espacio se ha borrado correctamente'
    })
}

module.exports = {
    itemGet,
    itemPut,
    itemPost,
    itemDelete
}