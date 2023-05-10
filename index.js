const fs = require('fs');
const axios = require('axios');
const moment = require('moment');
const nodemailer = require('nodemailer');

// On va tester sur GOOGLE :p
const serverURL = 'https://www.google.com'; 

// Fichier texte ou seront stocker les logs
const logFilePath = 'logs.txt'; 

// Configurer le transporteur de messagerie avec Outlook
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '------------@gmail.com', // Adresse e-mail de l'expéditeur
    pass: '------------', // Mot de passe de l'expéditeur
  },
});

async function checkServerHealth() {
  try {
    const response = await axios.get(serverURL);

    if (response.status === 200) {
      const logMessage = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ONLINE.\n`;
      saveLog(logMessage);
    } else {
      const logMessage = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] Le serveur a retourné une réponse inattendue.\n`;
      saveLog(logMessage);
      sendNotificationEmail(logMessage);
    }
  } catch (error) {
    const logMessage = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] OFFLINE.\n`;
    saveLog(logMessage);
    sendNotificationEmail(logMessage);
  }
}

function saveLog(logMessage) {
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Erreur lors de la sauvegarde du log :', err);
    }
  });
}

function sendNotificationEmail(message) {
  const mailOptions = {
    from: '-------@gmail.com', // Adresse e-mail de l'expéditeur
    to: '---------@gmail.com', // Adresse e-mail du destinataire
    subject: 'Alerte de surveillance de serveur', // Sujet de l'e-mail
    text: message, // Corps du message de l'e-mail
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
    } else {
      console.log('E-mail envoyé avec succès :', info.response);
    }
  });
}

// Exécute la vérification de la santé du serveur toutes les 5 secondes
setInterval(checkServerHealth, 5000);
