const songNameInput = document.getElementById("songName");
const chordsInput = document.getElementById("chords");
const saveBtn = document.getElementById("saveBtn");
const songList = document.getElementById("songList");
const display = document.getElementById("display");
const displayTitle = document.getElementById("displayTitle");
const displayChords = document.getElementById("displayChords");
const editBtn = document.getElementById("editBtn");

let songs = JSON.parse(localStorage.getItem("songs") || "{}");
let currentSong = null;

function saveSongs() {
  localStorage.setItem("songs", JSON.stringify(songs));
}

function renderSongList() {
  songList.innerHTML = "";
  Object.keys(songs)
    .sort()
    .forEach((name) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = name;
      a.onclick = () => showSong(name);
      li.appendChild(a);
      songList.appendChild(li);
    });
}

function showSong(name) {
  currentSong = name;
  displayTitle.textContent = name;
  displayChords.textContent = songs[name];
  display.classList.remove("hidden");
}

saveBtn.onclick = () => {
  const name = songNameInput.value.trim();
  const chords = chordsInput.value.trim();
  if (name && chords) {
    songs[name] = chords;
    saveSongs();
    renderSongList();
    songNameInput.value = "";
    chordsInput.value = "";
  }
};

editBtn.onclick = () => {
  if (currentSong) {
    songNameInput.value = currentSong;
    chordsInput.value = songs[currentSong];
    display.classList.add("hidden");
  }
};

renderSongList();