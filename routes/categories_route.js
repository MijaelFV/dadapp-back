const { Router } = require('express');
const { check } = require('express-validator');
const { categoryPut, categoryPost, categoryDelete, categoryGet } = require('../controllers/categories_controller');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/',[
    validateJWT,
    validateFields
], categoryGet);

router.put('/:id',[
    validateJWT,
    check('id', 'No es un ID de espacio valido').isMongoId(),
    validateFields
], categoryPut);

router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('rows', 'Se necesita el numero de filas obligatoriamente').not().isEmpty(),
    check('columns', 'Se necesita el numero de columnas obligatoriamente').not().isEmpty(),
    validateFields
], categoryPost);

router.delete('/:id',[
    validateJWT,
    check('id', 'No es un ID de espacio valido').isMongoId(),
    validateFields
], categoryDelete);

module.exports = router;