/* eslint-disable no-undef */
const nodemailer = require('nodemailer');
require('dotenv').config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('Erreur : EMAIL_USER ou EMAIL_PASS non définis.');
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
});

transporter.verify((error) => {
  if (error) {
    console.error('Problème avec le transporteur Nodemailer :', error);
  } else {
    console.log('Transporteur Nodemailer prêt à envoyer des emails');
  }
});

const envoyerConfirmation = async (req, res) => {
  const { email, nomClient, date, heure, service, mecanicien } = req.body;

  if (!email || !nomClient || !date || !heure || !service || !mecanicien) {
    return res.status(400).json({ message: 'Données manquantes' });
  }

  try {
    await transporter.sendMail({
      from: `"MEKANIKA" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🔧 Confirmation de votre rendez-vous',
      html: `
            <div style="text-align: center;">
            <img src="https://i.ibb.co/Z638LJvc/logo-grand.png" alt="Garage Auto" style="width: 150px; margin-bottom: 10px;">
            </div>
            <h2>Bonjour ${nomClient},</h2>
            <p>Votre rendez-vous a été confirmé :</p>
            <ul>
            <li><strong>📅 Date :</strong> ${date}</li>
            <li><strong>⏰ Heure :</strong> ${heure}</li>
            <li><strong>🛠️ Service :</strong> ${service}</li>
            <li><strong>👨‍🔧 Mécanicien :</strong> ${mecanicien}</li>
            </ul>
            <p>Merci pour votre confiance. 🚗💨</p>
        `,
    });

    console.log(`📧 Email envoyé à ${email}`);
    res.status(200).json({ message: '✅ Email envoyé avec succès' });
  } catch (error) {
    console.error('Erreur envoi email :', error);
    res.status(500).json({ message: 'Erreur lors de l’envoi de l’email' });
  }
};

module.exports = { envoyerConfirmation };