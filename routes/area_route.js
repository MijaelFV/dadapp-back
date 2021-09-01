const { Router } = require('express');
const { check } = require('express-validator');
const { areaPut, areaPost, areaDelete, areaGet, areaGetByUserID, areaJoin, areaRenewInviteCode } = require('../controllers/area_controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/',[
    validateJWT,
    validateFields
], areaGet);

router.get('/user',[
    validateJWT,
    validateFields
], areaGetByUserID);

router.put('/code/join',[
    validateJWT,
    check('code', 'No es un codigo de invitacion valido').not().isEmpty(),
    validateFields
], areaJoin);

router.put('/code/renew',[
    validateJWT,
    validateFields
], areaRenewInviteCode);

router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID de area valido').isMongoId(),
    validateFields
], areaPut);

router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], areaPost);

router.delete('/:id',[
    validateJWT,
    check('id', 'No es un ID de area valido').isMongoId(),
    validateFields
], areaDelete);

module.exports = router;