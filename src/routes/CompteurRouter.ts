import { NextFunction, Request, Response, Router } from "express";
import { CompteurController } from "../controllers/CompteurController";

export class CompteurRouter {
  private _router: Router;
  private compteurController: CompteurController;

  constructor() {
    this._router = Router();
    this.compteurController = new CompteurController();
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
        compteurs = await this.compteurController.readByCompteurIdAndGroupByDay(
          Number(compteurId),
          debut,
          fin
        );
      } else if (periode === "week") {
        compteurs =
          await this.compteurController.readByCompteurIdAndGroupByWeek(
            Number(compteurId),
            debut,
            fin
          );
      } else {
        compteurs =
          await this.compteurController.readByCompteurIdAndGroupByMonth(
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

export const compteurRouter = new CompteurRouter();
