const shortid = require('shortid');
const { deleteImageCloudinary } = require('../helpers/delete-image');
const Area = require('../models/area_model');
const Category = require('../models/category_model');
const InventoryLog = require('../models/inventoryLog_model');
const Item = require('../models/item_model');
const Space = require('../models/space_model');

const areaGet = async(req, res) => {
    const resp = await Area.find();

    res.status(200).json(resp)
}

const areaGetByUserID = async(req, res) => {
    const id = req.user._id

    const resp = await Area.find({$or:[{'admins': id}, {'users':id}]}).select('-inviteCode');

    res.status(200).json(resp)
}

const areaGetByID = async(req, res) => {
    const userid = req.user._id
    const areaid = req.params.id

    const select = "_id name email"
    const resp = await Area.findOne({_id: areaid, admins: userid}).populate({path: "admins", select}).populate({path: "users", select})

    res.status(200).json(resp)
}

const areaDeleteUser = async(req, res) => {
    const {userid, areaid} = req.body

    const matchedArea = await Area.findById(areaid)

    if (matchedArea.admins.includes(userid)) {
        await Area.findByIdAndUpdate(matchedArea._id, {$pull: {admins: userid}})
    } else {
        await Area.findByIdAndUpdate(matchedArea._id, {$pull: {users: userid}})
    }

    res.status(200).json({msg: 'Succefully deleted user'})
}

const areaChangeUserRole = async(req, res) => {
    const {userid, areaid} = req.body

    const matchedArea = await Area.findById(areaid)

    if (matchedArea.admins.includes(userid)) {
        await Area.findByIdAndUpdate(matchedArea._id, {$pull: {admins: userid}})
        await Area.findByIdAndUpdate(matchedArea._id, {$push: {users: userid}})
    } else {
        await Area.findByIdAndUpdate(matchedArea._id, {$pull: {users: userid}})
        await Area.findByIdAndUpdate(matchedArea._id, {$push: {admins: userid}})
    }

    res.status(200).json({msg: 'Succefully changed role'})
}

const areaJoin = async(req, res) => {
    const id = req.user._id
    const { code } = req.body;

    const matchedArea = await Area.findOne({inviteCode: code})
    if (!matchedArea) {
        return res.status(404).json({
            msg: `El codigo de invitación ingresado es invalido`
        })
    } else if (matchedArea.users.includes(id) || matchedArea.admins.includes(id)) {
        return res.status(409).json({
            msg: `Ya eres miembro del area`
        })
    }

    await Area.findByIdAndUpdate(matchedArea._id, {$push: {users: id}})

    res.status(200).json({msg: 'Successfully modified area'})
}

const areaRenewInviteCode = async(req, res) => {
    const userId = req.user._id
    const areaid = req.body.areaid;

    const areaDB = await Area.findById(areaid)
    if (!areaDB) {
        return res.status(404).json({
            msg: `No existe un area con el id ${areaid}`
        })
    } else if (!areaDB.admins.includes(userId)) {
        return res.status(401).json({
            msg: `No eres administrador del area con el id ${areaid}`
        })
    }
    
    const newCode = shortid.generate();
    await Area.findByIdAndUpdate(areaid, {inviteCode: newCode})

    res.status(200).json(newCode)
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

    const updatedArea = await Area.findByIdAndUpdate(id, {name}, {new: true}).populate('admins').populate('users')

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

    await Space.find({area: id}).then(async(spaces) => {
        spaces.forEach(async(space) => {
            await InventoryLog.deleteMany({space: space._id});
            await Item.find({space: space._id}).then((items) => {
                items.forEach(item => {
                    deleteImageCloudinary(item)
                })
            })
            await Item.deleteMany({space: space._id})
            await Category.deleteMany({space: space._id});
        })
    })
    await Space.deleteMany({area: id})
    await Area.findByIdAndDelete(id)

    res.status(200).json({msg: 'The area and its content were successfully deleted'})
}

module.exports = {
    areaGetByUserID,
    areaGetByID,
    areaGet,
    areaDeleteUser,
    areaChangeUserRole,
    areaJoin,
    areaRenewInviteCode,
    areaPut,
    areaPost,
    areaDelete
}