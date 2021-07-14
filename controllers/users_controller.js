const User = require('../models/user_model');
const Area = require('../models/area_model');
const bcryptjs = require('bcryptjs');

const userGet = async(req, res) => {
    const resp = await User.find();
    
    res.json({
        resp
    })
}

const userPut = async(req, res) => {
    const id = req.params.id
    const {password, google, email, _id, active, ...rest} = req.body;

    if (password) {
        // Encriptar la password
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, rest, {new: true});

    res.json({
        updatedUser
    })
}

const userPost = async(req, res) => {
    const {name, email, password, areaName} = req.body;
    const newUser = new User({name, email, password})

    // Encriptar la password
    const salt = bcryptjs.genSaltSync();
    newUser.password = bcryptjs.hashSync(password, salt);

    // Guardar en DB
    await newUser.save();

    res.json({
        newUser
    })
}

const userDelete = async(req, res) => {
    const id = req.params.id
    
    const deletedUser = await User.findByIdAndUpdate(id, {active: false}, {new: true});

    res.json({
        deletedUser
    })
}

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete
}