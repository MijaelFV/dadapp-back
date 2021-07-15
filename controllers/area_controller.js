const bcryptjs = require('bcryptjs');
const Area = require('../models/area_model');
const User = require('../models/user_model');

const areaGet = async(req, res) => {
    const uid = req.user._id
    const resp = await Area.find({admin: uid});

    res.status(200).json({
        resp        
    })
}

const areaPut = async(req, res) => {
    const id = req.params.id;
    const uid = req.user._id;
    const { admin, members: membersEmail, name, ...rest } = req.body;

    const areaDB = await Area.findOne({_id: id, admin: uid})
    if (!areaDB) {
        return res.status(401).json({
            msg: `Su usuario no administra un area con el id ${id}`
        })
    }

    const members = await User.find({}, '_id').where('email').in(membersEmail);

    if (membersEmail) {
        if ( membersEmail.length > members.length ) {
            return res.status(400).json({
                msg: `Alguno de los usuarios no existen`
            })
        }
    }

    const data = {
        members,
        name,
        ...rest
    } 

    const updatedArea = await Area.findByIdAndUpdate(id, data, {new: true})

    res.status(200).json({
        updatedArea
    })
}

const areaPost = async(req, res) => {
    const { name } = req.body;
    const uid = req.user._id;

    const areaDB = await Area.findOne({admin: uid});
    if (areaDB) {
        return res.status(400).json({
            msg: 'El usuario ya tiene un Area creada'
        })
    }

    const newArea = new Area({name, admin: uid});

    await newArea.save();

    res.status(201).json({
        newArea
    });
}

const areaDelete = async(req, res) => {
    const id = req.params.id;
    const password = req.body.password
    const user = req.user;

    // Verificar la password para confirmar
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
        return res.status(401).json({
            msg: 'La password es incorrecta'
        })
    }

    // Verificar que el usuario tiene un area
    const areaDB = await Area.findOne({_id: id, admin: user._id})
    if (!areaDB) {
        return res.status(400).json({
            msg: `Su usuario no tiene un area con el id ${id}`
        })
    }


    const deletedArea = await Area.findByIdAndDelete(id)

    res.status(200).json({
        deletedArea
    })
}

module.exports = {
    areaGet,
    areaPut,
    areaPost,
    areaDelete
}