import { Request, Response, NextFunction, Router } from "express";
import StatistiqueController from "../controllers/statistiqueController";

export class StatistiqueRouter {
  private _router: Router;
  private statsController: StatistiqueController;

  constructor() {
    this.statsController = new StatistiqueController();
    this._router = Router();
    this.init();
  }

  public getStatData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = this.statsController.getStatData();
      res.render("index", {});
    } catch (err) {
      console.log("Error in getting Compteurs stats: ", err);
    }
  }

  public async getJsonStatData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await this.statsController.getStatData();
      console.log(data);
      res.json(data);
    } catch (err) {
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
    this._router.get("/data", this.getStatData.bind(this));
    this._router.get("/dataJson", this.getJsonStatData.bind(this));
  }
}

export const statRouter = new StatistiqueRouter();
statRouter.init();
