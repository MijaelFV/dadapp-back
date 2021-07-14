const Space = require('../models/space_model');

const areaGet = async(req, res) => {
    const uid = req.user._id
    const resp = await Space.find({user: uid});

    res.status(200).json({
        resp        
    })
}

const areaPut = async(req, res) => {
    const id = req.params.id;
    const uid = req.user._id;
    const { user, _id, ...rest } = req.body;

    const spaceDB = await Space.findOne({_id: id, user: uid})
    if (!spaceDB) {
        return res.status(400).json({
            msg: `Su usuario no tiene un espacio con el id ${id}`
        })
    }

    const updatedSpace = await Space.findByIdAndUpdate(id, rest, {new: true})

    res.status(200).json({
        updatedSpace
    })
}

const areaPost = async(req, res) => {
    const { name, rows, columns } = req.body;
    const uid = req.user._id;

    const spaceDB = await Space.findOne({name, user: uid});
    if (spaceDB) {
        return res.status(400).json({
            msg: `El espacio ${ spaceDB.name }, ya existe`
        })
    }

    const data = {
        name,
        rows,
        columns,
        user: uid
    }

    const newSpace = new Space(data);

    // GuardarDB
    await newSpace.save();

    res.status(201).json(newSpace);
}

const areaDelete = async(req, res) => {
    const id = req.params.id;
    const uid = req.user._id;

    const spaceDB = await Space.findOne({_id: id, user: uid})
    if (!spaceDB) {
        return res.status(400).json({
            msg: `Su usuario no tiene un espacio con el id ${id}`
        })
    }

    const deletedSpace = await Space.findByIdAndDelete(id)

    res.status(200).json({
        deletedSpace,
        msg: 'El espacio se ha borrado correctamente'
    })
}

module.exports = {
    areaGet,
    areaPut,
    areaPost,
    areaDelete
}