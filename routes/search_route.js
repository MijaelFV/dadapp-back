const { Router } = require('express');
const { check } = require('express-validator');
const { searchGetByQuery } = require('../controllers/search_controller');
const { areaExists } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:type/:id',[
    validateJWT,
    check('id').custom(areaExists),
    check('type', 'No es un tipo de busqueda valido').not().isEmpty(),
    validateFields
], searchGetByQuery);

module.exports = router;