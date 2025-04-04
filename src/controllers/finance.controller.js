const Reparation = require('../models/reparation.model');
const RendezVous = require('../models/rendezvous.model');

exports.getRevenusParMois = async (req, res) => {
    const { annee } = req.params; // Récupérer l'année depuis les paramètres
  
    if (!annee) {
      return res.status(400).json({ message: "L'année est requise" });
    }
  
    try {
      // Agrégation MongoDB pour récupérer les revenus par mois pour l'année donnée
      const revenusParMois = await Reparation.aggregate([
        {
          $match: {
            // Filtrer les réparations en fonction de l'année donnée
            $expr: { $eq: [{ $year: "$createdAt" }, parseInt(annee)] }
          }
        },
        {
          // Grouper par mois et calculer la somme des revenus
          $group: {
            _id: { $month: "$createdAt" }, // Groupement par mois
            totalRevenu: { $sum: "$factureTotale" }, // Somme des revenus
          }
        },
        {
          // Trier les mois de manière croissante
          $sort: { _id: 1 }
        }
      ]);
  
      // Tableau des mois avec leur équivalence (1: Janvier, 2: Février, ...)
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
  
      // Créer un tableau des mois de 1 à 12 avec les noms de mois et les revenus
      const result = moisNom.map(moisInfo => {
        // Chercher les revenus pour ce mois
        const revenuMois = revenusParMois.find(item => item._id === moisInfo.mois);
        return {
          mois: moisInfo.mois,
          nom: moisInfo.nom,
          totalRevenu: revenuMois ? revenuMois.totalRevenu : 0, // 0 si pas de revenu pour ce mois
        };
      });
  
      // Répondre avec les revenus par mois et leur nom
      res.json(result);
    } catch (error) {
      console.error("Erreur récupération revenus par mois:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };  

exports.getRevenusParService = async (req, res) => {
    try {
      const revenusParService = await RendezVous.aggregate([
        // Effectuer une jointure avec la collection 'Service' pour récupérer les informations du service
        {
          $lookup: {
            from: 'services', // Nom de la collection des services
            localField: 'serviceId', // Champ de référence dans 'Rendez-vous'
            foreignField: '_id', // Champ de correspondance dans 'Service'
            as: 'serviceDetails' // Le champ qui contiendra les informations jointes
          }
        },
        // Décomposer l'array 'serviceDetails' pour accéder aux informations du service
        {
          $unwind: {
            path: '$serviceDetails', // Décomposer l'array pour obtenir un seul objet
            preserveNullAndEmptyArrays: true // Conserver les résultats même si la jointure échoue
          }
        },
        // Calculer les revenus par service
        {
          $group: {
            _id: '$serviceDetails.nom_service', // Groupement par nom du service
            totalRevenu: { $sum: '$serviceDetails.prix' }, // Somme des prix pour chaque service
            serviceName: { $first: '$serviceDetails.nom_service' } // Extraire le nom du service
          }
        },
        // Optionnellement, trier les résultats par nom de service ou revenu
        {
          $sort: { totalRevenu: -1 } // Trier par revenu décroissant
        }
      ]);
  
      res.json(revenusParService);
    } catch (error) {
      console.error("Erreur récupération revenus par service:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };    
