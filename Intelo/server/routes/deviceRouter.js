const Router = require('express');
const router = new Router();
const deviceController = require('../controllers/deviceController');

// Маршрут для создания устройства
router.post('/', deviceController.create);

// Маршрут для получения всех устройств
router.get('/', deviceController.getAll);

// Маршрут для получения устройства по его идентификатору
router.get('/:id', deviceController.getOne);

// Маршрут для обновления информации об устройстве по его идентификатору
router.put('/:id', deviceController.update);

// Маршрут для удаления устройства по его идентификатору
router.delete('/:id', deviceController.delete);

module.exports = router;
