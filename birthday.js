/* ==== Data ==== */
const messages = [
  "Hello Baby ❤️",
  "Today is your special day...",
  "So I made something only for you...",
  "Happy Birthday My Love ❤️",
];

const memories = [
  { img: "images/img2.jpeg", cap: "Every smile with you became my favorite memory. ❤️" },
  { img: "images/img3.jpeg", cap: "I wish I could relive this day forever." },
  { img: "images/img13.jpeg", cap: "You make ordinary moments unforgettable." },
  { img: "images/img17.jpeg", cap: "Every picture has a story. Every story has you." },
  { img: "images/img12.jpeg", cap: "Thank you for making life beautiful." },
  { img: "images/img7.jpeg", cap: "I found my favorite place... beside you." },
  { img: "images/img11.jpeg", cap: "You are my happiest memory." },
  { img: "images/img9.jpeg", cap: "Happy Birthday To My Favorite Person ❤️" },
];

const songs = [
  {
    title: "Tum Mile ❤️",
    caption: "Every time this song plays...\nI think of you ❤️",
    url: "music/tum mile.mp3"
    
  },
  {
    title: "Until I Found You",
    caption: "You are the one I was waiting for. 🌙",
    url: "music/until.mp3"
  },
  {
    title: "Perfect",
    caption: "Because you are perfect to me. ✨",
    url: "music/perfect.mp3"
  },
  {
    title: "Our Forever Song",
    caption: "Forever starts with you. 💖",
    url: "music/khat.mp3"
  }
];




const cards = [
  { key: "memories", title: "The Moments I Never Want To Forget", img: "images/us.jpeg" },
  { key: "video",    title: "Tiny Pieces Of Happiness",            img: "images/img8.jpeg" },
  { key: "letter",   title: "A Letter For You",                    img: "images/img10.jpeg" },
  { key: "cake",     title: "Make A Wish",                         img: "images/img20.jpeg" },
  { key: "playlist", title: "Songs That Remind Me Of You",         img: "images/img21.jpeg" },
  { key: "final",    title: "One Last Surprise...",                img: "images/img22.jpeg" },
];

/* ==== Navigation ==== */
const pages = ["landing","password","typing","home","memories","video","letter","playlist","cake","final"];
function showPage(name){
  pages.forEach(p => {
    const el = document.getElementById("bd-" + p);
    if (!el) return;
    el.classList.toggle("active", p === name);
  });
  window.scrollTo(0,0);
  if (name === "typing") startTyping();
  if (name === "playlist") loadCurrentSong();
  if (name !== "playlist" && name !== "video") { pauseAudio(); pauseVideo(); }
}

document.querySelectorAll("[data-goto]").forEach(b => {
  b.addEventListener("click", () => showPage(b.dataset.goto));
});

/* ==== Password ==== */
const pwInput = document.getElementById("bd-password-input");
const pwBtn = document.getElementById("bd-password-btn");
function checkPassword(){
  if (pwInput.value === "2326") { showPage("typing"); }
  else { alert("Wrong Password ❤️"); pwInput.value = ""; }
}
pwBtn.addEventListener("click", checkPassword);
pwInput.addEventListener("keydown", e => { if (e.key === "Enter") checkPassword(); });

/* ==== Typing ==== */
const typingEl = document.getElementById("bd-typingText");
function startTyping(){
  typingEl.textContent = "";
  let idx = 0;
  function nextMsg(){
    if (idx >= messages.length){ setTimeout(() => showPage("home"), 1000); return; }
    const text = messages[idx]; let i = 0; typingEl.textContent = "";
    const iv = setInterval(() => {
      i++; typingEl.textContent = text.slice(0,i);
      if (i >= text.length){ clearInterval(iv); idx++; setTimeout(nextMsg, 1200); }
    }, 60);
  }
  nextMsg();
}

/* ==== Home cards ==== */
const cardsEl = document.getElementById("bd-cards");
cards.forEach(c => {
  const d = document.createElement("div");
  d.className = "bd-card";
  d.style.backgroundImage = `url(${c.img})`;
  d.innerHTML = `<div class="bd-shade"></div><h4>${c.title}</h4>`;
  d.addEventListener("click", () => showPage(c.key));
  cardsEl.appendChild(d);
});
document.getElementById("bd-scroll-btn").addEventListener("click", () => {
  document.getElementById("bd-home").scrollTo({ top: window.innerHeight, behavior: "smooth" });
});

