const { Router } = require('express');
const { check } = require('express-validator');
const { categoryPut, categoryPost, categoryDelete, categoryGetBySpace } = require('../controllers/category_controller');
const { categoryExists, spaceExists } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:id',[
    validateJWT,
    check('id').custom(spaceExists),
    validateFields
], categoryGetBySpace);

router.put('/:spaceid/:id',[
    validateJWT,
    check('spaceid').custom(spaceExists),
    check('id').custom(categoryExists),
    validateFields
], categoryPut);

router.post('/:id',[
    validateJWT,
    check('id').custom(spaceExists),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], categoryPost);

router.delete('/:spaceid/:id',[
    validateJWT,
    check('spaceid').custom(spaceExists),
    check('id').custom(categoryExists),
    validateFields
], categoryDelete);

module.exports = router;