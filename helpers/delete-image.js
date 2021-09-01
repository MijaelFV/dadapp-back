const path = require('path');
const fs = require('fs');

const deleteImage = (model, collection) => {
    if (model.image) {
        const pathImagen = path.join(__dirname, '../uploads', collection, model.image);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }
}

module.exports = {
    deleteImage
}