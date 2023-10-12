"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
class MOVIE extends sequelize_1.Model {
}
MOVIE.init({
    movieName: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        primaryKey: true,
    },
    duration: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    rating: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        unique: false,
    },
}, {
    tableName: 'movie_list',
    sequelize: index_1.default,
    timestamps: false
});
exports.default = MOVIE;