/* ==== Memories gallery ==== */
const galleryEl = document.getElementById("bd-gallery");
memories.forEach((m,i) => {
  const d = document.createElement("div");
  d.className = "bd-photo";
  d.innerHTML = `<img src="${m.img}" alt="Memory ${i+1}"/><p>${m.cap}</p>`;
  galleryEl.appendChild(d);
});

/* ==== Letter ==== */
const envelope = document.getElementById("bd-envelope");
envelope.addEventListener("click", () => {
  document.getElementById("bd-letter-closed").style.display = "none";
  document.getElementById("bd-letter-open").style.display = "block";
});

/* ==== Playlist ==== */
const audio = document.getElementById("bd-audio");
audio.volume = 1.0;

const songTitleEl = document.getElementById("bd-song-title");
const songCaptionEl = document.getElementById("bd-song-caption");
const songListEl = document.getElementById("bd-song-list");
const playBtn = document.getElementById("bd-play");

let songIdx = 0;
let playing = false;

function renderSongList(){
  songListEl.innerHTML = "";
  songs.forEach((s,i) => {
    const d = document.createElement("div");
    d.className = "bd-songItem" + (i === songIdx ? " active" : "");
    d.textContent = "❤️ " + s.title;
    d.addEventListener("click", () => { songIdx = i; playing = true; loadCurrentSong(); });
    songListEl.appendChild(d);
  });
}
function loadCurrentSong() {
    const s = songs[songIdx];

    songTitleEl.textContent = s.title;
    songCaptionEl.textContent = s.caption;

    audio.src = s.url;

    if (playing) {
        audio.load();
        audio.play().catch(err => console.log(err));
    }

    updatePlayBtn();
    renderSongList();
}

function updatePlayBtn(){ playBtn.textContent = playing ? "⏸" : "▶"; }
function pauseAudio(){ playing = false; audio.pause(); updatePlayBtn(); }

playBtn.addEventListener("click", () => {
  playing = !playing;
  if (playing) audio.play().catch(() => { playing = false; updatePlayBtn(); });
  else audio.pause();
  updatePlayBtn();
});
document.getElementById("bd-next").addEventListener("click", () => { songIdx = (songIdx+1) % songs.length; loadCurrentSong(); });
document.getElementById("bd-prev").addEventListener("click", () => { songIdx = (songIdx-1+songs.length) % songs.length; loadCurrentSong(); });
audio.addEventListener("ended", () => { songIdx = (songIdx+1) % songs.length; playing = true; loadCurrentSong(); });
document.getElementById("bd-playlist-back").addEventListener("click", () => { pauseAudio(); showPage("home"); });
renderSongList();

/* ==== Video ==== */
const videoEl = document.getElementById("bd-video-el");
function pauseVideo(){ try { videoEl.pause(); } catch(e){} }

/* ==== Cake ==== */
const candlesEl = document.getElementById("bd-candles");
const cakeMsg = document.getElementById("bd-cake-msg");
const blowBtn = document.getElementById("bd-blow-btn");
let flames = [true,true,true,true,true];
function renderCandles(){
  candlesEl.innerHTML = "";
  flames.forEach(on => {
    const f = document.createElement("div");
    f.className = "bd-flame" + (on ? "" : " out");
    candlesEl.appendChild(f);
  });
  const anyLit = flames.some(f => f);
  blowBtn.textContent = anyLit ? "Blow The Candles 🕯️" : "Relight 🔥";
}
blowBtn.addEventListener("click", () => {
  if (flames.some(f => f)) {
    flames.forEach((_,i) => {
      setTimeout(() => {
        flames[i] = false; renderCandles();
        if (i === flames.length - 1) setTimeout(() => cakeMsg.textContent = "Your wish is safe with me. ❤️", 400);
      }, i * 250);
    });
  } else {
    flames = [true,true,true,true,true]; cakeMsg.textContent = ""; renderCandles();
  }
});
renderCandles();

/* ==== Final restart ==== */
document.getElementById("bd-restart").addEventListener("click", () => {
  pwInput.value = "";
  document.getElementById("bd-letter-closed").style.display = "block";
  document.getElementById("bd-letter-open").style.display = "none";
  flames = [true,true,true,true,true]; cakeMsg.textContent = ""; renderCandles();
  showPage("landing");
});

