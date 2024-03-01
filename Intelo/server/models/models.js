const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Модель для таблицы "Пользователь"
const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true, },
    password: { type: DataTypes.STRING(100), allowNull: false },
    role: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "USER"},
});

// Модель для таблицы "Экосистема"
const Ecosystem = sequelize.define('ecosystem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false,unique: true, },
    voiceAssistant: {type:  DataTypes.STRING(100),  allowNull: true, },
    img: { type: DataTypes.TEXT, allowNull: true},
});

// Модель для таблицы "Экосистема_товара"
const EcosystemDevice = sequelize.define('ecosystem_Device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Модель для таблицы "Инструкция"
const Instruction = sequelize.define('instruction', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    link: { type: DataTypes.STRING(100), allowNull: false },
    type: { type: DataTypes.STRING(100), allowNull: false },
});

// Модель для таблицы "Набор"
const Kit = sequelize.define('kit', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    typer: { type: DataTypes.STRING(100), allowNull: false },
});

// Модель для таблицы "Товар_набор"
const DeviceKit = sequelize.define('device_kit', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Модель для таблицы "Товар"
const Device = sequelize.define('device', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vendorCode: { type: DataTypes.STRING(100), allowNull: false, unique: true, },
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true, },
    price:  {type: DataTypes.INTEGER, allowNull: false},
    img: { type: DataTypes.TEXT, allowNull: false },
});

// Модель для таблицы "Управление_товар"
const DeviceControl = sequelize.define('device_control', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

// Модель для таблицы "Управление"
const Control = sequelize.define('control', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    protocol: { type: DataTypes.STRING(100), allowNull: false },
});

// Модель для таблицы "Категория"
const Types = sequelize.define('type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
});

// Модель для таблицы "Товар_инфо"
const DeviceInfo = sequelize.define('device_infos', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
});

// Определение связей между моделями
User.hasMany(Kit);
Kit.belongsTo(User);

Ecosystem.belongsToMany(Device, { through: EcosystemDevice });
Device.belongsToMany(Ecosystem, { through: EcosystemDevice });

// Определение отношений между моделями
Device.belongsToMany(Kit, { through: DeviceKit });
Kit.belongsToMany(Device, { through: DeviceKit });

// Определение отношений между моделями
Device.belongsToMany(Control, { through: DeviceControl });
Control.belongsToMany(Device, { through: DeviceControl });

Types.hasMany(Device);
Device.belongsTo(Types);

Device.hasMany(Instruction);
Instruction.belongsTo(Device);

Device.hasMany(DeviceInfo, { as: 'info' });
DeviceInfo.belongsTo(Device);

module.exports = {
    User,
    Ecosystem,
    EcosystemDevice,
    Instruction,
    Kit,
    DeviceKit,
    Device,
    DeviceControl,
    Control,
    Types,
    DeviceInfo,
};
