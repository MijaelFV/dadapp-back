const { Router } = require('express');
const { check } = require('express-validator');
const { categoryPut, categoryPost, categoryDelete, categoryGet, categoryGetBySpace } = require('../controllers/category_controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/',[
    validateJWT,
    validateFields
], categoryGet);

router.get('/:id',[
    validateJWT,
    check('id', 'No es un ID de espacio valido').isMongoId(),
    validateFields
], categoryGetBySpace);

router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID de categoria valido').isMongoId(),
    validateFields
], categoryPut);

router.post('/:id',[
    validateJWT,
    check('id', 'No es un ID de espacio valido').isMongoId(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], categoryPost);

router.delete('/:id',[
    validateJWT,
    check('id', 'No es un ID de categoria valido').isMongoId(),
    validateFields
], categoryDelete);

module.exports = router;