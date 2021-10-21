const Item = require('../models/item_model');
const mongoose = require('mongoose');

const validateItem = async(req, res, next) => {
    try {
        const itemid = req.params.id;
        const isValid = mongoose.Types.ObjectId.isValid(itemid);
        if (!isValid) {
            return res.status(401).json({
                param: 'id',
                msg: 'No es un ID de articulo valido'
            })
        }

        const itemDB = await Item.findById(itemid)
        if (!itemDB) {
            return res.status(401).json({
                param: 'id',
                msg: 'El articulo no existe en la base de datos'
            })
        }
            
        req.itemDB = itemDB;
        next();
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    validateItem
}