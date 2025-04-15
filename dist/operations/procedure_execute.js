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
exports.executeProcedure = void 0;
const sql = __importStar(require("mssql"));
const config_1 = require("./config");
require("colors");
/**
 * This function is used to execute the procedure in the database
 *
 * @param procedureName - The name of the procedure to be executed in the database
 * @param referance - The reference parameters to be executed in the database
 * @returns Promise<ProcedureResult> - The result of the procedure execution
 */
const executeProcedure = async (procedureName, referance = {}) => {
    return await new Promise((resolve) => {
        const request = new sql.Request();
        try {
            for (const key of Object.keys(referance)) {
                const value = referance[key];
                request.input(key, value);
            }
            request.execute(procedureName)
                .then(result => {
                resolve({ status: 200, message: 'Success', data: result?.recordset });
            })
                .catch(err => {
                if (config_1.config.get.logingMode()) {
                    console.log(`▲ easy-mssql / Procedure / ${procedureName} : ${err.message}`.yellow);
                    console.error(err);
                }
                resolve({ status: 500, message: 'Error', data: null });
            });
        }
        catch (err) {
            if (config_1.config.get.logingMode()) {
                console.log(`▲ easy-mssql / Procedure / ${procedureName} : ${err instanceof Error ? err.message : String(err)}`.yellow);
                console.error(err);
            }
            resolve({ status: 501, message: 'Error', data: null });
        }
    });
};
exports.executeProcedure = executeProcedure;
//# sourceMappingURL=procedure_execute.js.map