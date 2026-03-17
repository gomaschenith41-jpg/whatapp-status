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
// ඉහළ ඇති අනෙකුත් Variables එලෙසම තබන්න
let currentVideoUrl = ""; // Share කිරීමට අවශ්‍ය URL එක ගබඩා කිරීමට

const shareBtn = document.getElementById('shareBtn');

function openVideo(videoId) {
    const origin = window.location.origin;
    currentVideoUrl = `https://www.youtube.com/watch?v=${videoId}`; // මුල් වීඩියෝ ලින්ක් එක

    // controls=0 මගින් ප්ලේයර් එකේ බටන් සහ ලෝගෝ අවම කරයි
    // modestbranding=1 මගින් YouTube ලෝගෝ එක හැකිතාක් සඟවයි
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&origin=${origin}`;
    
    videoPlayer.src = embedUrl;
    videoModal.style.display = "block";
}

// Share කිරීමේ ක්‍රියාවලිය
shareBtn.onclick = () => {
    if (navigator.share) {
        // Mobile Phone වල Share Menu එක Open වේ
        navigator.share({
            title: 'Spart World Video',
            text: 'බලන්න මේ වීඩියෝ එක!',
            url: currentVideoUrl,
        }).catch((error) => console.log('Error sharing', error));
    } else {
        // Desktop වලදී WhatsApp Web හරහා Share වේ
        const whatsappUrl = `https://api.whatsapp.com/send?text=බලන්න මේ වීඩියෝ එක: ${currentVideoUrl}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Modal Close වන විට වීඩියෝව Stop කිරීමට අමතක කරන්න එපා
closeBtn.onclick = () => {
    videoModal.style.display = "none";
    videoPlayer.src = "";
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
