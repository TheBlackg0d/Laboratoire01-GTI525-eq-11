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

  public get router() {
    return this._router;
  }

  async readAll(req: Request, res: Response, next: NextFunction) {
    const limit = req.query.limite as string;
    const page = req.query.page as string;
    const implentation = req.query.implantation as string;
    const nom = req.query.nom as string;
    const compteurs = await this.compteurController.readAllWithFilter(
      implentation,
      nom,
      Number(limit),
      Number(page)
    );
    return res.status(200).json({ compteurs });
  }

  async readById(req: Request, res: Response, next: NextFunction) {
    const compteur = await this.compteurController.findById(
      Number(req.params.id)
    );

    return res.status(200).json({ compteur });
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

  public init() {
    this._router.get("/compteurs", this.readAll.bind(this));
    this._router.get("/compteurs/:id", this.readById.bind(this));
    this._router.get(
      "/compteurs/:compteurId/passages",
      this.readByIdAndDate.bind(this)
    );
  }
}

export const compteurRouter = new CompteurRouter();
