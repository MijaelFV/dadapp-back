const shortid = require('shortid');
const { userIsAdmin } = require('../helpers/db-validators');
const { deleteImageCloudinary } = require('../helpers/delete-image');
const Area = require('../models/area_model');
const Category = require('../models/category_model');
const InventoryLog = require('../models/inventoryLog_model');
const Item = require('../models/item_model');
const Space = require('../models/space_model');

const areaGetByUserID = async(req, res) => {
    try {
        const id = req.user._id

        const resp = await Area.find({$or:[{'admins': id}, {'users':id}]}).select('-inviteCode');

        res.status(200).json(resp)
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const areaGetByID = async(req, res) => {
    try {
        const userid = req.user._id
        const areaid = req.params.id

        const select = "_id name email image"
        const resp = await Area.findOne({_id: areaid, admins: userid}).populate({path: "admins", select}).populate({path: "users", select})

        res.status(200).json(resp)
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const areaDeleteUser = async(req, res) => {
    try {
        const {userid, areaid} = req.body

        // Verificar que el usuario sea administrador
        if (!await userIsAdmin(userid, areaid, res)) return null;

        const matchedArea = await Area.findById(areaid)
        if (matchedArea.admins.includes(userid)) {
            await Area.findByIdAndUpdate(matchedArea._id, {$pull: {admins: userid}})
        } else {
            await Area.findByIdAndUpdate(matchedArea._id, {$pull: {users: userid}})
        }

        res.status(200).json({msg: 'Se ha eliminado al usuario exitosamente'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const areaChangeUserRole = async(req, res) => {
    try {
        const {userid, areaid} = req.body

        // Verificar que el usuario sea administrador
        if (!await userIsAdmin(userid, areaid, res)) return null;

        const matchedArea = await Area.findById(areaid)
        if (matchedArea.admins.includes(userid)) {
            await Area.findByIdAndUpdate(matchedArea._id, {$pull: {admins: userid}})
            await Area.findByIdAndUpdate(matchedArea._id, {$push: {users: userid}})
        } else {
            await Area.findByIdAndUpdate(matchedArea._id, {$pull: {users: userid}})
            await Area.findByIdAndUpdate(matchedArea._id, {$push: {admins: userid}})
        }

        res.status(200).json({msg: 'El rol del usuario ha sido cambiado exitosamente'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const areaJoin = async(req, res) => {
    try {
        const id = req.user._id
        const { code } = req.body;

        const matchedArea = await Area.findOne({inviteCode: code})
        if (!matchedArea) {
            return res.status(400).json({
                msg: `El codigo de invitación ingresado es inválido`
            })
        } else if (matchedArea.users.includes(id) || matchedArea.admins.includes(id)) {
            return res.status(409).json({
                msg: `Ya eres miembro del área`
            })
        }

        await Area.findByIdAndUpdate(matchedArea._id, {$push: {users: id}})

        res.status(200).json({msg: 'Se ha unido unido a un área exitosamente'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const areaRenewInviteCode = async(req, res) => {
    try {
        const userid = req.user._id
        const areaid = req.body.areaid;
        
        // Verificar que el usuario sea administrador
        if (!await userIsAdmin(userid, areaid, res)) return null;

        const newCode = shortid.generate();
        await Area.findByIdAndUpdate(areaid, {inviteCode: newCode})
    
        res.status(200).json(newCode)
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const areaPut = async(req, res) => {
    try {
        const areaid = req.params.id;
        const userid = req.user._id
        const { name } = req.body;

        // Verificar que el usuario sea administrador
        if (!await userIsAdmin(userid, areaid, res)) return null;

        const updatedArea = await Area.findByIdAndUpdate(areaid, {name}, {new: true}).populate('admins').populate('users')

        res.status(200).json(updatedArea)
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const areaPost = async(req, res) => {
    try {
        const userid = req.user._id
        const { name } = req.body;

        const newArea = new Area({name, admins: [userid]});
        await newArea.save();

        res.status(201).json({msg: 'El área se ha creado correctamente'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const areaDelete = async(req, res) => {
    try {
        const areaid = req.params.id;
        const userid = req.user._id

        // Verificar que el usuario sea administrador
        if (!await userIsAdmin(userid, areaid, res)) return null;

        await Space.find({area: areaid}).then(async(spaces) => {
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
        await Space.deleteMany({area: areaid})
        await Area.findByIdAndDelete(areaid)

        res.status(200).json({msg: 'El área y su contenido ha sido eliminado correctamente'})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

module.exports = {
    areaGetByUserID,
    areaGetByID,
    areaDeleteUser,
    areaChangeUserRole,
    areaJoin,
    areaRenewInviteCode,
    areaPut,
    areaPost,
    areaDelete
}