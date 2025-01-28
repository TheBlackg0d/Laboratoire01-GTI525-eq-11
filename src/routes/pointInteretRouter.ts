import { Request, Response, NextFunction, Router } from "express";
import PointInteretController from "../controllers/PointInteretController";

export class PointInteretRouter {
  private _router: Router;
  private pointInteretController: PointInteretController;

  constructor() {
    this.pointInteretController = new PointInteretController();
    this._router = Router();
    this.init();
  }

  public async getStatData(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.pointInteretController.getStatData();

      const uniqueArrondissements = [
        ...new Set(data.map((item) => item.Arrondissement)),
      ];

      res.render("pointInteret", {
        title: "Point d'interet",
        listFontaines: data,
        uniqueArrondissements,
      });
    } catch (err) {
      console.log("Error in getting Compteurs stats: ", err);
    }
  }

  get controllerPointInteret() {
    return this.pointInteretController;
  }

  get router() {
    return this._router;
  }

  init() {
    this._router.get("/", this.getStatData.bind(this));
  }
}

export const PIRouter = new PointInteretRouter();
PIRouter.init();
