let allMusic = [{
        name: "First Song",
        artist: "First Singer",
        img: "images/1.jpg",
        src: "songs/1.mp3",
    },
    {
        name: "Second Song",
        artist: "Second Singer",
        img: "images/2.jpg",
        src: "songs/2.mp3",
    },
    {
        name: "Third Song",
        artist: "Third Singer",
        img: "images/3.jpg",
        src: "songs/3.mp3",
    },
    {
        name: "Fourth Song",
        artist: "Fourth Singer",
        img: "images/4.jpg",
        src: "songs/4.mp3",
    },
    {
        name: "Fifth Song",
        artist: "Fifth Singer",
        img: "images/5.jpg",
        src: "songs/5.mp3",
    },
    {
        name: "Sixth Song",
        artist: "Sixth Singer",
        img: "images/6.jpg",
        src: "songs/6.mp3",
    },
];

const container = document.querySelector(".container"),
    musicImg = container.querySelector(".img-area img"),
    musicName = container.querySelector(".song-details .name"),
    musicArtist = container.querySelector(".song-details .artist"),
    palyPauseBtn = container.querySelector(".play-pause"),
    prevBtn = container.querySelector("#prev"),
    nextBtn = container.querySelector("#next"),
    mainAudio = container.querySelector("#main-audio"),
    progressArea = container.querySelector(".progress-area"),
    progressBar = container.querySelector(".progress-bar"),
    repeatBtn = container.querySelector("#repeat-plist"),
    musicCurrentTime = container.querySelector(".current-time"),
    musicDuration = container.querySelector(".max-duration");

let musicIndex = 0;
let isPlaying = false;

window.addEventListener("load", () => {
    loadMusic(musicIndex);
});

function loadMusic(indexNumber) {
    musicName.innerHTML = allMusic[indexNumber].name;
    musicArtist.innerHTML = allMusic[indexNumber].artist;
    musicImg.src = allMusic[indexNumber].img;
    mainAudio.src = allMusic[indexNumber].src;
}

function playMusic() {
    isPlaying = true;
    palyPauseBtn.querySelector("i").innerHTML = "pause";
    mainAudio.play();
}

function pauseMusic() {
    isPlaying = false;
    palyPauseBtn.querySelector("i").innerHTML = "play_arrow";
    mainAudio.pause();
}
palyPauseBtn.addEventListener("click", () => {
    isPlaying ? pauseMusic() : playMusic();
});

function nextMusic() {
    ++musicIndex;
    musicIndex > allMusic.length - 1 ?
        (musicIndex = 0) :
        (musicIndex = musicIndex);
    loadMusic(musicIndex);
    playMusic()
}

function prevMusic() {
    --musicIndex;
    musicIndex < 0 ?
        (musicIndex = allMusic.length - 1) :
        (musicIndex = musicIndex);
    loadMusic(musicIndex);
    playMusic()
}

nextBtn.addEventListener("click", () => {
    nextMusic();
});
prevBtn.addEventListener("click", () => {
    prevMusic();
});

repeatBtn.addEventListener("click", () => {
    switch (repeatBtn.innerHTML) {
        case "repeat":
            repeatBtn.innerHTML = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerHTML = "shuffle";
            repeatBtn.setAttribute("title", "Playback Shuffled");
            break;
        case "shuffle":
            repeatBtn.innerHTML = "repeat";
            repeatBtn.setAttribute("title", "playlist looped");
            break;
    }
});

mainAudio.addEventListener("ended", () => {
    switch (repeatBtn.innerHTML) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor(Math.random() * allMusic.length);
            do {
                randIndex = Math.floor(Math.random() * allMusic.length);
            } while (musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            break;
    }
});

mainAudio.addEventListener("loadeddata", () => {
    updateTime(mainAudio.duration, musicDuration)
    let interval = setInterval(() => {
        updateTime(mainAudio.currentTime, musicCurrentTime)
    }, 1000);
    mainAudio.addEventListener("ended", () => {
        clearInterval(interval);
    });
});

function updateTime(time, element) {
    let minutes = Math.trunc(time / 60);
    let seconds = Math.trunc(time % 60);
    seconds < 10 ?
        element.innerHTML = `0${minutes}:0${seconds}` :
        element.innerHTML = `0${minutes}:${seconds}`;
}

progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
})

mainAudio.addEventListener("timeupdate", (e) => {
    let currentTime = e.target.currentTime;
    let duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
});
