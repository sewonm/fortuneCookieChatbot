const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI
});

// OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Redirect user to Spotify for authentication
app.get('/login', (req, res) => {
  const scopes = ['user-read-private', 'user-top-read'];
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

// Handle Spotify OAuth callback
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);
    res.redirect('/frontend/index.html'); // Redirect to frontend after login
  } catch (error) {
    res.status(400).send(error);
  }
});

// Chat route for handling user queries and OpenAI integration
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    // Fetch top artist from Spotify
    const topArtistsData = await spotifyApi.getMyTopArtists({ limit: 1 });
    const topArtist = topArtistsData.body.items[0].name;

    // Generate response using OpenAI
    const completion = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: `The user's top artist is ${topArtist}. User asked: ${message}`,
      max_tokens: 150
    });

    res.json({ reply: completion.data.choices[0].text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});