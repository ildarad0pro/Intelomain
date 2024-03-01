const uuid = require('uuid')
const path = require('path');
const {Device, Kit, DeviceKit} = require('../models/models')
const ApiError = require('../error/ApiError');

class KitController {
    // Метод создания набора
    async create(req, res, next) {
        try {
            const { typer, devices } = req.body;
            
            // Создание набора
            const kit = await Kit.create({ typer });

            // Если указаны устройства для добавления в набор
            if (devices && devices.length > 0) {
                // Найти устройства по их идентификаторам
                const devicesToAdd = await Device.findAll({ where: { id: devices } });

                // Добавить устройства в набор
                await kit.addDevices(devicesToAdd);
            }

            return res.json(kit);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            // Найдите набор по его идентификатору
            const kit = await Kit.findByPk(id);
            if (!kit) {
                throw new Error('Набор не найден');
            }
            // Удалите набор
            await kit.destroy();
            return res.json({ message: 'Набор успешно удален' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res){
        const kits = await Kit.findAll()
        return res.json(kits)
    }
    // Метод для получения всех устройств в наборе по его идентификатору
    async getDevicesInKit(req, res, next) {
        try {
            const kitId = req.params.id;
            
            // Найти набор по его идентификатору
            const kit = await Kit.findByPk(kitId);

            if (!kit) {
                throw new Error('Набор не найден');
            }

            // Получить все устройства в наборе
            const devices = await kit.getDevices();

            return res.json(devices);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    // Раздел change

async update(req, res, next) {
    try {
        const { id } = req.params;
        const { typer, devices } = req.body;

        // Найти набор (Kit) по его идентификатору
        let kit = await Kit.findByPk(id);

        if (!kit) {
            throw new Error('Набор не найден');
        }

        // Обновить информацию о наборе
        if (typer) {
            kit.typer = typer;
            await kit.save();
        }

        // Если указаны устройства для обновления набора
        if (devices && devices.length > 0) {
            // Найти устройства по их идентификаторам
            const devicesToAdd = await Device.findAll({ where: { id: devices } });

            // Удалить текущие устройства из набора
            await kit.removeDevices();

            // Добавить устройства в набор
            await kit.addDevices(devicesToAdd);
        }

        return res.json(kit);
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

}
module.exports = new KitController()