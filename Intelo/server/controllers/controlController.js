const uuid = require('uuid')
const path = require('path');
const {Control, DeviceControl} = require('../models/models')
const ApiError = require('../error/ApiError');

class ControlController {
    async create(req, res, next) {
        try {
            const { name, protocol } = req.body;
            const control = await Control.create({ name, protocol });
            return res.json(control);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res){
        const controls = await Control.findAll()
        return res.json(controls)
    }

    async getOne(req, res) {
        const {id} = req.params
        const control = await Control.findOne(
            {
                where: {id}
            },
        )
        return res.json(device)
    }
    
    async delete(req, res, next) {
        try {
            const { id } = req.params;

            // Найти управление (Control) по его идентификатору
            const control = await Control.findByPk(id);

            if (!control) {
                throw new Error('Управление не найдено');
            }

            // Удалить управление
            await control.destroy();

            return res.json({ message: 'Управление успешно удалено' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

     // Метод для получения всех устройств, связанных с определенным управлением (Control)
     async getDevicesByControl(req, res, next) {
        try {
            const controlId = req.params.id;

            // Найти управление (Control) по его идентификатору
            const control = await Control.findByPk(controlId);

            if (!control) {
                throw new Error('Управление не найдено');
            }

            // Получить все устройства, связанные с этим управлением
            const devices = await control.getDevices();

            return res.json(devices);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    // Раздел change

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name, protocol } = req.body;

            // Найти управление (Control) по его идентификатору
            let control = await Control.findByPk(id);

            if (!control) {
                throw new Error('Управление не найдено');
            }

            // Обновить информацию об управлении
            control.name = name;
            control.protocol = protocol;
            await control.save();

            return res.json(control);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

}
module.exports = new ControlController()