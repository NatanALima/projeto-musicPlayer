
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

//Informações referentes à música
const musicInfoLocation = "./assets/media/img/capa";
const musicList = [
    {
        nome: "Ainda é Cedo", 
        artista: "Legião Urbana", 
        arquivo: "ainda_e_cedo.mp4", 
        capa: "album_legiao_capa1.jpg"
    },
    {
        nome: "Não Vá Se Perder Por Aí", 
        artista: "Os mutantes", 
        arquivo: "eclipse_do_cometa.mp4", 
        capa: "album_mutantes_capa1.jpg"
    },
    {
        nome: "Samba De Orly", 
        artista: "Chico Buarque", 
        arquivo: "samba_de_orly.mp4", 
        capa: "album_chico_capa1.jpg"
    },
    {
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

//Funções Principais
pausePlayBtn.addEventListener('click', async () => {
    if(audioPlayer.paused) {  
        try {
            if(!audioPlayer.src) {
                audioPlayer.src = `${audioLocation}/ainda_e_cedo.mp4`;
                
            }
            await audioPlayer.play();
            progressBar.max = audioPlayer.duration;
            musicTotalTimerView.innerHTML = timerConverter(audioPlayer.duration);
            

        } catch(err){
            console.log(err);
        }

    } else {
        audioPlayer.pause();

    }

})

audioPlayer.addEventListener('playing', () => {
    musicCurrTime = setInterval(() => {
        setCurrTimer(audioPlayer.currentTime);
    }, 1000)

})

