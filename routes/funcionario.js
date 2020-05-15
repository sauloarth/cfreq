const router = require('express').Router()
const FuncionarioController = require('../controllers/FuncionarioController');

router.get('/', FuncionarioController.funcionarioList);
router.post('/', FuncionarioController.funcionarioCreate);
router.post('/:id', FuncionarioController.funcionarioUpdate);
router.delete('/:id', FuncionarioController.funcionarioDisable);

module.exports = router;