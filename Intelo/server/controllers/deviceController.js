const uuid = require('uuid')
const path = require('path');
const {Device, DeviceInfo, Ecosystem, Control, Kit, Instruction} = require('../models/models')
const ApiError = require('../error/ApiError');

class DeviceController {
    async create(req, res, next) {
        try {
            let { vendorCode, name, price, typeId, info, instruction, ecosystemId, kits, controls } = req.body;
            const { img } = req.files;
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            const device = await Device.create({ vendorCode, name, price, typeId, img: fileName });
        
            if (info) { 
                info = JSON.parse(info);
                info.forEach(i =>
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                );
            }
        
            if (instruction) { 
                instruction = JSON.parse(instruction);
                instruction.forEach(i =>
                    Instruction.create({
                        name: i.name,
                        link: i.link,
                        type: i.type,
                        deviceId: device.id
                    })
                );
            }
        
            if (ecosystemId) {
                const ecosystem = await Ecosystem.findByPk(ecosystemId);
                if (!ecosystem) {
                    throw new Error('Экосистема не найдена');
                }
                await device.addEcosystem(ecosystem);
            }
        
            // Если указаны наборы, добавляем устройство в них
            if (kits && kits.length > 0) {
                // Найти наборы по их идентификаторам
                const kitsToAdd = await Kit.findAll({ where: { id: kits } });
        
                // Добавить устройство в наборы
                await device.addKits(kitsToAdd);
            }
        
            // Если указаны управления, добавляем устройство к ним
            if (controls && controls.length > 0) {
                // Найти управления по их идентификаторам
                const controlsToAdd = await Control.findAll({ where: { id: controls } });
        
                // Добавить устройство к управлениям
                await device.addControls(controlsToAdd);
            }
        
            return res.status(200).json({ message: 'Устройство успешно создано' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
        

    async delete(req, res, next) {
        // try {
            const { id } = req.params;
            // Найдите устройство по его идентификатору
            const device = await Device.findByPk(id);
            if (!device) {
                throw new Error('Устройство не найдено');
            }
            // Удалите устройство
            await device.destroy();
            return res.json({ message: 'Устройство успешно удалено' });
        // } catch (e) {
        //     next(ApiError.badRequest(e.message));
        // }
    }

    async getAll(req, res) {
        let { typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let devices;
        if (!typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }
        if (typeId) {
            devices = await Device.findAndCountAll({where:{typeId}, limit, offset})
        }
        res.json(devices)
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const device = await Device.findOne({
                where: {id},
                include: [
                    {model: DeviceInfo, as: 'info'},
                    {model: Ecosystem} // Включаем связанную модель Ecosystem
                ]
            });
            return res.json(device);
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }
    
    
async update(req, res, next) {
    try {
        const { id } = req.params;
        let { vendorCode, name, price, typeId, info, instruction, ecosystemId, kits, controls } = req.body;
        const { img } = req.files;

        // Найти устройство (Device) по его идентификатору
        let device = await Device.findByPk(id);

        if (!device) {
            throw new Error('Устройство не найдено');
        }

        // Обновить информацию об устройстве
        if (vendorCode) {
            device.vendorCode = vendorCode;
        }
        if (name) {
            device.name = name;
        }
        if (price) {
            device.price = price;
        }
        if (typeId) {
            device.typeId = typeId;
        }

        // Обновить изображение устройства, если оно предоставлено
        if (img) {
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            device.img = fileName;
        }

        await device.save();

        // Обновить информацию о характеристиках устройства, если она предоставлена
        if (info) {
            info = JSON.parse(info);
            await DeviceInfo.destroy({ where: { deviceId: id } });
            info.forEach(i =>
                DeviceInfo.create({
                    title: i.title,
                    description: i.description,
                    deviceId: id
                })
            );
        }

        // Обновить информацию об инструкциях, если она предоставлена
        if (instruction) {
            instruction = JSON.parse(instruction);
            await Instruction.destroy({ where: { deviceId: id } });
            instruction.forEach(i =>
                Instruction.create({
                    name: i.name,
                    link: i.link,
                    type: i.type,
                    deviceId: id
                })
            );
        }

        // Обновить информацию об экосистеме, если она предоставлена
        if (ecosystemId) {
            const ecosystem = await Ecosystem.findByPk(ecosystemId);
            if (!ecosystem) {
                throw new Error('Экосистема не найдена');
            }
            await device.setEcosystem(ecosystem);
        }

        // Обновить информацию о наборах, если она предоставлена
        if (kits && kits.length > 0) {
            // Найти наборы по их идентификаторам
            const kitsToAdd = await Kit.findAll({ where: { id: kits } });

            // Обновить наборы устройства
            await device.setKits(kitsToAdd);
        }

        // Обновить информацию об управлениях, если она предоставлена
        if (controls && controls.length > 0) {
            // Найти управления по их идентификаторам
            const controlsToAdd = await Control.findAll({ where: { id: controls } });

            // Обновить управления устройства
            await device.setControls(controlsToAdd);
        }

        return res.json(device);
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

}

module.exports = new DeviceController()