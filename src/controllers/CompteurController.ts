import Compteur from "../Models/Compteur";
import Passage from "../Models/Passage";
export class CompteurController {
  async readAll() {
    return Compteur.find();
  }

  async findById(id: number) {
    return Compteur.find({ ID: id });
  }

  async readAllWithFilter(
    implentation: string,
    nom: string,
    limit: number,
    page: number
  ) {
    const filter: any = {};
    if (implentation) {
      filter.Annee_implante = Number(implentation);
    }
    if (nom) {
      filter.Nom = { $regex: nom };
    }

    return Compteur.find(filter)
      .limit(limit)
      .skip((page - 1) * limit);
  }

  async readByCompteurIdAndGroupByDay(
    compteurId: number,
    debutDate: string,
    finDate: string
  ) {
    return Passage.aggregate([
      {
        $match: {
          compteurId,
          date: { $gte: new Date(debutDate), $lt: new Date(finDate) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalPassage: { $sum: "$passage" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async readByCompteurIdAndGroupByWeek(
    compteurId: number,
    debutDate: string,
    finDate: string
  ) {
    return Passage.aggregate([
      {
        $match: {
          compteurId,
          date: { $gte: new Date(debutDate), $lt: new Date(finDate) },
        },
      },
      {
        $group: {
          _id: { $week: "$date" },
          totalPassage: { $sum: "$passage" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async readByCompteurIdAndGroupByMonth(
    compteurId: number,
    debutDate: string,
    finDate: string
  ) {
    return Passage.aggregate([
      {
        $match: {
          compteurId,
          date: { $gte: new Date(debutDate), $lt: new Date(finDate) },
        },
      },
      {
        $group: {
          _id: { $month: "$date" },
          totalPassage: { $sum: "$passage" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}
