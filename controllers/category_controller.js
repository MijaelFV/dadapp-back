const Category = require("../models/category_model");
const Item = require("../models/item_model");

const categoryGet = async(req, res) => {
    const resp = await Category.find();

    res.status(200).json(resp)
}

const categoryGetBySpace = async(req, res) => {
    const id = req.params.id;
    const resp = await Category.find({space: id});

    res.status(200).json(resp)
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

    res.status(200).json(updatedCategory)
}

const categoryPost = async(req, res) => {
    const spaceId = req.params.id;
    const { name } = req.body;

    const newCategory = new Category({name, space: spaceId});
    await newCategory.save();

    res.status(201).json(newCategory);
}

const categoryDelete = async(req, res) => {
    try {
        const id = req.params.id;

        const categoryDB = await Category.findById(id)
        if (!categoryDB) {
            return res.status(400).json({
                msg: `No existe una categoria con el id ${id}`
            })
        }

        const matchedItems = await Item.findOne({category: id})
        if (matchedItems?.length !== 0 && matchedItems) {
            return res.status(400).json({
                msg: `La categoria esta siendo utilizada por uno o más articulos`
            });
        } else {
            const deletedCategory = await Category.findByIdAndDelete(id)
            res.status(200).json(deletedCategory)
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    categoryGet,
    categoryGetBySpace,
    categoryPut,
    categoryPost,
    categoryDelete
}