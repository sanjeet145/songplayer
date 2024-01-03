var count = 0;
var currentSong = new Audio();
var start = true;
 
async function fetchSongs() {
    let fetchSong = await fetch("/songs");
    let response = await fetchSong.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let a = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < a.length; index++) {
        const element = a[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}

async function playsong() {
    var songtime = document.querySelector(".songtime");
    var songSlider = document.getElementById("songSlider");
    var nextbtn = document.getElementById("next");
    var prevbtn = document.getElementById("prev");
    let songs = await fetchSongs()
    var playPausebtn = document.getElementById("playPause");
    var songdiv=document.querySelector(".songList").getElementsByTagName("ol")[0];
    for(const song of songs){
        var ganna=song.split("/songs/")[1];
        songdiv.innerHTML=songdiv.innerHTML+`<li>${ganna.replaceAll("%20"," ")}</li>`;
    }
    var lasttrack=songs.length-1;
    
    currentSong.src=songs[count];
    playPausebtn.addEventListener("click", () => {
        start = playing(start,currentSong,playPausebtn);
    });
    
    nextbtn.addEventListener("click", () => {
        const res=nexttrack(count, start, songs,playPausebtn,lasttrack);
        start= res.start;
        count= res.count;
    });
    prevbtn.addEventListener("click", () => {
        const res=prevtrack(count, start, songs,playPausebtn,lasttrack);
        start= res.start;
        count= res.count;
    });
    

    currentSong.addEventListener("timeupdate", () => {
        let currentDuration = currentSong.currentTime;
        let totalDuration = currentSong.duration;
        let percentagePlayed = (currentDuration / totalDuration) * 100;
        songSlider.value = percentagePlayed;
        let minutesPlayed = Math.floor(currentDuration / 60);
        let secondsPlayed = Math.floor(currentDuration % 60);
        songtime.innerHTML = formatTime(minutesPlayed, secondsPlayed);

        if(currentDuration==totalDuration){
            const res=nexttrack(count, start, songs,playPausebtn,lasttrack);
            start= res.start;
            count= res.count;
        }
    });
    songSlider.addEventListener("input", () => {
        let percentage = songSlider.value;
        let newPosition = (percentage / 100) * currentSong.duration;
        currentSong.currentTime = newPosition;
    });
}

function formatTime(minutes, seconds) {
    return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
}

playsong()

function playing(start,currentSong,playPausebtn){
    if (start) {
        currentSong.play();
        playPausebtn.src = ("./svg/pause-button.svg");
        start = false;
    }
    else {
        playPausebtn.src = ("./svg/play-button.svg");
        currentSong.pause();
        start = true;
    }
    return start;
}


function nexttrack(count, start, songs,playPausebtn,lasttrack){
    if(count==lasttrack){
        count=0;
    }else{
        count++;
    }
    currentSong.src=songs[count];
    currentSong.addEventListener("loadeddata", () => {
        currentSong.play();
        playPausebtn.src = ("./svg/pause-button.svg");
    });
    start = false;
    return {count,start};
}

function prevtrack(count, start, songs,playPausebtn,lasttrack){
    if(count==0){
        count=lasttrack;
    }else{
        count--;
    }
    currentSong.src=songs[count];
    currentSong.addEventListener("loadeddata", () => {
        currentSong.play();
        playPausebtn.src = ("./svg/pause-button.svg");
    });
    start = false;
    return {count,start};
}