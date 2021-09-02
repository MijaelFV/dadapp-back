const Item = require('../models/item_model');
const Space = require('../models/space_model');
const User = require('../models/user_model');

const searchGetByQuery = async(req, res) => {
    const {id, type} = req.params;
    const {query} = req.query;

    const regex = new RegExp(query, 'i');

    const itemsSearch = async() => {
        const spacesFromArea = await Space.find({area: id}).select("_id")
        const uidList = spacesFromArea.map((uid) => (
            JSON.stringify(uid).replace(/[^a-zA-Z0-9]/g, '').substring(3)
        ));
        const resp = await Item.find({name: {$regex: regex}, takedBy: null})
            .where('space')
            .in(uidList)
            .select('-takedBy -takedDate')
            .populate('category')
            .populate('space') 
        return resp
    }

    const usersSearch = async() => {
        const resp = await User.find({name: {$regex: regex}, active: true})
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