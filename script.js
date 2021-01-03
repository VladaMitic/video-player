const player = document.querySelector('.player');
const video = document.querySelector('.video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const fullScreenBtn = document.querySelector('.fullscreen');
const speed = document.querySelector('.player-speed');

// Play & Pause ----------------------------------- //
function showPlayBtn() {
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
}

function togglePlay() {
    if (video.paused) {
        video.play();
        playBtn.classList.replace('fa-play', 'fa-pause');
        playBtn.setAttribute('title', 'Pause');
    } else {
        video.pause();
        showPlayBtn();
    }
}
//on video endes show play button
video.addEventListener('ended', showPlayBtn);

// Progress Bar ---------------------------------- //
//calculate dislay time format in minutes
function displayTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds > 9 ? seconds : `0${seconds}`; //adding 0  if seconds is less than 10
    return `${minutes}:${seconds}`;
}

//update progres bar as video playes
function updateProgress() {
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
    currentTime.textContent = `${displayTime(video.currentTime)} /`;
    displayTime.textContent = `${displayTime(video.duration)}`;
}

//click to seek within the video
function setProgress(e) {
    const newTime = e.offsetX / progressRange.offsetWidth;
    progressBar.style.width = `${newTime * 100}%`;
    video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //
//global variable that enable saving of volume that can be restored on unmute. It is by difolt set to 100%
let lastVolume = 1

//Volume bar
function changeVolume(e) {
    let volume = e.offsetX / volumeRange.offsetWidth;
    //roundting volume up or down if it is near 0 or near 100%
    if (volume < 0.1) {
        volume = 0;
    };
    if (volume > 0.9) {
        volume = 1;
    };
    //seting progress bar depending on place that is clicked
    volumeBar.style.width = `${volume * 100}%`;
    //seting volume properti of the audio depending on calculated valuo based on place clicked
    video.volume = volume;
    //change icon depending on volume
    volumeIcon.className = '';
    if (volume > 0.7) {
        volumeIcon.classList.add('fas', 'fa-volume-up');
    } else if (volume <= 0.7 && volume > 0) {
        volumeIcon.classList.add('fas', 'fa-volume-down');
    } else if (volume === 0) {
        volumeIcon.classList.add('fas', 'fa-volume-off');
    };
    lastVolume = volume;
}

//Mute/unmute
function toggleMute() {
    volumeIcon.className = '';
    if (video.volume) {
        lastVolume = video.volume;
        video.volume = 0;
        volumeBar.style.width = 0;
        volumeIcon.classList.add('fas', 'fa-volume-mute');
        volumeIcon.setAttribute('title', 'Unmute');
    } else {
        video.volume = lastVolume;
        volumeBar.style.width = `${lastVolume * 100}%`;
        if (lastVolume > 0.7) {
            volumeIcon.classList.add('fas', 'fa-volume-up');
        } else if (lastVolume <= 0.7 && lastVolume > 0) {
            volumeIcon.classList.add('fas', 'fa-volume-down');
        } else if (lastVolume === 0) {
            volumeIcon.classList.add('fas', 'fa-volume-off');
        };
        volumeIcon.setAttribute('title', 'Mute');
    }
}

// Change Playback Speed -------------------- //
function changeSpeed() {
    video.playbackRate = speed.value;
}

// Fullscreen ------------------------------- //
//View in fullscreen
function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        /* IE11 */
        elem.msRequestFullscreen();
    }
    video.classList.add('video-fullscreen');
}

// Close fullscreen
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE11 */
        document.msExitFullscreen();
    }
    video.classList.remove('video-fullscreen');
}

let fullscreen = false;

//Toggle fullscreen
function toggleFullscreen() {
    if(!fullscreen) {
        openFullscreen(player);
    } else {
        closeFullscreen();
    }
    fullscreen = !fullscreen;
}

// Event listeners ------------------------------- //
playBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress);
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
speed.addEventListener('change', changeSpeed);
fullScreenBtn.addEventListener('click', toggleFullscreen);

window.navigator.userAgent