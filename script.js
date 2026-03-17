const API_KEY = 'AIzaSyBTDUosPUGMI6pFHXz_VDLFkv-BPI4_eKI'; // ඔබේ API Key එක මෙතැනට දමන්න
const CHANNEL_HANDLE = '@spartworld'; // ඔබට අවශ්‍ය චැනල් එකේ Handle එක
const MAX_RESULTS = 20;

const videoGrid = document.getElementById('video-grid');
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const closeBtn = document.querySelector('.close-btn');

async function fetchVideos() {
    try {
        // පියවර 1: Handle එක භාවිතා කර චැනල් එකේ Upload Playlist ID එක ලබා ගැනීම
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${CHANNEL_HANDLE}&key=${API_KEY}`;
        const channelResponse = await fetch(channelUrl);
        const channelData = await channelResponse.json();

        if (channelData.error) {
            throw new Error(channelData.error.message);
        }

        if (!channelData.items || channelData.items.length === 0) {
            videoGrid.innerHTML = "<p style='color:yellow;'>චැනල් එක හමු වූයේ නැත. Handle එක (@spartworld) නිවැරදි දැයි බලන්න.</p>";
            return;
        }

        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        // පියවර 2: ලබාගත් Playlist ID එක භාවිතා කර වීඩියෝ 20 ලබා ගැනීම
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=${MAX_RESULTS}&playlistId=${uploadsPlaylistId}&key=${API_KEY}`;
        const playlistResponse = await fetch(playlistUrl);
        const playlistData = await playlistResponse.json();

        if (playlistData.items && playlistData.items.length > 0) {
            displayVideos(playlistData.items);
        } else {
            videoGrid.innerHTML = "<p>මෙම චැනල් එකේ වීඩියෝ කිසිවක් නැත.</p>";
        }

    } catch (error) {
        console.error("Error:", error);
        videoGrid.innerHTML = `<p style="color:red;">දෝෂයක් සිදු විය: ${error.message}</p>`;
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
        videoCard.onclick = () => openVideo(videoId);
        videoGrid.appendChild(videoCard);
    });
}

function openVideo(videoId) {
    // වීඩියෝව ප්ලේ වන වත්මන් වෙබ් අඩවියේ ලිපිනය (Domain) ලබා ගැනීම
    const origin = window.location.origin;

    // Error 153 මඟහරවා ගැනීමට origin සහ enablejsapi පරාමිතීන් එකතු කිරීම
    videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&origin=${origin}&enablejsapi=1`;
    
    videoModal.style.display = "block";
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