const songNameInput = document.getElementById("songName");
const chordsInput = document.getElementById("chords");
const addBtn = document.getElementById("addBtn");
const songList = document.getElementById("songList");
const searchInput = document.getElementById("searchInput");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");
const clearAllBtn = document.getElementById("clearAllBtn");

let songs = JSON.parse(localStorage.getItem("songs") || "{}");

function saveSongs() {
  localStorage.setItem("songs", JSON.stringify(songs));
}

function renderSongList(filter = "") {
  songList.innerHTML = "";

  Object.keys(songs)
    .filter((name) => name.toLowerCase().includes(filter.toLowerCase()))
    .sort()
    .forEach((name) => {
      const li = document.createElement("li");
      li.className = "bg-gray-800 p-3 rounded shadow";

      li.innerHTML = `
        <div class="flex justify-between items-center mb-1">
          <span class="font-bold text-accent">${name}</span>
          <div class="flex gap-2">
            <button class="btn btn-xs btn-info" data-action="edit" data-name="${name}">Ver</button>
            <button class="btn btn-xs btn-error" data-action="delete" data-name="${name}">Eliminar</button>
          </div>
        </div>
        <pre class="whitespace-pre-wrap text-sm">${songs[name]}</pre>
      `;

      songList.appendChild(li);
    });
}

addBtn.onclick = () => {
  const name = songNameInput.value.trim();
  const chords = chordsInput.value.trim();

  if (!name || !chords) return;

  songs[name] = chords;
  saveSongs();
  renderSongList(searchInput.value);
  songNameInput.value = "";
  chordsInput.value = "";
  showToast("Canción guardada", "success");
};

songList.onclick = (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const name = btn.dataset.name;

  if (action === "edit") {
    songNameInput.value = name;
    chordsInput.value = songs[name];
  } else if (action === "delete") {
    delete songs[name];
    saveSongs();
    renderSongList(searchInput.value);
    showToast("Canción eliminada", "warning");
  }
};

searchInput.addEventListener("input", (e) => {
  const filter = e.target.value.trim().toLowerCase();
  renderSongList(filter);
});

exportBtn.onclick = () => {
  const all = Object.entries(songs)
    .map(([name, chords]) => `${name}\n${chords}\n---`)
    .join("\n");

  const blob = new Blob([all], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "progresiones.txt";
  a.click();
  URL.revokeObjectURL(url);

  showToast("Exportación completada", "success");
};

importInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    const entries = text.split("\n---").map(entry => entry.trim()).filter(Boolean);

    for (let entry of entries) {
      const [nameLine, ...chordLines] = entry.split("\n");
      let name = nameLine.trim();
      const chords = chordLines.join("\n").trim();

      if (!name || !chords) continue;

      let finalName = name;
      let counter = 1;
      while (songs[finalName]) {
        finalName = `${name}-${counter++}`;
      }

      songs[finalName] = chords;
    }

    saveSongs();
    renderSongList(searchInput.value);
    showToast("Importación completada", "success");
    this.value = "";
  };

  reader.readAsText(file);
});

clearAllBtn.onclick = () => {
  if (confirm("¿Estás seguro de que querés borrar todas las canciones?")) {
    localStorage.removeItem("songs");
    songs = {};
    renderSongList();
    showToast("Todas las canciones fueron eliminadas", "error");
  }
};

function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const div = document.createElement("div");
  div.className = `alert alert-${type}`;
  div.innerHTML = `<span>${message}</span>`;
  container.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

renderSongList();