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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statistiqueRouter_1 = require("./routes/statistiqueRouter");
const morgan_1 = __importDefault(require("morgan"));
const express_flash_plus_1 = __importDefault(require("express-flash-plus"));
const pointInteretRouter_1 = require("./routes/pointInteretRouter");
class App {
    constructor() {
        this.expressApp = (0, express_1.default)();
        // this.middleware() //  For middleware implementation
        this.middleware();
        this.routes(); // For routes implementation
        // Pug Engine
        this.expressApp.set("view engine", "pug");
        // Static files
        this.expressApp.use(express_1.default.static(__dirname + "/public"));
    }
    middleware() {
        this.expressApp.use((0, morgan_1.default)("dev"));
        this.expressApp.use(express_1.default.json());
        this.expressApp.use(express_1.default.urlencoded({ extended: false }));
        this.expressApp.use((0, express_flash_plus_1.default)());
    }
    routes() {
        const router = express_1.default.Router();
        // Home Page
        router.get("/", (req, res) => {
            res.render("index", { title: "Home" });
        });
        router.get("/statistique", (req, res) => __awaiter(this, void 0, void 0, function* () {
            let compteurData = yield statistiqueRouter_1.statRouter.controllerStats.getStatData();
            res.render("statistique", {
                title: "Statistique",
                listCompteurs: compteurData,
            });
        }));
        // Team Page
        router.get("/equipe", (req, res) => {
            res.render("equipe", {
                title: "Equipe 11",
            });
        });
        router.get("/a-propos", (req, res) => __awaiter(this, void 0, void 0, function* () {
            res.render("project", {
                title: "Le Projet - Mobilité Urbaine",
            });
        }));
        this.expressApp.use("/", router);
        this.expressApp.use("/statistique", statistiqueRouter_1.statRouter.router); // Pour tout autre operations avec la page statistique
        this.expressApp.use("/pointInteret", pointInteretRouter_1.PIRouter.router);
    }
}
exports.default = new App().expressApp;
//# sourceMappingURL=app.js.map