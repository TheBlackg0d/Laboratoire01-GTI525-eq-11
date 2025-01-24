"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statRouter = exports.StatistiqueRouter = void 0;
const express_1 = require("express");
const statistiqueController_1 = __importDefault(require("../controllers/statistiqueController"));
class StatistiqueRouter {
    constructor() {
        this.statsController = new statistiqueController_1.default();
        this._router = (0, express_1.Router)();
        this.init();
    }
    getStatData(req, res, next) {
        try {
            const data = this.statsController.getStatData();
            res.render('index', {});
        }
        catch (err) {
            console.log("Error in getting Compteurs stats: ", err);
        }
    }
    get controllerStats() {
        return this.statsController;
    }
    get router() {
        return this._router;
    }
    init() {
        this._router.get('/data', this.getStatData.bind(this));
    }
}
exports.StatistiqueRouter = StatistiqueRouter;
exports.statRouter = new StatistiqueRouter();
exports.statRouter.init();
//# sourceMappingURL=statistiqueRouter.js.map