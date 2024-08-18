var mqtt = require('mqtt');

// Initialise le client MQTT
const client = mqtt.connect('mqtt://broker.hivemq.com', { 
    username: 'service_synchronisation_db',
    password: 'LTx^ESd!xiH9Wi'
});

// S'abonner au topic 'cesi_weather_simulator/measures'
client.on('connect', function () {
    console.log('Connecté');

    // Subscribe to topics
    client.subscribe('cesi_weather_simulator/measures', function (err) {
        if (err) {
            console.log('Failed to subscribe:', err);
        } else {
            console.log('Subscribed successfully to cesi_weather_simulator/measures');
        }
    });

    client.subscribe('test', function (err) {
        if (err) {
            console.log('Failed to subscribe:', err);
        } else {
            console.log('Subscribed successfully to cesi_weather_simulator');
        }
    });

});

client.on('error', function (error) {
    console.log('Connection error:', error);
});

client.on('message', function (topic, message) {
    // Appelé à chaque réception de message
    console.log('Message reçu:', topic, message.toString());
});
