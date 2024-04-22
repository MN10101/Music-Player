// Define variables
var audio , playbtn , title , poster , artists , seekslider , seeking=false , seekto, currenttimetext , durationtimetext , playlist_status , dir , playlist , ext , agent , playlists_artists , repeat , randomSong;

// Path to the directory containing the songs
dir = "songs/";

// Array of song names
playlist = ["AL025 - Denis Horvat - Noise feat. Lelah" , "Alex Stein - Bonfire (Original Mix)" , "yt1s.com - Adam Beyer  Ida Engberg  Lovecraft Original Mix","yt1s.com - Adam Beyer  Joseph Capriati  Family Matters Original Mix","yt1s.com - Meraki Original Mix","yt1s.com - Moonwalk  Galactic Original Mix","yt1s.com - Moonwalk  Nocturna Original Mix"]

// Array of song titles
title =["Lelah" , "Bonfire " , "Ida Engberg  Lovecraft ","Joseph Capriati  Family Matters Original Mix","Meraki ","Galactic ","Nocturna "]

// Array of poster images
poster=["images/1.jpg","images/2.jpg","images/3.jpg","images/4.jpg","images/5.jpg","images/6.jpg","images/7.jpg"]

// Array of artists
artists=["Denis Horvat", "Alex Stein","Xaia, Rain Man","Adam Beyer","Adam Beyer","Meraki","Moonwalk  , Moonwalk"]

// Index of the currently playing song
playlist_index = 0;

// File extension of the songs
ext =".mp3"

// Check if the user agent is Firefox or Opera, and set the file extension accordingly
agent = navigator.userAgent.toLowerCase();
if(agent.indexOf('firefox') != -1 || agent.indexOf('opera') != -1){
    ext=".ogg";
}

// Get references to the HTML elements
playbtn = document.getElementById("playpausebtn");
nextbtn = document.getElementById("nextbtn");
prevbtn = document.getElementById("prevbtn");
seekslider = document.getElementById("seekslider");
currenttimetext = document.getElementById("currenttimetext");
durationtimetext = document.getElementById("durationtimetext");
playlist_status = document.getElementById("playlist_status");
playlists_artists = document.getElementById("playlist_artist");
repeat = document.getElementById("repeat");
randomSong = document.getElementById("random");

// Create an Audio object
audio = new Audio();
audio.src = dir+playlist[0]+ext;
audio.loop = false;

// Set the title and artist of the current song
playlist_status.innerHTML = title[playlist_index];
playlists_artists.innerHTML = artists[playlist_index];

// Add event listeners for the play, next, and previous buttons, as well as for seeking and updating the seek slider
playbtn.addEventListener("click",playPause);
nextbtn.addEventListener("click",nextSong);
prevbtn.addEventListener("click",prevSong);
seekslider.addEventListener("mousedown" , function(event){ seeking=true; seek(event);});
seekslider.addEventListener("mousemove",function(event){ seek(event);});
seekslider.addEventListener("mouseup", function(){seeking=false;});
seekslider.addEventListener("input", function() {
    var seekto = audio.duration * (seekslider.value / 100);
    audio.currentTime = seekto;
});

// Update the seek slider and time display as the song plays
audio.addEventListener("timeupdate",function(){seektimeupdate();});

// Play the next song when the current song ends
audio.addEventListener("ended",function(){
    switchTrack();
});

// Toggle loop and shuffle functionality
repeat.addEventListener("click",loop);
randomSong.addEventListener("click",random);

// Page Visibility API
document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === 'visible') {
        audio.play();
    } else {
        audio.pause();
    }
});

// Fetch details of the current song
function fetchMusicDetail(){
    $("#image").attr("src",poster[playlist_index]);
    playlist_status.innerHTML = title[playlist_index];
    playlists_artists.innerHTML = artists[playlist_index];
    audio.src = dir+playlist[playlist_index]+ext;
    audio.play();
}

// Generate a random number within a range
function getRandomNumber(min , max){
    let step1 = max - min + 1;
    let step2 = Math.random() * step1;
    let result = Math.floor(step2) + min;
    return result;
}

// Play a random song
function random(){
    let randomIndex = getRandomNumber(0 , playlist.length-1);
    playlist_index = randomIndex;
    fetchMusicDetail();
    document.querySelector(".playpause").classList.add("active");
}

// Toggle loop functionality
function loop(){
    if(audio.loop){
        audio.loop = false;
        document.querySelector(".loop").classList.remove("active");
    }else{
        audio.loop = true;
        document.querySelector(".loop").classList.add("active");
    }
}

// Play the next song
function nextSong(){
    document.querySelector(".playpause").classList.add("active");
    playlist_index++;
    if(playlist_index > playlist.length - 1){
        playlist_index = 0;
    }
    fetchMusicDetail();
}

// Play the previous song
function prevSong(){
    document.querySelector(".playpause").classList.add("active");
    playlist_index--;
    if(playlist_index < 0){
        playlist_index = playlist.length - 1;
    }
    fetchMusicDetail();
}

// Play or pause the current song
function playPause(){
    if(audio.paused){
        audio.play();
        document.querySelector(".playpause").classList.add("active");
    }else{
        audio.pause();
        document.querySelector(".playpause").classList.remove("active");
    }
}

// Switch to the next song when the current song ends
function switchTrack(){
    if(playlist_index == (playlist.length - 1)){
        playlist_index = 0;
    }else{
        playlist_index++;
    }
    fetchMusicDetail();
}

// Update the seek slider and time display as the song plays
function seek(event){
    if(audio.duration == 0){
        null
    }else{
        if(seeking){
            seekslider.value = event.clientX - seekslider.offsetLeft;
            seekto = audio.duration * (seekslider.value / 100);
            audio.currentTime = seekto;
        }
    }
}

// Update the seek time as the song plays
function seektimeupdate(){
    if(audio.duration){
        var nt = audio.currentTime * (100 / audio.duration);
        seekslider.value = nt;
        var curmins = Math.floor(audio.currentTime / 60);
        var cursecs = Math.floor(audio.currentTime - curmins * 60);
        var durmins = Math.floor(audio.duration / 60);
        var dursecs = Math.floor(audio.duration - durmins * 60);
        if(cursecs < 10){ cursecs = "0"+cursecs; }
        if(dursecs < 10){ dursecs = "0"+dursecs; }
        if(curmins < 10){ curmins = "0"+curmins; }
        if(durmins < 10){ durmins = "0"+durmins; }
        currenttimetext.innerHTML = curmins+":"+cursecs;
        durationtimetext.innerHTML = durmins+":"+dursecs;
    }else{
        currenttimetext.innerHTML = "00"+":"+"00";
        durationtimetext.innerHTML = "00"+":"+"00";
    }
}

// Toggle between light and dark theme
let checkbox = document.querySelector('input[name=theme]');
checkbox.addEventListener('change',function(){
    if(this.checked){
        document.documentElement.setAttribute('data-theme','dark');
    }else{
        document.documentElement.setAttribute('data-theme','light');
    }
})
