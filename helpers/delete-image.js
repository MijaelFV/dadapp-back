const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const deleteImage = (model, collection) => {
    if (model.image) {
        const pathImagen = path.join(__dirname, '../uploads', collection, model.image);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }
}

const deleteImageCloudinary = (model) => {
    if (model.image) {
        const nameArr = model.image.split('/');
        const name = nameArr[nameArr.length - 1];
        const [ public_id ] = name.split('.');
        cloudinary.uploader.destroy(public_id);
    }
}

module.exports = {
    deleteImage,
    deleteImageCloudinary
}