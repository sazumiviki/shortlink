const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const path = require('path');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const urlDatabase = {};

app.use(express.static(path.join(__dirname, 'public')));

app.post('/shorten', (req, res) => {
  let originalUrl = req.body.url;
  
  if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
    return res.status(400).json({ error: 'Please enter a valid URL with http:// or https://' });
  }

  if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
    originalUrl = 'http://' + originalUrl;
  }

  const shortId = shortid.generate();
  const shortUrl = `http://ink.sazumi.moe/${shortId}`;
  
  urlDatabase[shortId] = originalUrl;
  
  res.json({ shortLink: shortUrl });
});

app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const originalUrl = urlDatabase[shortId];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send('Link not found');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});