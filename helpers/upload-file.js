const path = require('path');
const {v4: uuidv4} = require('uuid');

const uploadFile = (files, validExtensions = ['png', 'jpg', 'jpeg'], folder = '') => {

    return new Promise((resolve, reject) => {
        const {file} = files;
        const splitedName = file.name.split('.');
        const extension = splitedName[splitedName.length - 1];
        
        // Validar la extension
        if ( !validExtensions.includes(extension) ) {
            return reject(`La extension ${extension} no esta permitida - ${validExtensions}`)
        }
    
        const tempName = uuidv4() + '.' + extension;
        const uploadPath =  path.join(__dirname, '../uploads/', folder,  tempName);
    
        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
    
            resolve(tempName);
        });
    })
}

module.exports = {
    uploadFile
}