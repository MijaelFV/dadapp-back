const fs = require('fs');

const readDir = (folder = '', replace = '') => {
    return new Promise((resolve, reject) => {
        // LOAD MODELS
        const info = [];
        fs.readdirSync(folder).forEach((file) => {
            let filename = file.substr(0, file.indexOf('.'));
            let name = filename.replace(replace, '');
            info.push({
                file,     // testCtrl.js
                filename, // testCtrl
                name,     // test
            })
        });
        resolve(info);
    })
}

module.exports = {
    readDir
}