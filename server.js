const express = require('express');

const app = express();

app.use(express.static('./dist/handCup-project'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/handCup-project/'}),
);

app.listen(process.env.PORT || 8080);