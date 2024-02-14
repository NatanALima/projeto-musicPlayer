
const audioLocation = "./assets/media/audio";
const audioPlayer = document.getElementById('audioPlayer');

//Informações de música
const musicCurrTimerView = document.getElementById('currentTimer');
const musicTotalTimerView = document.getElementById('totalTimer');
const progressBar = document.getElementById('progressBar');
var musicCurrTime;

//Botões
const pausePlayBtn = document.getElementById('pausePlayBtn');
const backMusicBtn = document.getElementById('backBtn');
const nextMusicBtn = document.getElementById('nextBtn');

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



// Funções de auxilio
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

//Funções Principais
pausePlayBtn.addEventListener('click', () => {
    if(audioPlayer.paused) {  
        setMusic(audioPlayer);

    } else {
        audioPlayer.pause();

    }
    changeBtn();

})

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

