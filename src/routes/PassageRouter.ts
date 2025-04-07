import { NextFunction, Request, Response, Router } from "express";
import { PassageController } from "../controllers/PassageController";

export class PassageRouter {
  private _router: Router;
  private passageController: PassageController;

  constructor() {
    this._router = Router();
    this.passageController = new PassageController();
    this.init();
  }

  async readByIdAndDate(req: Request, res: Response, next: NextFunction) {
    try {
      const { compteurId } = req.params;
      const debut = req.query.debut as string;
      const fin = req.query.fin as string;
      const periode = req.query.periode as string;
      let compteurs = [];
      if (periode === "day") {
        compteurs = await this.passageController.readByCompteurIdAndGroupByDay(
          Number(compteurId),
          debut,
          fin
        );
      } else if (periode === "week") {
        compteurs = await this.passageController.readByCompteurIdAndGroupByWeek(
          Number(compteurId),
          debut,
          fin
        );
      } else {
        compteurs =
          await this.passageController.readByCompteurIdAndGroupByMonth(
            Number(compteurId),
            debut,
            fin
          );
      }

      res.status(201).json({ compteurs });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  get router() {
    return this._router;
  }

  init() {
    this._router.get("/compteurs/:compteurId", this.readByIdAndDate.bind(this));
  }
}

export const passageRouter = new PassageRouter();
