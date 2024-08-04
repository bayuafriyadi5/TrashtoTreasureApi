const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/midtrans-webhook', (req, res) => {
    const notification = req.body;
    // Process the notification here
    console.log(notification);
    res.status(200).send('Notification received');
});

app.listen(3000, () => console.log('Server running on port 3000'));
