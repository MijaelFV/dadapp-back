const path = require('path');
const { response } = require("express");
const { uploadFile } = require('../helpers/upload-file');
const User = require('../models/user_model');
const Item = require('../models/item_model');
const { deleteImage } = require('../helpers/delete-image');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const imagePost = async(req, res = response) => {
    try {
        const name = await uploadFile(req.files, undefined, 'imgs' );
        res.json(name)
    } catch (msg) {
        res.status(400).json({msg});
    }

}

const imagePut = async(req, res = response) => {
    try {
        // Cloudinary Image Hosting //
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
        if (model.image) {
            const nameArr = model.image.split('/');
            const name = nameArr[nameArr.length - 1];
            const [ public_id ] = name.split('.');
            cloudinary.uploader.destroy(public_id);
        }

        const { tempFilePath } = req.files.file
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        model.image = secure_url;

        await model.save();

        res.status(200).json(model)
    } catch (error) {
        console.log(error);
    }
}

// const imagePut = async(req, res = response) => {
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

//         case 'items':
//             model = await Item.findById(id);
//             if (!model) {
//                 return res.status(400).json({
//                     msg: `No existe un item con el id ${id}`
//                 })
//             }
            
//         break;

//         default:
//             return res.status(500).json({msg:'Se me olvido validar esto'});
            
//     }

//     // Limpiar imagenes previas
//     deleteImage(model, collection)

//     const name = await uploadFile(req.files, undefined, collection );
//     model.image = name;

//     await model.save();

//     res.json(model)
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