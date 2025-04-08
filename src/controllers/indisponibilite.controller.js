const Ferier = require('../models/ferier.model');
const Indisponibilite = require('../models/indisponibilite.model');
const IndisponibiliteDate = require('../models/indisponibiliteDate.model');
const Service = require('../models/service.model');
const RendezVous = require('../models/rendezvous.model');
const HeureTravail = require('../models/heureTravail.model');
const User = require('../models/user.model');

exports.getDisponibiliteMois = async (req, res) => {
    const { serviceId, month, year } = req.body;
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    // check if the parameters are valid
    if (
        isNaN(yearNum) || isNaN(monthNum) ||
        monthNum < 1 || monthNum > 12
      ) {
        console.log("Paramètres invalides:", { month, year });
        return res.status(400).json({ error: 'Paramètres invalides' });
    }

    // check if the serviceId is valid
    const service = await Service.findById(serviceId);
    if (!service) {
        console.log("Service non trouvé:", serviceId);
        return res.status(404).json({ error: 'Service non trouvé' });
    }

    try {
        const startDate = new Date(yearNum, monthNum - 1, 1, 0, 0, 0); // 1er jour du mois
        const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59); // Dernier jour du mois

        const indisponibilite = await IndisponibiliteDate.find({
            service: serviceId,
            date: { $gte: startDate , $lte: endDate }
        });
        
        const joursFeries = await Ferier.find({
            date: { $gte: startDate, $lte: endDate }
        });
        
        const ferier = joursFeries.map(ferier => ferier.date.toISOString().split('T')[0]);
        const indisponibiliteDates = indisponibilite.map(indispo => indispo.date.toISOString().split('T')[0]);
        const indisponibiliteDatesSet = new Set(indisponibiliteDates.concat(ferier));

        return res.json(Array.from(indisponibiliteDatesSet));
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
}

async function getMecanoDisponbles(service, heureDebut){
    const heureFin = new Date(heureDebut.getTime() + service.duree * 60 * 1000); // Ajout de la durée du service à l'heure de début

    // Mécano occupés
    const mecanoOccupes = await RendezVous.find({
        datedebut: { $lt: heureFin },
        datefin: { $gt: heureDebut }
        }).distinct('mecanicienId');

    // Mécano disponibles
    const mecanicien = await User.find({ 
        role: 'mecanicien',
        _id: { $nin: mecanoOccupes },
        'typeMecanicien': service.typeMecanicien
    });
    
    return mecanicien;
}

// ✅ Récupérer les mécaniciens disponibles pour un service donné
exports.getMecanicienDisponibilite = async (req, res) => {
    const { serviceId, date, heureDebut} = req.params;
    try {
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: "Service non trouvé" });
        }
 
        const mecanicien = await getMecanoDisponbles(service, new Date(date + 'T' + heureDebut));
        if (mecanicien.length === 0) {
            return res.status(404).json({ message: "Aucun mécanicien disponible" });
        }

        const data = mecanicien.map(m => ({
            _id: m._id,
            nom: m.firstName,
            prenom: m.lastName
        })); 

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
}

async function getHoraire(date) {
    const heureTravail = await HeureTravail.findOne();
    if (!heureTravail) {
        return null;
    }
    const ouverture = new Date(date.getFullYear(), date.getMonth(), date.getDate(), heureTravail.debut.split(':')[0], heureTravail.debut.split(':')[1]);
    const fermeture = new Date(date.getFullYear(), date.getMonth(), date.getDate(), heureTravail.fin.split(':')[0], heureTravail.fin.split(':')[1]); 

    return { ouverture, fermeture };
}

async function getIndisponibilite(ouverture, fermeture, serviceId) {    
    const indisponibilites = await Indisponibilite.find({
        service: serviceId,
        debut: { $gte: ouverture, $lte: fermeture },
        fin: { $gte: ouverture, $lte: fermeture }
    });

    return { ouverture, fermeture, indisponibilites };
}

