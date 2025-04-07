import { NextFunction, Request, Response, Router } from "express";
import TerritoireController from "../controllers/TerritoireController";
import { TRouter } from "./TerritoireRouter";
import { passageRouter } from "./PassageRouter";
import { compteurRouter } from "./CompteurRouter";
import { PIRouter } from "./pointInteretRouter";
import { IRouter } from "./itineraireRouter";
export class ApiRouter {
  private _router: Router;
  private territoireController: TerritoireController;

  constructor() {
    this.territoireController = new TerritoireController();
    this._router = Router();
    this.init();
  }

  get router() {
    return this._router;
  }

  init() {
    // this._router.get("/", this.getStatData.bind(this));
    this._router.use("/v1/", TRouter.router);
    this._router.use("/v1/", compteurRouter.router);
    this._router.use("/v1/", PIRouter.router);
    this._router.use("/v1/", IRouter.router);
    this._router.get("/v1/", passageRouter.router);
  }
}
export const apiRouter = new ApiRouter();
