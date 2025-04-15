"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToServer = void 0;
const sql = __importStar(require("mssql"));
const config_1 = require("./config");
require("colors");
/**
 * This function is used to connect to the database.
 *
 * @param sqlConfig - The SQL configuration to connect to the database
 * @param run - Optional callback function to be executed after the connection is established
 * @returns Promise<boolean> - Returns true if connection is successful, false otherwise
 */
const connectToServer = async (sqlConfig, run) => {
    if (!sqlConfig || typeof sqlConfig !== 'object') {
        if (config_1.config.get.logingMode())
            console.log(`▲ easy-mssql / Connection / The sqlConfig parameter is not an object.`.yellow);
        return false;
    }
    const required = { user: "string", password: "string", server: "string", database: "string" };
    for (const key in required) {
        if (!sqlConfig[key] || typeof sqlConfig[key] !== required[key]) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Connection / The ${key} parameter is not a ${required[key]}.`.yellow);
            return false;
        }
    }
    if (!sqlConfig.options || !sqlConfig.options?.encrypt || typeof sqlConfig.options !== 'object' || typeof sqlConfig.options?.encrypt !== 'boolean') {
        sqlConfig.options = { ...sqlConfig.options, encrypt: false };
    }
    const maxRetries = 3;
    const retryInterval = 2500; // 2.5 seconds in milliseconds
    let retryCount = 0;
    const tryConnect = async () => {
        try {
            return await new Promise((resolve) => {
                sql.connect(sqlConfig, (err) => {
                    if (run && typeof run === 'function') {
                        run(sqlConfig, err);
                        return;
                    }
                    if (err) {
                        if (config_1.config.get.logingMode())
                            console.log(`▲ easy-mssql / Connection / Attempt ${retryCount + 1}: ${err.message}`.yellow);
                        resolve(false);
                    }
                    else {
                        if (config_1.config.get.logingMode())
                            console.log(`▲ easy-mssql / Connection / Success`.yellow);
                        resolve(true);
                    }
                });
            });
        }
        catch (err) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Connection / Attempt ${retryCount + 1}: ${err instanceof Error ? err.message : String(err)}`.yellow);
            if (run && typeof run === 'function') {
                run(sqlConfig, err instanceof Error ? err : new Error(String(err)));
                return false;
            }
            return false;
        }
    };
    while (retryCount < maxRetries) {
        const result = await tryConnect();
        if (result)
            return true;
        retryCount++;
        if (retryCount < maxRetries) {
            if (config_1.config.get.logingMode())
                console.log(`▲ easy-mssql / Connection / Retrying in 2.5 seconds... (Attempt ${retryCount + 1}/${maxRetries})`.yellow);
            await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
    }
    if (config_1.config.get.logingMode())
        console.log(`▲ easy-mssql / Connection / Failed after ${maxRetries} attempts`.yellow);
    return false;
};
exports.connectToServer = connectToServer;
//# sourceMappingURL=connect_to_server.js.map