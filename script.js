const songName = document.getElementById("song-name");
const bandName = document.getElementById("band-name");
const song = document.getElementById("audio");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffleButton = document.getElementById("shuffle");


const originalPlaylist = [
  {
    songName: "Do it",
    artist: "Chloe & Halley",
    file: "ungodly-hour",
    songFile: "do_it",
    like: true,
  },
  {
    songName: "I Don't Mind",
    artist: "Lloyd",
    file: "street_love",
    songFile: "i_dont_mind",
    like: true,
  },
  {
    songName: "Mercy",
    artist: "Kenye West",
    file: "mercy",
    songFile: "mercy",
    like: true,
  },
  {
    songName: "Rain On Me",
    artist: "Lady Gaga feat. Ariana Grande",
    file: "chromatica",
    songFile: "rain_on_me",
    like: true,
  },
  {
    songName: "Undercover",
    artist: "Kehlani",
    file: "SweetSexySavage",
    songFile: "undercover",
    like: true,
  },
  {
    songName: "Wind Up",
    artist: "Keke Palmer",
    file: "wind_up",
    songFile: "wind_up",
    like: true,
  },
];
let sortedPlaylist = [...originalPlaylist];
let isPlaying = false;
let isShuffled = false;
let index = 0;

function playMusic() {
  play.querySelector(".bi").classList.remove("bi-play-circle-fill");
  play.querySelector(".bi").classList.add("bi-pause-circle-fill");
  song.play();
  isPlaying = true;
}

function pauseMusic() {
  play.querySelector(".bi").classList.add("bi-play-circle-fill");
  play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
  song.pause();
  isPlaying = false;
}

function playPauseDecider() {
  if (isPlaying === true) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function loadSong() {
  cover.src = `images/${sortedPlaylist[index].file}.jpg`;
  song.src = `songs/${sortedPlaylist[index].songFile}.mp3`;
  songName.innerText = sortedPlaylist[index].songName;
  bandName.innerText = sortedPlaylist[index].artist;
}

function previousSong() {
  if (index === 0) {
    index = sortedPlaylist.length - 1;
  } else {
    index -= 1;
  }
  loadSong();
  playMusic();
}

function nextSong() {
  if (index === sortedPlaylist.length - 1) {
    index = 0;
  } else {
    index += 1;
  }
  loadSong();
  playMusic();
}

function updateProgressBar() {
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`)
}

function jumpTo(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1;
    }
}

function shuffleButtonClicked() {
    if (isShuffled === false) {
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    } else {
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove('button-active');

    }
}

loadSong();

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener('timeupdate', updateProgressBar)
progressContainer.addEventListener('click', jumpTo)
shuffleButton.addEventListener('click', shuffleButtonClicked)