const Area = require('../models/area_model');

const areaGet = async(req, res) => {
    const resp = await Area.find();

    res.status(200).json(resp)
}

const areaGetByUserID = async(req, res) => {
    const id = req.user._id

    const resp = await Area.find({$or:[{'admins': id}, {'users':id}]});

    res.status(200).json(resp)
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

    res.status(200).json(updatedArea)
}

const areaPost = async(req, res) => {

    const userId = req.user._id
    const { name } = req.body;

    const newArea = new Area({name, admins: [userId]});
    await newArea.save();

    res.status(201).json(newArea)
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

    res.status(200).json(deletedArea)
}

module.exports = {
    areaGetByUserID,
    areaGet,
    areaPut,
    areaPost,
    areaDelete
}