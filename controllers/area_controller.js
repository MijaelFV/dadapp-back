const shortid = require('shortid');
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

const areaJoin = async(req, res) => {
    const id = req.user._id
    const { code } = req.body;

    const matchedArea = await Area.findOne({inviteCode: code})
    if (!matchedArea) {
        return res.status(404).json({
            msg: `No existe el codigo de invitacion ${code}`
        })
    } else if (matchedArea.users.includes(id)) {
        return res.status(409).json({
            msg: `Ya eres miembro del area`
        })
    }

    await Area.findByIdAndUpdate(matchedArea._id, {$push: {users: id}})

    res.status(200).json({msg: 'Succefully modified area'})
}

const areaRenewInviteCode = async(req, res) => {
    // const userId = req.user._id
    // const areaid = req.body.area;

    // const areaDB = await Area.findById(areaid)
    // if (!areaDB) {
    //     return res.status(404).json({
    //         msg: `No existe un area con el id ${areaid}`
    //     })
    // } else if (!areaDB.admins.includes(userId)) {
    //     return res.status(401).json({
    //         msg: `No eres administrador del area con el id ${areaid}`
    //     })
    // }
    
    const newCode = shortid.generate();
    // await Area.findByIdAndUpdate(areaid, {inviteCode: newCode})

    res.status(200).json({msg: 'Succefully renewed invitation code', newCode})
}

const areaPut = async(req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    const areaDB = await Area.findById(id)
    if (!areaDB) {
        return res.status(404).json({
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
        return res.status(404).json({
            msg: `No existe un area con el id ${id}`
        })
    }

    const deletedArea = await Area.findByIdAndDelete(id)

    res.status(200).json(deletedArea)
}

module.exports = {
    areaGetByUserID,
    areaGet,
    areaJoin,
    areaRenewInviteCode,
    areaPut,
    areaPost,
    areaDelete
}