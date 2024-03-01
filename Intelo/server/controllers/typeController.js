const{Types} = require('../models/models')
const ApiError = require('../error/ApiError')

class TypeController {
    async create(req, res) {
        try {
            const { name } = req.body;
            const type = await Types.create({ name });
            return res.json(type);
        } catch (error) {
            // Обработка ошибок, если они возникают
            console.error('Error creating type:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            // Найдите категорию по ее идентификатору
            const type = await Types.findByPk(id);
            if (!type) {
                throw new Error('Категория не найдена');
            }
            // Удалите категорию
            await type.destroy();
            return res.json({ message: 'Категория успешно удалена' });
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
    async getAll(req, res){ 
        const types = await Types.findAll()
        return res.json(types)
    }
    // Раздел change

async update(req, res, next) {
    try {
        const { id } = req.params;
        const { name } = req.body;

        // Найти тип (Type) по его идентификатору
        let type = await Types.findByPk(id);

        if (!type) {
            throw new Error('Тип не найден');
        }

        // Обновить информацию о типе
        if (name) {
            type.name = name;
            await type.save();
        }

        return res.json(type);
    } catch (e) {
        next(ApiError.badRequest(e.message));
    }
}

}

module.exports = new TypeController()