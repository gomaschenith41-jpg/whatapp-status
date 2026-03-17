const API_KEY = 'AIzaSyBTDUosPUGMI6pFHXz_VDLFkv-BPI4_eKI'; 
const CHANNEL_HANDLE = '@spartworld'; 
const MAX_RESULTS = 20;

const videoGrid = document.getElementById('video-grid');
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const closeBtn = document.querySelector('.close-btn');

async function fetchVideos() {
    try {
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${API_KEY}`;
        const channelResponse = await fetch(channelUrl);
        const channelData = await channelResponse.json();

        if (channelData.error) throw new Error(channelData.error.message);

        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=${MAX_RESULTS}&playlistId=${uploadsPlaylistId}&key=${API_KEY}`;
        const playlistResponse = await fetch(playlistUrl);
        const playlistData = await playlistResponse.json();

        displayVideos(playlistData.items);
    } catch (error) {
        videoGrid.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
    }
}

function displayVideos(items) {
    videoGrid.innerHTML = '';
    items.forEach(item => {
        const videoId = item.contentDetails.videoId;
        const title = item.snippet.title;
        const thumbnail = item.snippet.thumbnails.high ? item.snippet.thumbnails.high.url : item.snippet.thumbnails.medium.url;

        const videoCard = document.createElement('div');
        videoCard.classList.add('video-card');
        videoCard.innerHTML = `
            <img src="${thumbnail}" alt="${title}">
            <h3>${title}</h3>
        `;
        // User ක්ලික් කළ විට වීඩියෝව විවෘත වේ
        videoCard.onclick = () => openVideo(videoId);
        videoGrid.appendChild(videoCard);
    });
}

function openVideo(videoId) {
    // 1. වත්මන් වෙබ් අඩවියේ Domain එක ලබා ගන්න (GitHub ලිපිනය)
    const origin = window.location.origin;

    // 2. Autoplay=1 සහ Mute=0 ලෙස ලබා දෙන්න. 
    // පරිශීලකයා thumbnail එක click කරන නිසා Browser එක autoplay වලට ඉඩ දෙයි.
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&origin=${origin}&enablejsapi=1`;
    
    videoPlayer.src = embedUrl;
    videoModal.style.display = "block";
}

closeBtn.onclick = () => {
    videoModal.style.display = "none";
    videoPlayer.src = ""; // Modal එක වසන විට වීඩියෝව නැවතීමට
}

window.onclick = (event) => {
    if (event.target == videoModal) {
        videoModal.style.display = "none";
        videoPlayer.src = "";
    }
}

fetchVideos();
