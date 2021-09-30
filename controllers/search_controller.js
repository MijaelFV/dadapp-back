const Item = require('../models/item_model');
const Space = require('../models/space_model');
const User = require('../models/user_model');
const Area = require('../models/area_model');
const Category = require('../models/category_model');

const searchGetByQuery = async(req, res) => {
    const {id, type} = req.params;
    const {query, spaceid} = req.query;

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

        const resp = await Item.find().or([{category: matchedCategories}, {name: {$regex: regex}}])
            .where('space')
            .in(uidList)
            .select('-takedBy -takedDate')
            .populate('category', '_id name')
            .populate('space', '_id name') 
            
        return resp
    }

    const usersSearch = async() => {
        const usersFromArea = await Area.find({_id: id}).select("users admins -_id")
        const {admins, users} = usersFromArea[0]

        const resp = await User.find({name: {$regex: regex}, active: true}).or([{_id: admins}, {_id: users}])
        return resp
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