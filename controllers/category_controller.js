const { userIsAdmin } = require("../helpers/db-validators");
const Category = require("../models/category_model");
const Item = require("../models/item_model");

const categoryGetBySpace = async(req, res) => {
    try {
        const id = req.params.id;
        const resp = await Category.find({space: id});
    
        res.status(200).json(resp)
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const categoryPut = async(req, res) => {
    try {
        const { id, spaceid } = req.params;
        const { name } = req.body;
    
        // Verificar que el usuario sea administrador
        if (!await userIsAdmin(userid, spaceid, res, true)) return null;

        await Category.findByIdAndUpdate(id, {name}, {new: true})
    
        res.status(200).json({msg: "Se actualizo la categoria correctamente"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const categoryPost = async(req, res) => {
    try {
        const spaceid = req.params.id;
        const userid = req.user._id
        const { name } = req.body;
    
        // Verificar que el usuario sea administrador
        if (!await userIsAdmin(userid, spaceid, res, true)) return null;

        const categoryDB = await Category.findOne({name: name, space: spaceid})
        if (categoryDB) {
            return res.status(400).json({
                msg: `Ya existe una categoria con ese nombre`
            })
        }
    
        const newCategory = new Category({name, space: spaceid});
        await newCategory.save();
    
        res.status(201).json({msg: "Se creo una nueva categoria correctamente"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

const categoryDelete = async(req, res) => {
    try {
        const { id, spaceid } = req.params;
        const userid = req.user._id

        // Verificar que el usuario sea administrador
        if (!await userIsAdmin(userid, spaceid, res, true)) return null;

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
        return res.status(500).json({msg: "Error en el servidor"})
    }
}

module.exports = {
    categoryGetBySpace,
    categoryPut,
    categoryPost,
    categoryDelete
}