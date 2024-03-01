const Router = require('express');
const router = new Router();
const checkRole = require('../middleware/checkRoleMiddleware');
const controlController = require('../controllers/controlController');

// Маршрут для создания управления
router.post('/', controlController.create);

// Маршрут для получения всех управлений
router.get('/', controlController.getAll);

// Маршрут для получения управления по его идентификатору
router.get('/:id', controlController.getOne);

// Маршрут для обновления управления по его идентификатору
router.put('/:id', controlController.update);

// Маршрут для удаления управления по его идентификатору
router.delete('/:id', controlController.delete);

// Маршрут для получения всех устройств, связанных с определенным управлением
router.get('/:id/devices', controlController.getDevicesByControl);

module.exports = router;
