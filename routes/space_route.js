const { Router } = require('express');
const { check } = require('express-validator');
const { spacePut, spacePost, spaceDelete, spaceGetByArea } = require('../controllers/space_controller');
const { areaExists, spaceExists } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:id',[
    validateJWT,
    check('id').custom(areaExists),
    validateFields
], spaceGetByArea);

router.put('/:id',[
    validateJWT,
    check('id').custom(spaceExists),
    validateFields
], spacePut);

router.post('/',[
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('rows', 'Se necesita el numero de filas obligatoriamente').not().isEmpty(),
    check('columns', 'Se necesita el numero de columnas obligatoriamente').not().isEmpty(),
    check('area').custom(areaExists),
    validateFields
], spacePost);

router.delete('/:id',[
    validateJWT,
    check('id').custom(spaceExists),
    validateFields
], spaceDelete);

module.exports = router;