const API_KEY = 'AIzaSyBTDUosPUGMI6pFHXz_VDLFkv-BPI4_eKI'; 
const CHANNEL_HANDLE = '@doctor_eefx'; // නව චැනලය
const MAX_RESULTS = 20;

let currentVideoUrl = "";
const videoGrid = document.getElementById('video-grid');
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const closeBtn = document.querySelector('.close-btn');
const shareBtn = document.getElementById('shareBtn');

async function fetchVideos() {
    try {
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${API_KEY}`;
        const channelResponse = await fetch(channelUrl);
        const channelData = await channelResponse.json();

        if (!channelData.items) throw new Error("Channel not found");

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
        const thumbnail = item.snippet.thumbnails.high.url;

        const videoCard = document.createElement('div');
        videoCard.classList.add('video-card');
        videoCard.innerHTML = `
            <img src="${thumbnail}" alt="${title}">
            <h3>${title}</h3>
        `;
        videoCard.onclick = () => openVideo(videoId);
        videoGrid.appendChild(videoCard);
    });
}

function openVideo(videoId) {
    const origin = window.location.origin;
    currentVideoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // පිරිසිදු පෙනුම සඳහා controls=0 සහ modestbranding=1 භාවිතා කර ඇත
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&origin=${origin}&enablejsapi=1`;
    
    videoPlayer.src = embedUrl;
    videoModal.style.display = "block";
}

shareBtn.onclick = () => {
    const shareText = `බලන්න මේ වීඩියෝ එක: ${currentVideoUrl}`;
    if (navigator.share) {
        navigator.share({ title: 'Doctor EEFX', text: shareText, url: currentVideoUrl });
    } else {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    }
}

closeBtn.onclick = () => {
    videoModal.style.display = "none";
    videoPlayer.src = "";
}

window.onclick = (event) => {
    if (event.target == videoModal) {
        videoModal.style.display = "none";
        videoPlayer.src = "";
    }
}

fetchVideos();