function trouverPlagesLibres(ouverture, fermeture, indisponibilites, duree) {
    const plagesLibres = [];

    if (indisponibilites.length === 0) {
        return [{ debut: ouverture, fin: fermeture }];
    }
    // 1. Trier les RDVs
    const rdvsTries = indisponibilites.sort((a, b) => a.debut - b.debut);

    let currentTime = ouverture;

    for (const rdv of rdvsTries) {
        if (rdv.datedebut > currentTime) {
        const plage = {
            debut: currentTime,
            fin: rdv.debut
        };

        if (plage.fin - plage.debut >= duree) {
            plagesLibres.push(plage);
        }
        }
        currentTime = new Date(Math.max(currentTime, rdv.fin));
    }

    // 2. Plage après le dernier RDV
    if (currentTime < fermeture) {
        const plage = { debut: currentTime, fin: fermeture };
        if (plage.fin - plage.debut >= duree) {
        plagesLibres.push(plage);
        }
    }

    return plagesLibres;
}

exports.updateDisponibilite = async(rdv) => {
    const { serviceId, start } = rdv;
    const service = await Service.findById(serviceId);
    if (!service) {
        return null;
    }

    const mecaniciens = getMecanoDisponbles(service, start);

    if (!mecaniciens || mecaniciens.length === 0) {
        // ajout des indisponibilités
        const services = await Service.find({ typeMecanicien: service.typeMecanicien });
        if (services.length === 0) {
            return null;
        }
        // Récupérer les heures de travail
        const {ouverture, fermeture} = await getHoraire(start);
        if (!ouverture || !fermeture) {
            return null;
        }

        for (const service of services) {
            const indisponibilite = new Indisponibilite({
                service: service._id,
                debut: start,
                fin: start + service.duree*60*1000 
            });
        
            const listIndisponibilites = await getIndisponibilite(ouverture, fermeture, service._id);
            const indisponibilites = listIndisponibilites.concat(indisponibilite);
            
            const plagesLibres = trouverPlagesLibres(
                ouverture,
                fermeture,
                indisponibilites,
                service.duree * 60 * 1000 // Durée du service en millisecondes
            );

            if(plagesLibres.length === 0) {
                // supprimer les indisponibilités horaires de cette journée
                for (const indispo of indisponibilites) {
                    await Indisponibilite.delete({ _id: indispo._id });
                }
                // ajouter l'indisponibilité entière pour cette journée
                let indisponibiliteDate = new IndisponibiliteDate({
                    date: start,
                    service: service._id
                });

                indisponibiliteDate = await indisponibiliteDate.save();
            } else {
            // check si un créneau est dispo cette journée pour ce service et d'autres services 
                await indisponibilite.save();
            }
        }
    }
};

exports.heureDispo = async (serviceId, date) => {
    try {
        // Vérifier si la date est valide
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return null;
        }
        
        // Vérifier si le serviceId est valide
        const service = await Service.findById(serviceId);
        if (!service) {
            return null;
        }

        // Récupérer les heures de travail
        const { ouverture, fermeture} = await getHoraire(dateObj);
        if (!ouverture || !fermeture) {
            return null;
        }

        const { indisponibilites } = await getIndisponibilite(ouverture, fermeture, serviceId);
        if (!indisponibilites) {
            return {
                debut: ouverture,
                fin: fermeture
            };
        }
        
        const heureDispo = trouverPlagesLibres(
            ouverture,
            fermeture,
            indisponibilites,
            service.duree * 60 * 1000 // Durée du service en millisecondes
        );

        return heureDispo;
    } catch (error) {
        console.log("Erreur serveur", error);
    }
}

exports.getHeureDispo = async (req, res) => {
    const { serviceId, date } = req.body;
    try {
        const heureDispo = heureDispo(serviceId, date);

        if (heureDispo.length === 0) {
            return res.status(404).json({ message: "Aucune heure disponible pour cette date" });
        }
        res.json(heureDispo);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
}