const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { uploadFile } = require('../helpers/upload-file');
const User = require('../models/user_model');
const Item = require('../models/item_model');

const imagePost = async(req, res = response) => {
    try {
        const name = await uploadFile(req.files, undefined, 'imgs' );
        res.json({
            name
        })
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

        case 'objects':
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

    // Limpiar imagenes previas
    if (model.image) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', collection, model.image);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }


    const name = await uploadFile(req.files, undefined, collection );
    model.image = name;

    await model.save();

    res.json({
        model
    })
}

// const imagePutCloudinary = async(req, res = response) => {

//     const {id, collection} = req.params;

//     let model;

//     switch (collection) {
//         case 'users':
//             model = await User.findById(id);
//             if (!model) {
//                 return res.status(400).json({
//                     msg: `No existe un usuario con el id ${id}`
//                 })
//             }
            
//         break;

//         case 'objects':
//             model = await Item.findById(id);
//             if (!model) {
//                 return res.status(400).json({
//                     msg: `No existe un Item con el id ${id}`
//                 })
//             }
            
//         break;

//         default:
//             return res.status(500).json({msg:'Se me olvido validar esto'});
            
//     }

//     if (model.image) {
//         const nameArr = model.image.split('/');
//         const name = nameArr[nameArr.length - 1];
//         const [ public_id ] = name.split('.');
//          cloudinary.uploader.destroy(public_id);
//     }

//     const { tempFilePath } = req.files.archivo
//     const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

//     model.image = secure_url;

//     await model.save();

//     res.json({
//         model
//     })
// }

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

        case 'objects':
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

    if (!model.image && collection === "objects") {
        pathImage = path.join(__dirname, '../assets/no-image.jpg');
        return res.sendFile(pathImage)
    }

    pathImage = path.join(__dirname, `../uploads/${collection}/${model.image}`);

    res.sendFile(pathImage)
}

module.exports = {
    imagePost,
    imagePut,
    imageGet
}