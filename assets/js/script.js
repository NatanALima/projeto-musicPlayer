// Informações para a manipulação do Audio
const audioLocation = "./assets/media/audio";
const audioPlayer = document.getElementById('audioPlayer');

//Informações de música
const musicCurrTimerView = document.getElementById('currentTimer');
const musicTotalTimerView = document.getElementById('totalTimer');
const progressBar = document.getElementById('progressBar');
var musicCurrTime;

//Volume
const inputVolume = document.getElementById('musicVol');
let lastVolStatus, lastVolValue;

//Botões
const pausePlayBtn = document.getElementById('pausePlayBtn');
const backMusicBtn = document.getElementById('backBtn');
const nextMusicBtn = document.getElementById('nextBtn');
const volumeBtn = document.getElementById('volumeBtn');

//Icones
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');

//Informações referentes à música
const musicInfoLocation = "./assets/media/img/capa";
const musicList = [
    {
        id: 1,
        nome: "Ainda é Cedo", 
        artista: "Legião Urbana", 
        arquivo: "ainda_e_cedo.mp4", 
        capa: "album_legiao_capa1.jpg"
    },
    {
        id: 2,
        nome: "Não Vá Se Perder Por Aí", 
        artista: "Os mutantes", 
        arquivo: "eclipse_do_cometa.mp4", 
        capa: "album_mutantes_capa1.jpg"
    },
    {
        id: 3,
        nome: "Samba De Orly", 
        artista: "Chico Buarque", 
        arquivo: "samba_de_orly.mp4", 
        capa: "album_chico_capa1.jpg"
    },
    {
        id: 4,
        nome: "Eclipse Do Cometa", 
        artista: "Rita Lee", 
        arquivo: "eclipe_do_cometa.mp4", 
        capa: "album_ritalee_capa1.jpg"
    }
]


/* 
==============================================
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Funções de Auxílio
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
==============================================
*/
// Funções de auxílio referentes ao Player
const timerConverter = (timer) => {
    const minutes = Math.trunc(timer/60);
    const seconds = ("0" + Math.round(timer % 60)).slice(-2);
    return `${minutes}:${seconds}`;

}

const setCurrTimer = (timerCurr) => {
    let progressCalc = (timerCurr * 100) / progressBar.max;

    if(timerCurr <= progressBar.max) {
        progressBar.style = `--progress: ${progressCalc}%`;
        progressBar.value = timerCurr;
        musicCurrTimerView.innerHTML = timerConverter(timerCurr);

    } 
}

const changeBtn = () => {
    if(pausePlayBtn.classList.contains("isPaused")) {
        pauseIcon.style.display = "block";
        playIcon.style.display = "none";
        pausePlayBtn.classList.remove("isPaused");
        pausePlayBtn.classList.add("isPlaying");

    } else {
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
        pausePlayBtn.classList.remove("isPlaying");
        pausePlayBtn.classList.add("isPaused");
    }
}


const selectMusic = (musicId) => {
    let music;
    if(musicId === musicList.length) {
        music = musicList.filter(item => item.id === 1);
    
    } else if(musicId < 1) {
        music = musicList.filter(item => item.id === musicList.length);

    }
    music = musicList.filter(item => item.id === musicId)[0];
    return music;

}

const setMusic = async (musicPlayer) => {
    try {
        if(!musicPlayer.src) {
            const music = selectMusic(1);
            musicPlayer.src = `${audioLocation}/${music.arquivo}`;
            
        }
        await musicPlayer.play();
        progressBar.max = musicPlayer.duration;
        musicTotalTimerView.innerHTML = timerConverter(musicPlayer.duration);
        

    } catch(err){
        console.log(err);
    }
}

//Funções de auxílio referentes ao Volume
const setVolume = (newValue) => {
    inputVolume.value = newValue;
    let volumeCalc = Number(newValue/100);
    audioPlayer.volume = volumeCalc;
    inputVolume.style = `--volumeBar: ${inputVolume.value}%`;
}

const changeIconVolume = (volume) => {
    if(volume > inputVolume.max/2) {
        volumeBtn.dataset.volstatus = "high";
    
    } else if(volume > 0) {
        volumeBtn.dataset.volstatus = "mid";

    } else {
        volumeBtn.dataset.volstatus = "muted";

    }
}
/*
==============================================
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Funções Principais
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
==============================================
*/


/* 
==============================
Funções Destinadas a música 
==============================
*/
//Inicia a música
pausePlayBtn.addEventListener('click', () => {
    if(audioPlayer.paused) {  
        setMusic(audioPlayer);

    } else {
        audioPlayer.pause();

    }
    changeBtn();

})

//Inicia a contagem
audioPlayer.addEventListener('playing', () => {
    musicCurrTime = setInterval(() => {
        setCurrTimer(audioPlayer.currentTime);
    }, 1000)

})

//PENDENTE
audioPlayer.addEventListener('ended', () => {
    audioPlayer.src = `${audioLocation}/eclipse_do_cometa.mp4`;
    setMusic(audioPlayer);
})



/* 
==============================
Funções Destinadas ao Volume
==============================
*/
//Define o status inicial do volume;
setVolume(inputVolume.value);
changeIconVolume(inputVolume.value);

// Permite a alteração do volume
inputVolume.addEventListener('input', () => {
    setVolume(inputVolume.value);
    changeIconVolume(inputVolume.value);
})

// Muta e desmuta
volumeBtn.addEventListener('click', () => {

    if(volumeBtn.dataset.volstatus === "high" || volumeBtn.dataset.volstatus === "mid") {
        lastVolStatus = volumeBtn.dataset.volstatus;
        lastVolValue = inputVolume.value;
        volumeBtn.dataset.volstatus = "muted";
        setVolume(0);

    } else {
        volumeBtn.dataset.volstatus = lastVolStatus;
        setVolume(lastVolValue);

    }

})

