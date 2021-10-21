const mongoose = require('mongoose');
const User = require('../models/user_model');
const Area = require('../models/area_model');
const Space = require('../models/space_model');
const Category = require('../models/category_model');
const isValid = mongoose.Types.ObjectId.isValid;

const emailAvailable = async(email = '') => {
    const emailAvailable = await User.findOne({email});
    if (emailAvailable) {
        throw new Error(`El correo ya esta en uso`)
    }
};

const emailExists = async(email = '') => {
    const emailExists = await User.findOne({email});
    if (!emailExists) {
        throw new Error(`El correo ingresado no pertenece a un usuario`)
    }
};

const categoryExists = async(id = '') => {
    const isUserValid = isValid(id)
    if (!isUserValid) {
        throw new Error(`No es un ID de categoria valido`);
    }

    const categoryDB = await Category.findById(id);
    if (!categoryDB) {
        throw new Error(`La categoria solicitada no existe`)
    }
};

const areaExists = async(id = '') => {
    const isAreaValid = isValid(id)
    if (!isAreaValid) {
        throw new Error(`No es un ID de área valido`);
    }

    const areaDB = await Area.findById(id);
    if (!areaDB) {
        throw new Error(`El área no existe en la base de datos`);
    }
};

const spaceExists = async(id = '') => {
    const isSpaceValid = isValid(id)
    if (!isSpaceValid) {
        throw new Error(`No es un ID de espacio valido`);
    }

    const spaceDB = await Space.findById(id);
    if (!spaceDB) {
        throw new Error(`El espacio no existe en la base de datos`);
    }
};

const userExists = async(id = '') => {
    const isUserValid = isValid(id)
    if (!isUserValid) {
        throw new Error(`No es un ID de usuario valido`);
    }

    const userExists = await User.findById(id);
    if (!userExists) {
        throw new Error(`El usuario no existe en la base de datos`);
    }
};

const userIsAdmin = async(userid = '', id = '', res, isSpace = false) => {
    let areaDB;
    if (isSpace) {
        const spaceDB = await Space.findById(id);
        areaDB = await Area.findById(spaceDB.area);
    } else {
        areaDB = await Area.findById(id);
    }

    if (!areaDB.admins.includes(userid)) {
        res.status(401).json({
            msg: `No eres administrador.`
        })
        return false;
    } else {
        return true;
    }
};

const permittedCollections = (collection = '', collections = []) => {
    const include = collections.includes(collection);
    if (!include) {
        throw new Error(`La coleccion ${collection} no esta permitida.`)
    }
    return true;
}

module.exports = {
    spaceExists,
    categoryExists,
    emailExists,
    userIsAdmin,
    areaExists,
    emailAvailable,
    userExists,
    permittedCollections
};
