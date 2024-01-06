function closepre(){
    setTimeout(myfun,1000);
}
function myfun(){
    document.getElementById("preloader").style.display="none";
}
var count = 0;
var currentSong = new Audio();
var start = true;

// async function fetchSongs() {
//     let fetchSong = await fetch("/songs");
//     let response = await fetchSong.text();
//     let div = document.createElement('div');
//     div.innerHTML = response;
//     let a = div.getElementsByTagName("a");
//     let songs = [];
//     for (let index = 0; index < a.length; index++) {
//         const element = a[index];
//         if (element.href.endsWith(".mp3")) {
//             songs.push(element.href);
//         }
//     }
//     return songs;
// }

const songs =["songs/High Hukku - King.mp3","songs/Hua Main Animal 128 Kbps.mp3","songs/Khalasi.mp3","songs/Ishq Jaisa Kuch Fighter 128 Kbps.mp3","songs/Matak Chalungi.mp3","songs/Lutt Putt Gaya Dunki 128 Kbps.mp3","songs/Kabhi Shaam Dhale - Mohammad Faiz.mp3","songs/Thumak Thumak Pahari.mp3"];

async function playsong() {
    var songSlider = document.getElementById("songSlider");
    var nextbtn = document.getElementById("next");
    var prevbtn = document.getElementById("prev");
    // let songs = await fetchSongs()
    var playPausebtn = document.getElementById("playPause");
    var songdiv = document.querySelector(".songList").getElementsByTagName("ol")[0];
    for (const song of songs) {
        var ganna = song.split("songs/")[1];
        songdiv.innerHTML = songdiv.innerHTML + `<li class="songitem">${ganna}</li>`;

        // songdiv.innerHTML = songdiv.innerHTML + `<li class="songitem">${ganna.replaceAll("%20", " ")}</li>`;
    }
    var lasttrack = songs.length - 1;

    currentSong.src = songs[count];
    playPausebtn.addEventListener("click", () => {
        start = playing(start, currentSong, playPausebtn);
    });

    nextbtn.addEventListener("click", () => {
        const res = nexttrack(count, start, songs, playPausebtn, lasttrack);
        start = res.start;
        count = res.count;
    });
    prevbtn.addEventListener("click", () => {
        const res = prevtrack(count, start, songs, playPausebtn, lasttrack);
        start = res.start;
        count = res.count;
    });

    //library

    var songitems = document.querySelectorAll(".songitem")
    songitems.forEach((songitem, index) => {
        index++;
        songitem.addEventListener("click", () => {
            currentSong.src = songs[index - 1];
            start = true;
            start = playing(start, currentSong, playPausebtn);
        });
    });

    // document.querySelector(".songinfo").innerHTML = decodeURI(songs[count].split("/songs/")[1].split(".mp3")[0]);

    currentSong.addEventListener("timeupdate", () => {
        let currentDuration = currentSong.currentTime;
        let totalDuration = currentSong.duration;
        let percentagePlayed = (currentDuration / totalDuration) * 100;
        songSlider.value = percentagePlayed;
        let minutesPlayed = Math.floor(currentDuration / 60);
        let secondsPlayed = Math.floor(currentDuration % 60);
        let totalMinutes = Math.floor(totalDuration / 60);
        let totalSeconds = Math.floor(totalDuration % 60);
        document.querySelector(".playedTime").innerHTML = formatTime(minutesPlayed, secondsPlayed);
        document.querySelector(".totalTime").innerHTML = formatTime(totalMinutes,totalSeconds);

        if (currentDuration == totalDuration) {
            const res = nexttrack(count, start, songs, playPausebtn, lasttrack);
            start = res.start;
            count = res.count;
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

function playing(start, currentSong, playPausebtn) {
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


function nexttrack(count, start, songs, playPausebtn, lasttrack) {
    if (count == lasttrack) {
        count = 0;
    } else {
        count++;
    }
    currentSong.src = songs[count];
    currentSong.addEventListener("loadeddata", () => {
        // document.querySelector(".songinfo").innerHTML = decodeURI(songs[count].split("/songs/")[1].split(".mp3")[0]);
        currentSong.play();
        playPausebtn.src = ("./svg/pause-button.svg");
    });
    start = false;
    return { count, start };
}

function prevtrack(count, start, songs, playPausebtn, lasttrack) {
    if (count == 0) {
        count = lasttrack;
    } else {
        count--;
    }
    currentSong.src = songs[count];
    currentSong.addEventListener("loadeddata", () => {
        // document.querySelector(".songinfo").innerHTML = decodeURI(songs[count].split("/songs/")[1].split(".mp3")[0]);
        currentSong.play();
        playPausebtn.src = ("./svg/pause-button.svg");
    });
    start = false;
    return { count, start };
}

document.querySelector(".small-open").getElementsByTagName("img")[0].addEventListener(("click"),()=>{
    document.querySelector(".left").style.left="0";
});
document.querySelector(".close-small").addEventListener(("click"),()=>{
    document.querySelector(".left").style.left="-100%";
});