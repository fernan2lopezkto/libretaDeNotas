document.addEventListener("DOMContentLoaded", () => {
  const songNameInput = document.getElementById("songName");
  const chordsInput = document.getElementById("chords");
  const saveBtn = document.getElementById("saveBtn");
  const songList = document.getElementById("songList");
  const searchInput = document.getElementById("searchInput");
  const display = document.getElementById("display");
  const displayTitle = document.getElementById("displayTitle");
  const displayChords = document.getElementById("displayChords");
  const editBtn = document.getElementById("editBtn");
  const deleteBtn = document.getElementById("deleteBtn");

  let songs = JSON.parse(localStorage.getItem("songs") || "{}");
  let currentSong = null;

  function saveSongs() {
    localStorage.setItem("songs", JSON.stringify(songs));
  }

  function renderSongList(filter = "") {
    songList.innerHTML = "";
    Object.keys(songs)
      .filter(name => name.toLowerCase().includes(filter.toLowerCase()))
      .sort()
      .forEach((name) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = name;
        a.classList.add("hover:text-success");
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
      renderSongList(searchInput.value);
      songNameInput.value = "";
      chordsInput.value = "";
      display.classList.add("hidden");
    }
  };

  editBtn.onclick = () => {
    if (currentSong) {
      songNameInput.value = currentSong;
      chordsInput.value = songs[currentSong];
      display.classList.add("hidden");
    }
  };

  deleteBtn.onclick = () => {
    if (currentSong && confirm(`¿Eliminar "${currentSong}"?`)) {
      delete songs[currentSong];
      saveSongs();
      renderSongList(searchInput.value);
      display.classList.add("hidden");
      currentSong = null;
    }
  };

  searchInput.addEventListener("input", () => {
    renderSongList(searchInput.value);
  });

  renderSongList();
});