// Informações para a manipulação do Audio
const audioLocation = "./assets/media/audio";
const audioPlayer = document.getElementById('audioPlayer');

//Informações de música
const musicCapaLocation = "./assets/media/img/capa";
const musicCurrTimerView = document.getElementById('currentTimer');
const musicTotalTimerView = document.getElementById('totalTimer');
const progressBar = document.getElementById('progressBar');
let musicCurrTime;

const musicCapaView = document.getElementById('musicAlbum');
const musicTitleView = document.getElementById('musicTitle');
const musicArtistView = document.getElementById('musicArtist');

//Volume
const inputVolume = document.getElementById('musicVol');
let lastVolStatus, lastVolValue;

//Botões
const pausePlayBtn = document.getElementById('pausePlayBtn');
const prevMusicBtn = document.getElementById('backBtn');
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
        arquivo: "nao_va_se_perder_por_ai.mp4", 
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
        arquivo: "eclipse_do_cometa.mp4", 
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

const setProgressBarValue = (timerCurr) => {
    let progressCalc = (timerCurr * 100) / progressBar.max;
    progressBar.style = `--progress: ${progressCalc}%`;

}

const setCurrTimer = (timerCurr) => {

    if(timerCurr <= progressBar.max) {
        setProgressBarValue(timerCurr);
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
    return musicList.filter(item => item.id === musicId)[0];

}

const setMusic = async (musicPlayer) => {
    try {
        await musicPlayer.play();
        progressBar.max = musicPlayer.duration;
        musicTotalTimerView.innerHTML = timerConverter(musicPlayer.duration);
        

    } catch(err){
        console.log(err);
    }
}

const setMusicInfo = (musicPlayer) => {
    //Pegando as informações da Música
    const musicId = Number(musicPlayer.dataset.music);
    const musicInfo = selectMusic(musicId);

    //Atribuindo às variáveis as respectivas informações da música;
    const nameMusic = musicInfo.nome;
    const artMusic = musicInfo.artista;
    const capaMusic = musicInfo.capa;
    const fileMusic = musicInfo.arquivo;

    //Definindo os caminhos para o audio e para a capa da música;
    const srcMusic = `${audioLocation}/${fileMusic}`;
    const srcCapa = `${musicCapaLocation}/${capaMusic}`;

    musicCapaView.src = srcCapa;
    musicTitleView.innerHTML = nameMusic;
    musicArtistView.innerHTML = artMusic;
    musicPlayer.src = srcMusic;


}

const setCurrMusic = (musicPlayer, direction = null) => {
    const musicId = Number(musicPlayer.dataset.music);
    if(!musicId || (musicId >= musicList.length && direction === "next")) {
        musicPlayer.dataset.music = Number(1);
        
    } else if(musicId <= 1 && direction === "prev") {
        musicPlayer.dataset.music = musicList.length;

    } else if(musicId > 1 && direction === "prev") {
        musicPlayer.dataset.music--;

    } else {
        musicPlayer.dataset.music++;

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
        clearInterval(musicCurrTime);

    }
    changeBtn();

})

prevMusicBtn.addEventListener('click', () => {
    if(audioPlayer.currentTime < 1) {
        setCurrMusic(audioPlayer, "prev");
        setMusicInfo(audioPlayer);
        setMusic(audioPlayer);

    } else {
        audioPlayer.currentTime = 0;
    }
})

nextMusicBtn.addEventListener('click', () => {
    setCurrMusic(audioPlayer, "next");
    setMusicInfo(audioPlayer);
    setMusic(audioPlayer);
})

//Inicia a contagem
audioPlayer.addEventListener('playing', () => {
    //A função é executada antes para impedir o delay inicial do setInterval 
    setCurrTimer(audioPlayer.currentTime);
    musicCurrTime = setInterval(() => {
        setCurrTimer(audioPlayer.currentTime);
    }, 1000)

})

audioPlayer.addEventListener('ended', () => {
    setCurrMusic(audioPlayer, "next");
    setMusicInfo(audioPlayer);
    setMusic(audioPlayer);
})


//Altera o tempo da música

//Permite o usuário visualizar a partir de qual momento a música continuará
progressBar.addEventListener('input', () => {
    clearInterval(musicCurrTime);
    setProgressBarValue(progressBar.value);
    musicCurrTimerView.innerHTML = timerConverter(progressBar.value);
})

//Altera efetivamente o tempo da musica
progressBar.addEventListener('change', () => {
    setCurrTimer(progressBar.value);
    audioPlayer.currentTime = progressBar.value;

})



/* 
==============================
Funções Destinadas ao Volume
==============================
*/

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


/* 
==============================
Função Principal 
==============================
*/
const main = () => {
    //Define o status inicial do volume;
    setVolume(inputVolume.value);
    changeIconVolume(inputVolume.value);

    //Definições gerais da música
    setCurrMusic(audioPlayer);
    setMusicInfo(audioPlayer);

}

main();

