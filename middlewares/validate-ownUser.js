const validateOwnUser = (req, res, next) => {
    const useridFromRequest = req.params.id;
    const {_id: useridFromToken} = req.user;

    if (useridFromToken !== useridFromRequest) {
        return res.status(401).json({
            param: 'id',
            msg: 'Esta acción no esta permitida.'
        })
    }
    
    next();
}

module.exports = {
    validateOwnUser
}   