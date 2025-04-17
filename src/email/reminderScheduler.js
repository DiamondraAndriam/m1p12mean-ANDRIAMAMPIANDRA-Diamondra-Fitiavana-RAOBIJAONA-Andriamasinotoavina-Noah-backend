/* eslint-disable no-undef */
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const rendezvousService = require('../services/rendezvous.service');
require('dotenv').config();

// Configuration du transporteur mail avec variables d’environnement
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false, // true si port 465, false sinon
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Tâche CRON : toutes les heures
cron.schedule('* * * * *', async () => {
  const rendezvousList = await rendezvousService.getRendezvousIn24h();

  for (let rdv of rendezvousList) {
    const client = rdv.clientId;
    rendezvousService.markReminderSent(rdv._id);

    if (client && client.email) {
      const mailOptions = {
        from: `"Garage App" <${process.env.SMTP_USER}>`,
        to: client.email,
        subject: '🔔 Rappel de votre rendez-vous',
        text: `
Bonjour ${client.nom || ''},

Ceci est un rappel pour votre rendez-vous prévu le ${rdv.start.toLocaleString()}.

Merci de votre confiance.

— MEKANIKA
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de rappel envoyé à ${client.email}`);
      } catch (error) {
        console.error(`❌ Erreur envoi email à ${client.email} :`, error.message);
      }
    }
  }
});