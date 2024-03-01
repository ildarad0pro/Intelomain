const uuid = require('uuid')
const path = require('path');
const {Ecosystem, Types} = require('../models/models')
const ApiError = require('../error/ApiError');

class EcosystemController {
  
        async create(req, res, next) {
            try {
                let {name, voiceAssistant, EcosystemDeviceId} = req.body;
                const {img} = req.files;
                let fileName = uuid.v4() + ".jpg";
                img.mv(path.resolve(__dirname, '..', 'static', fileName));
    
                // Создаем экосистему
                const ecosystem = await Ecosystem.create({name, voiceAssistant, img: fileName});
                return res.json(ecosystem);
            } catch (e) {
                next(ApiError.badRequest(e.message));
            }
        }

        
        async delete(req, res, next) {
            try {
                const { id } = req.params;
                // Найдите экосистему по ее идентификатору
                const ecosystem = await Ecosystem.findByPk(id);
                if (!ecosystem) {
                    throw new Error('Экосистема не найдена');
                }
                // Удалите экосистему
                await ecosystem.destroy();
                return res.json({ message: 'Экосистема успешно удалена' });
            } catch (e) {
                next(ApiError.badRequest(e.message));
            }
        }

        async getAll(req, res){
            try {
                const ecosystems = await Ecosystem.findAll();
                return res.json(ecosystems);
            } catch (error) {
                next(ApiError.internalServerError(error.message));
            }
        }
        

        // Метод для получения всех устройств в определенной экосистеме по ее идентификатору
    async getDevicesInEcosystem(req, res, next) {
        try {
            const ecosystemId = req.params.id;

            // Найти экосистему по ее идентификатору
            const ecosystem = await Ecosystem.findByPk(ecosystemId);

            if (!ecosystem) {
                throw new Error('Экосистема не найдена');
            }

            // Получить все устройства в экосистеме
            const devices = await ecosystem.getDevices();

            return res.json(devices);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res) {
        const {id} = req.params
        const ecosystem = await Ecosystem.findOne(
            {
                where: {id}
            },
        )
        return res.json(ecosystem)
    }
    // Раздел change

async update(req, res, next) {
    try {
        const { id } = req.params;
        let { name, voiceAssistant } = req.body;
        const { img } = req.files;

        // Найти экосистему (Ecosystem) по ее идентификатору
        let ecosystem = await Ecosystem.findByPk(id);

        if (!ecosystem) {
            throw new Error('Экосистема не найдена');
        }

        // Обновить информацию об экосистеме
        if (name) {
            ecosystem.name = name;
        }
        if (voiceAssistant) {
            ecosystem.voiceAssistant = voiceAssistant;
        }

        // Обновить изображение экосистемы, если оно предоставлено
        if (img) {
            let fileName = uuid.v4() + ".jpg";
            img.mv(path.resolve(__dirname, '..', 'static', fileName));
            ecosystem.img = fileName;
        }

        await ecosystem.save();

        return res.json(ecosystem);
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

}

module.exports = new EcosystemController()