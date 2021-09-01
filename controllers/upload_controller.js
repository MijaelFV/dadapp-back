const path = require('path');

const { response } = require("express");
const { uploadFile } = require('../helpers/upload-file');
const User = require('../models/user_model');
const Item = require('../models/item_model');
const { deleteImage } = require('../helpers/delete-image');

const imagePost = async(req, res = response) => {
    try {
        const name = await uploadFile(req.files, undefined, 'imgs' );
        res.json(name)
    } catch (msg) {
        res.status(400).json({msg});
    }

}

const imagePut = async(req, res = response) => {
    const {id, collection} = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            
        break;

        case 'items':
            model = await Item.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un item con el id ${id}`
                })
            }
            
        break;

        default:
            return res.status(500).json({msg:'Se me olvido validar esto'});
            
    }

    // Limpiar imagenes previas
    deleteImage(model, collection)

    const name = await uploadFile(req.files, undefined, collection );
    model.image = name;

    await model.save();

    res.json(model)
}

const imageGet = async(req, res = response) => {

    const {id, collection} = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
            
        break;

        case 'items':
            model = await Item.findById(id);
            if (!model) {
                return res.status(400).json({
                    msg: `No existe un Item con el id ${id}`
                })
            }
            
        break;

        default:
            return res.status(500).json({msg:'Se me olvido validar esto'});
            
    }

    let pathImage;

    if (!model.image && collection === "users") {
        return res.json()
    } else if (!model.image && collection === "items") {
        pathImage = path.join(__dirname, '../assets/no-image.jpg');
        return res.sendFile(pathImage)
    }

    pathImage = path.join(__dirname, `../uploads/${collection}/${model.image}`);

    res.sendFile(pathImage);
}

module.exports = {
    imagePost,
    imagePut,
    imageGet
}