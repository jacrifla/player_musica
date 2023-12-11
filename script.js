// Declaração das variáveis que representam elementos HTML do reprodutor de música
const songName = document.getElementById("song-name"); // Elemento que exibe o nome da música
const bandName = document.getElementById("band-name"); // Elemento que exibe o nome da banda/artista
const song = document.getElementById("audio"); // Elemento de áudio para reprodução
const cover = document.getElementById("cover"); // Elemento de capa do álbum
const play = document.getElementById("play"); // Botão de reproduzir/pausar música
const next = document.getElementById("next"); // Botão de próxima música
const previous = document.getElementById("previous"); // Botão de música anterior
const likeButton = document.getElementById("like"); // Botão de "curtir" música
const currentProgress = document.getElementById("current-progress"); // Barra de progresso atual
const progressContainer = document.getElementById("progress-container"); // Container da barra de progresso
const shuffleButton = document.getElementById("shuffle"); // Botão de embaralhar músicas
const repeatButton = document.getElementById("repeat"); // Botão de repetir música
const songTime = document.getElementById("song-time"); // Tempo atual da música
const totalTime = document.getElementById("total-time"); // Tempo total da música

// Lista original de músicas com informações como nome, artista, arquivo de áudio etc
const originalPlaylist = [
  {
    songName: "Do it",
    artist: "Chloe & Halley",
    file: "ungodly-hour",
    songFile: "do_it",
    liked: true,
  },
  {
    songName: "I Don't Mind",
    artist: "Lloyd",
    file: "street_love",
    songFile: "i_dont_mind",
    liked: false,
  },
  {
    songName: "Mercy",
    artist: "Kenye West",
    file: "mercy",
    songFile: "mercy",
    liked: false,
  },
  {
    songName: "Rain On Me",
    artist: "Lady Gaga feat. Ariana Grande",
    file: "chromatica",
    songFile: "rain_on_me",
    liked: false,
  },
  {
    songName: "Undercover",
    artist: "Kehlani",
    file: "SweetSexySavage",
    songFile: "undercover",
    liked: false,
  },
  {
    songName: "Wind Up",
    artist: "Keke Palmer",
    file: "wind_up",
    songFile: "wind_up",
    liked: false,
  },
];

// Lista ordenada inicialmente com base na lista original
let sortedPlaylist = [...originalPlaylist];

// Recuperar a lista salva no armazenamento local, se existir
const storedPlaylist = JSON.parse(localStorage.getItem('playlist'));

// Verificar se há uma lista no armazenamento local e atribuir à lista ordenada, ou usar a lista original se não houver uma lista salva
if (storedPlaylist && Array.isArray(storedPlaylist) && storedPlaylist.length > 0) {
    sortedPlaylist = [...storedPlaylist]; // Atualizando a lista modificada
} else {
    sortedPlaylist = [...originalPlaylist]; // Se não houver lista salva, use a lista original
}

// Declaração de variáveis de controle e índice
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
let index = 0;

// Funções para controlar a reprodução de música, botões, etc.
function playMusic() {
  play.querySelector(".bi").classList.remove("bi-play-circle-fill");
  play.querySelector(".bi").classList.add("bi-pause-circle-fill");
  song.play();
  isPlaying = true;
}

// Função para pausar música
function pauseMusic() {
  play.querySelector(".bi").classList.add("bi-play-circle-fill");
  play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
  song.pause();
  isPlaying = false;
}

// Função para decidir entre reproduzir ou pausar música
function playPauseDecider() {
  if (isPlaying === true) {
    pauseMusic();
  } else {
    playMusic();
  }
}

// Função para renderizar o botão de "curtir" a música
function likeButtonRender() {
    if (sortedPlaylist[index].liked === true) {
        likeButton.querySelector('.bi').classList.remove('bi-heart')
        likeButton.querySelector('.bi').classList.add('bi-heart-fill')
        likeButton.classList.add('button-active')
    } else {
        likeButton.querySelector('.bi').classList.add('bi-heart')
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill')
        likeButton.classList.remove('button-active')
        
    }
}

// Função para tratar o clique no botão de "curtir"
function likeButtonClicked() {
    if (sortedPlaylist[index].liked === false) {
        sortedPlaylist[index].liked = true;        
    } else {
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(sortedPlaylist))
}

// Função para carregar informações da música
function loadSong() {
  cover.src = `images/${sortedPlaylist[index].file}.jpg`;
  song.src = `songs/${sortedPlaylist[index].songFile}.mp3`;
  songName.innerText = sortedPlaylist[index].songName;
  bandName.innerText = sortedPlaylist[index].artist;
  likeButtonRender();
}

// Funções para controle de música anterior e próxima
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

// Função para atualizar o progresso da música
function updateProgress() {
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

// Função para pular para uma posição específica na música
function jumpTo(event) {
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime;
}

// Função para embaralhar um array
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

// Função para embaralhar a lista de reprodução
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

// Função para alternar o modo de repetição
function repeatButtonClicked() {
    if (repeatOn === false) {
        repeatOn = true;
        repeatButton.classList.add('button-active');
    } else {
        
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }
}

// Função para decidir entre reproduzir a próxima música ou repetir a atual
function nextOrRepeat() {
    if (repeatOn === false) {
        nextSong();
    } else {
        playMusic();
    }
}

// Função para formatar o tempo em horas, minutos e segundos
function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let minutes = Math.floor((originalNumber - hours * 3600) / 60);
    let segundos = Math.floor(originalNumber - hours * 3600 - minutes * 60);

    return `${hours.toString().padStart(2, 0)}:${minutes.toString().padStart(2, 0)}:${segundos.toString().padStart(2, 0)}`
}

// Função para atualizar o tempo total da música
function updateTotalTime() {
    totalTime.innerText = toHHMMSS(song.duration);    
}

// Carregar informações da primeira música na inicialização
loadSong();

// Event listeners para os elementos HTML
play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener('timeupdate', updateProgress)
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime)
progressContainer.addEventListener('click', jumpTo)
shuffleButton.addEventListener('click', shuffleButtonClicked)
repeatButton.addEventListener('click', repeatButtonClicked)
likeButton.addEventListener('click', likeButtonClicked)
