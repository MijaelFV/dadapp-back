const { Router } = require('express');
const { check } = require('express-validator');
const { areaPut, areaPost, areaDelete, areaGetByUserID, areaJoin, areaRenewInviteCode, areaGetByID, areaChangeUserRole, areaDeleteUser } = require('../controllers/area_controller');
const { areaExists, userExists } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/user',[
    validateJWT,
    validateFields
], areaGetByUserID);

router.get('/:id',[
    validateJWT,
    check('id').custom(areaExists),
    validateFields
], areaGetByID);

router.put('/changerole',[
    validateJWT,
    check('areaid').custom(areaExists),
    check('userid').custom(userExists),
    validateFields
], areaChangeUserRole);

router.put('/code/join',[
    validateJWT,
    check('code', 'No es un codigo de invitacion valido').not().isEmpty(),
    validateFields
], areaJoin);

router.put('/code/renew',[
    validateJWT,
    check('areaid').custom(areaExists),
    validateFields
], areaRenewInviteCode);

router.put('/:id',[
    validateJWT,
    check('id').custom(areaExists),
    validateFields
], areaPut);

router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], areaPost);

router.put('/user/kick',[
    validateJWT,
    check('areaid').custom(areaExists),
    check('userid').custom(userExists),
    validateFields
], areaDeleteUser);

router.delete('/:id',[
    validateJWT,
    check('id').custom(areaExists),
    validateFields
], areaDelete);

module.exports = router;