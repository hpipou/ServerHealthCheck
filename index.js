const fs = require('fs');
const axios = require('axios');
const moment = require('moment');

// On va tester sur GOOGLE :p
const serverURL = 'https://www.google.com'; 

// Fichier texte ou seront stocker les logs
const logFilePath = 'logs.txt'; 

async function checkServerHealth() {
  try {
    const response = await axios.get(serverURL);

    if (response.status === 200) {
      const logMessage = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] ONLINE.\n`;
      saveLog(logMessage);
    } else {
      const logMessage = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] Le serveur a retourné une réponse inattendue.\n`;
      saveLog(logMessage);
    }
  } catch (error) {
    const logMessage = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] OFFLINE.\n`;
    saveLog(logMessage);
  }
}

function saveLog(logMessage) {
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Erreur lors de la sauvegarde du log :', err);
    }
  });
}

// Exécute la vérification de la santé du serveur toutes les 5 secondes
setInterval(checkServerHealth, 5000);
