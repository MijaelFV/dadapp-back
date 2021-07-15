const Area = require('../models/area_model');

const areaGet = async(req, res) => {
    const resp = await Area.find();

    res.status(200).json({
        resp        
    })
}

const areaPut = async(req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    const areaDB = await Area.findById(id)
    if (!areaDB) {
        return res.status(401).json({
            msg: `No existe un area con el id ${id}`
        })
    }

    const updatedArea = await Area.findByIdAndUpdate(id, {name}, {new: true})

    res.status(200).json({
        updatedArea
    })
}

const areaPost = async(req, res) => {
    const { name } = req.body;

    const newArea = new Area({name});
    await newArea.save();

    res.status(201).json({
        newArea
    });
}

const areaDelete = async(req, res) => {
    const id = req.params.id;

    const areaDB = await Area.findById(id)
    if (!areaDB) {
        return res.status(401).json({
            msg: `No existe un area con el id ${id}`
        })
    }

    const deletedArea = await Area.findByIdAndDelete(id)

    res.status(200).json({
        deletedArea
    })
}

module.exports = {
    areaGet,
    areaPut,
    areaPost,
    areaDelete
}