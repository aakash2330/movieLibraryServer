"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateDB = void 0;
const sequelize_1 = require("sequelize");
const seq_config_1 = require("../sequalizeConfig/seq.config");
const sequelize = new sequelize_1.Sequelize(seq_config_1.SEQUELIZE_CONFIG.database, seq_config_1.SEQUELIZE_CONFIG.username, seq_config_1.SEQUELIZE_CONFIG.password, {
    host: seq_config_1.SEQUELIZE_CONFIG.host,
    dialect: 'mysql',
});
function authenticateDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield sequelize.authenticate();
            console.log("connection established");
        }
        catch (error) {
            console.log("error");
        }
    });
}
exports.authenticateDB = authenticateDB;
authenticateDB();
exports.default = sequelize;
