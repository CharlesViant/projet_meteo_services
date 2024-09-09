const mqtt = require('mqtt');
const axios = require('axios');

// Initialise le client MQTT
const client = mqtt.connect('mqtt://broker.hivemq.com', { 
    username: 'service_synchronisation_db',
    password: 'LTx^ESd!xiH9Wi'
});

client.on('connect', function () {
    console.log('Connecté');

    // S'abonner au topic 'cesi_weather_simulator/measures'
    client.subscribe('cesi_weather_simulator/measures', function (err) {
        if (err) {
            console.log('Failed to subscribe:', err);
        } else {
            console.log('Subscribed successfully to cesi_weather_simulator/measures');
        }
    });

});

client.on('error', function (error) {
    console.log('Connection error:', error);
});

client.on('message', function (topic, message) {
    console.log('Message reçu:', topic, message.toString());

    // Parse le message reçu
    try {
        const data = JSON.parse(message.toString());
        console.log(data);
        // Vérifie si les données contiennent les champs requis
        if (data.mac_address && data.measures && Array.isArray(data.measures)) {
            // Construire le jeu de mesure
            const measures = data.measures.map(measure => ({
                valeur: measure.valeur,
                label: measure.label
            }));

            // URL de l'API avec l'adresse MAC dynamique
            const url = `https://backend.cv-dev.ovh/sensor/${data.mac_address}/mesures`;

            // Envoie les données à l'API
            axios.post(url, measures)
                .then(response => {
                    console.log('Données envoyées avec succès:', response.data);
                })
                .catch(error => {
                    console.error('Erreur lors de l\'envoi des données:', error);
                });
        } else {
            console.error('Les données reçues ne contiennent pas tous les champs requis.');
        }
    } catch (error) {
        console.error('Erreur lors du parsing du message:', error);
    }
});
