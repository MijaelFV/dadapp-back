const Item = require('../models/item_model');
const Space = require('../models/space_model');
const User = require('../models/user_model');
const Area = require('../models/area_model');
const Category = require('../models/category_model');

const searchGetByQuery = async(req, res) => {
    const {id, type} = req.params;
    const {query, spaceid, page, limit, row, column} = req.query;

    const regex = new RegExp(query, 'i');

    const itemsSearch = async() => {
        let uidList;

        if (spaceid) {
            uidList = spaceid
        } else {
            const spacesFromArea = await Space.find({area: id}).select("_id")
            uidList = spacesFromArea.map((uid) => (
                JSON.stringify(uid).replace(/[^a-zA-Z0-9]/g, '').substring(3)
            ));
        }

        const matchedCategories = await Category.distinct("_id", {name: {$regex: regex}, space: uidList})

        let baseQuery = {"space": {$in: uidList}, $or:[{category: matchedCategories}, {name: {$regex: regex}}]}
        let extraQuery;
        if (row !== '' && column === '') {
            extraQuery = {row}
        } else if (column !== '' && row === '') {
            extraQuery = {column}
        } else if (row !== '' && column !== '') {
            extraQuery = {column, row}
        } else {
            extraQuery = {}
        }

        let fullQuery = {...baseQuery, ...extraQuery}

        const options = {
            page: page,
            limit: limit,
            populate: [
                {path: 'category', select: 'name'},
                {path: 'space', select: 'name'},
            ],
        };
            
        return Item.paginate(fullQuery, options).then((result) => {
            const docs = result.docs
            const totalPages = result.totalPages
    
            return {docs, totalPages}
        });
    }

    const usersSearch = async() => {
        const usersFromArea = await Area.find({_id: id}).select("users admins -_id")
        const {admins, users} = usersFromArea[0]

        const options = {
            page: page,
            limit: limit,
            select: '-active'
        };

        return User.paginate({name: {$regex: regex}, active: true, $or: [{_id: admins}, {_id: users}]}, options).then((result) => {
            const docs = result.docs
            const totalPages = result.totalPages
    
            return {docs, totalPages}
        });
    }

    let resp
    try {
        switch (type) {
            case "all":
                    resp = {
                        items: await itemsSearch(),
                        users: await usersSearch(),
                    };
                    return res.status(200).json(resp);
                break;
    
            case "items":
                    resp = {
                        items: await itemsSearch(),
                    };
                    return res.status(200).json(resp);
                break;
    
            case "users":
                    resp = {
                        users: await usersSearch(),
                    };
                    return res.status(200).json(resp);
                break;
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    searchGetByQuery
}