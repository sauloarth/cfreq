const router = require('express').Router({ mergeParams: true })
const FuncionarioController = require('../controllers/FuncionarioController');

router.get('/', FuncionarioController.funcionarioList);
router.post('/', FuncionarioController.funcionarioCreate);
router.put('/:id', FuncionarioController.funcionarioUpdate);
router.delete('/:id', FuncionarioController.funcionarioDisable);

module.exports = router;