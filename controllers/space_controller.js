const Space = require('../models/space_model');

const spaceGet = async(req, res) => {
    const resp = await Space.find()

    res.status(200).json({
        resp        
    })
}

const spacePut = async(req, res) => {
    const id = req.params.id;
    const {area, ...data} = req.body;

    const spaceDB = await Space.findById(id)
    if (!spaceDB) {
        return res.status(400).json({
            msg: `No existe un espacio con el id ${id}`
        })
    }

    const updatedSpace = await Space.findByIdAndUpdate(id, data, {new: true})

    res.status(200).json({
        updatedSpace
    })
}

const spacePost = async(req, res) => {
    const { name, rows, columns, area } = req.body;

    const newSpace = new Space({name, rows, columns, area});
    await newSpace.save();

    res.status(201).json({
        newSpace
    });
}

const spaceDelete = async(req, res) => {
    const id = req.params.id;

    const spaceDB = await Space.findById(id)
    if (!spaceDB) {
        return res.status(400).json({
            msg: `No existe un espacio con el id ${id}`
        })
    }

    const deletedSpace = await Space.findByIdAndDelete(id)

    res.status(200).json({
        deletedSpace
    })
}

module.exports = {
    spaceGet,
    spacePut,
    spacePost,
    spaceDelete
}