const Router = require('express');
const router = new Router();
const ecosystemController = require('../controllers/ecosystemController');

// Маршрут для создания экосистемы
router.post('/', ecosystemController.create);

// Маршрут для получения всех экосистем
router.get('/', ecosystemController.getAll);

// Маршрут для получения всех устройств в определенной экосистеме по ее идентификатору
router.get('/:id/devices', ecosystemController.getDevicesInEcosystem);

// Маршрут для получения информации об экосистеме по ее идентификатору
router.get('/:id', ecosystemController.getOne);

// Маршрут для обновления информации об экосистеме по ее идентификатору
router.put('/:id', ecosystemController.update);

// Маршрут для удаления экосистемы по ее идентификатору
router.delete('/:id', ecosystemController.delete);

module.exports = router;
