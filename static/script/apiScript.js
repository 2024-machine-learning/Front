const clientID = '1e936a3fe625405d88c5b7537637b97d'; // Replace with your Spotify Client ID
const redirectURI = 'http://localhost:5500'; // Replace with your redirect URI
const scopes = [
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
].join(' ');

// Spotify Authentication URL
const authURL = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectURI)}`;

// Get token from URL
let token = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
if (!token) {
  window.location.href = authURL; // Redirect to Spotify authorization
}

let player;

// Initialize Spotify Web Playback SDK
window.onSpotifyWebPlaybackSDKReady = () => {
  player = new Spotify.Player({
    name: 'Spotify Web Player',
    getOAuthToken: cb => cb(token),
    volume: 0.5,
  });

  // Event: Player Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    document.getElementById('status').textContent = 'Player is ready!';
    transferPlayback(device_id);
  });

  // Event: Player not ready
  player.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID has gone offline', device_id);
    document.getElementById('status').textContent = 'Player is not ready!';
  });

  player.connect();
};

// Transfer playback to web player
function transferPlayback(device_id) {
  fetch('https://api.spotify.com/v1/me/player', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ device_ids: [device_id], play: false }),
  });
}

// Search and play a track
document.getElementById('searchAndPlay').addEventListener('click', () => {
  const trackName = document.getElementById('trackName').value;
  const artistName = document.getElementById('artistName').value;

  if (!trackName || !artistName) {
    document.getElementById('status').textContent = 'Please enter track and artist names.';
    return;
  }

  searchTrack(trackName, artistName)
    .then(trackId => playTrack(trackId))
    .catch(err => {
      console.error(err);
      document.getElementById('status').textContent = 'Failed to find or play track.';
    });
});

// Search for a track using Spotify API
function searchTrack(trackName, artistName) {
  const query = `track:${trackName} artist:${artistName}`;
  return fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      if (data.tracks.items.length > 0) {
        document.getElementById('Title').innerHTML = 'Title: '+data.tracks.items[0].name;
        document.getElementById('Artist').innerHTML = 'Artist: '+data.tracks.items[0].artists[0].name;
        document.getElementById('AlbumArt').setAttribute('src',data.tracks.items[0].album.images[0].url)
        return data.tracks.items[0].id;
      } else {
        throw new Error('Track not found');
      }
    });
}

// Play a track using Spotify API
function playTrack(trackId) {
  fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
  })
    .then(() => {
      document.getElementById('status').textContent = 'Playing track!';
    })
    .catch(err => {
      console.error(err);
      document.getElementById('status').textContent = 'Failed to play track.';
    });
}
