const Router = require('express');
const router = new Router();
const kitController = require('../controllers/kitController');

// Маршрут для создания набора
router.post('/', kitController.create);

// Маршрут для получения всех наборов
router.get('/', kitController.getAll);

// Маршрут для получения всех устройств в наборе по его идентификатору
router.get('/:id/devices', kitController.getDevicesInKit);

// Маршрут для обновления информации о наборе по его идентификатору
router.put('/:id', kitController.update);

// Маршрут для удаления набора по его идентификатору
router.delete('/:id', kitController.delete);

module.exports = router;
