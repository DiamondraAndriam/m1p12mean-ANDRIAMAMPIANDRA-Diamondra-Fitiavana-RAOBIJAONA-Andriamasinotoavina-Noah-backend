const Reparation = require('../models/reparation.model');
const RendezVous = require('../models/rendezvous.model');

exports.getRevenusParMois = async (req, res) => {
    const { annee } = req.params; 
  
    if (!annee) {
      return res.status(400).json({ message: "L'année est requise" });
    }
  
    try {
      const revenusParMois = await Reparation.aggregate([
        {
          $match: {
            $expr: { $eq: [{ $year: "$createdAt" }, parseInt(annee)] }
          }
        },
        {
          $group: {
            _id: { $month: "$createdAt" }, 
            totalRevenu: { $sum: "$factureTotale" },
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
  
      const moisNom = [
        { mois: 1, nom: "Janvier" },
        { mois: 2, nom: "Février" },
        { mois: 3, nom: "Mars" },
        { mois: 4, nom: "Avril" },
        { mois: 5, nom: "Mai" },
        { mois: 6, nom: "Juin" },
        { mois: 7, nom: "Juillet" },
        { mois: 8, nom: "Août" },
        { mois: 9, nom: "Septembre" },
        { mois: 10, nom: "Octobre" },
        { mois: 11, nom: "Novembre" },
        { mois: 12, nom: "Décembre" }
      ];
  
      const result = moisNom.map(moisInfo => {
        const revenuMois = revenusParMois.find(item => item._id === moisInfo.mois);
        return {
          mois: moisInfo.mois,
          nom: moisInfo.nom,
          totalRevenu: revenuMois ? revenuMois.totalRevenu : 0,
        };
      });
  
      res.json(result);
    } catch (error) {
      console.error("Erreur récupération revenus par mois:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };  

exports.getRevenusParService = async (req, res) => {
    try {
      const revenusParService = await RendezVous.aggregate([
        {
          $lookup: {
            from: 'services',
            localField: 'serviceId',
            foreignField: '_id',
            as: 'serviceDetails'
          }
        },
        {
          $unwind: {
            path: '$serviceDetails', 
            preserveNullAndEmptyArrays: true 
          }
        },
        {
          $group: {
            _id: '$serviceDetails.nom', 
            totalRevenu: { $sum: '$serviceDetails.prix' }, 
            serviceName: { $first: '$serviceDetails.nom' } 
          }
        },
        {
          $sort: { totalRevenu: -1 }
        }
      ]);
  
      res.json(revenusParService);
    } catch (error) {
      console.error("Erreur récupération revenus par service:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };    
