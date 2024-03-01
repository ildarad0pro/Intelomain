const Router = require('express');
const router = new Router();
const typeController = require('../controllers/typeController');

// Маршрут для создания типа
router.post('/', typeController.create);

// Маршрут для получения всех типов
router.get('/', typeController.getAll);

// Маршрут для обновления информации о типе по его идентификатору
router.put('/:id', typeController.update);

// Маршрут для удаления типа по его идентификатору
router.delete('/:id', typeController.delete);

module.exports = router;
