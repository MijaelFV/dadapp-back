const User = require('../models/user_model');
const Item = require('../models/item_model');
const { deleteImageCloudinary } = require('../helpers/delete-image');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const imagePut = async(req, res) => {
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
        deleteImageCloudinary(model)

        const { tempFilePath } = req.files.file
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        model.image = secure_url;

        await model.save();

        res.status(200).json(model)
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

module.exports = {
    imagePut
}