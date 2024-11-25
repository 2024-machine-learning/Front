const clientID = '1e936a3fe625405d88c5b7537637b97d';
const redirectURI = 'http://localhost:5500'; // 앱 설정에 등록한 값
const scope = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'streaming',
    'user-read-currently-playing'
].join(' ');

// OAuth 인증 URL 생성
const authURL = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectURI)}`;

let token;

// 인증 및 토큰 추출
function authenticate() {
    const hash = window.location.hash.substring(1);
    token = new URLSearchParams(hash).get('access_token');

    if (!token) {
        window.location.href = authURL; // 토큰이 없으면 인증 페이지로 리다이렉트
    } else {
        console.log('Access Token:', token);
        initSpotifyPlayer(); // 인증 성공 시 플레이어 초기화
    }
}

// Spotify Web Playback SDK 초기화
function initSpotifyPlayer() {
    window.onSpotifyWebPlaybackSDKReady = () => {
        const player = new Spotify.Player({
            name: 'Web Playback SDK',
            getOAuthToken: cb => cb(token),
            volume: 0.5,
        });

        // 이벤트 리스너
        player.addListener('ready', ({ device_id }) => {
            console.log('Device is ready:', device_id);
        });

        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device is not ready:', device_id);
        });

        player.addListener('player_state_changed', state => {
            console.log(state);
        });

        // 플레이어 연결
        player.connect();
    };
}

// 재생 제어 함수
function controlPlayback(action) {
    console.log('Player Button Click')
    const endpoint = action === 'play' 
        ? 'https://api.spotify.com/v1/me/player/play' 
        : 'https://api.spotify.com/v1/me/player/pause';

    fetch(endpoint, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
    }).catch(error => console.error(`${action} failed:`, error));
}

// 현재 재생 트랙 업데이트
function updateCurrentlyPlaying() {
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch currently playing');
            return response.json();
        })
        .then(data => {
            document.getElementById('track').textContent = data.item.name;
        })
        .catch(error => console.error('Error updating track:', error));
}

// 이벤트 등록
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('play').addEventListener('click', () => controlPlayback('play'));
    document.getElementById('pause').addEventListener('click', () => controlPlayback('pause'));
    setInterval(updateCurrentlyPlaying, 5000); // 5초마다 재생 트랙 업데이트
});

// 인증 및 초기화 시작
authenticate();
