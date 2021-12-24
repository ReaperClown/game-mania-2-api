const router = require('express').Router();
const cateController = require('../controllers/cateController')
//const { verifyUser, verifyAdmin } = require("../middleware/verifyToken"); //import novo

router.post('/', cateController.createCategory);

router.get('/show', cateController.getCategories);

router.delete('/:categId', cateController.deleteCategory);

router.put('/:categId', cateController.updateCategory);

module.exports = router;