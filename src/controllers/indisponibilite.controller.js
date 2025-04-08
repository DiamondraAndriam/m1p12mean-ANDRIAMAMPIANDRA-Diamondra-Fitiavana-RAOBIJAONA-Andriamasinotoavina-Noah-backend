const Ferier = require('../models/ferier.model');
const IndisponibiliteDate = require('../models/indisponibiliteDate.model');
const Service = require('../models/service.model');

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

