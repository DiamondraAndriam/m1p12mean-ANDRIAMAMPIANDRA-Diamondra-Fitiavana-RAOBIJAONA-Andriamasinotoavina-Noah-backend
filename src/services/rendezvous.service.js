const Rendezvous = require('../models/rendezvous.model');

exports.getRendezvousIn24h = async () => {
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const oneHour = 60 * 60 * 1000;

  return await Rendezvous.find({
    start: {
      $gte: new Date(in24h.getTime() - oneHour),
      $lte: new Date(in24h.getTime() + oneHour),
    },
    reminderSent: false, 
  }).populate('clientId');
};
  
  exports.markReminderSent = async (id) => {
    await Rendezvous.findByIdAndUpdate(id, { reminderSent: true });
  };
  