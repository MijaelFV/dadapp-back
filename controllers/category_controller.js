const Category = require("../models/category_model");

const categoryGet = async(req, res) => {
    const resp = await Category.find();

    res.status(200).json({
        resp        
    })
}

const categoryGetByArea = async(req, res) => {
    const id = req.params.id;
    const resp = await Category.find({area: id});

    res.status(200).json({
        resp        
    })
}

const categoryPut = async(req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    const categoryDB = await Category.findById(id)
    if (!categoryDB) {
        return res.status(400).json({
            msg: `No existe una categoria con el id ${id}`
        })
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, {name}, {new: true})

    res.status(200).json({
        updatedCategory
    })
}

const categoryPost = async(req, res) => {
    const { name } = req.body;

    const newCategory = new Category({name});
    await newCategory.save();

    res.status(201).json({
        newCategory
    });
}

const categoryDelete = async(req, res) => {
    const id = req.params.id;
    const uid = req.user._id;

    const categoryDB = await Category.findById(id)
    if (!categoryDB) {
        return res.status(400).json({
            msg: `No existe una categoria con el id ${id}`
        })
    }

    const deletedCategory = await Category.findByIdAndDelete(id)

    res.status(200).json({
        deletedCategory
    })
}

module.exports = {
    categoryGet,
    categoryGetByArea,
    categoryPut,
    categoryPost,
    categoryDelete
}