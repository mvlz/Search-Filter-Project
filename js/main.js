import {musicData} from './musics.js';

const searchInput = document.querySelector(".search-input");
const musicContainer = document.querySelector(".musics-content");
const categoriesBtns = document.querySelectorAll(".btn");
const playPauseBtn = document.querySelector(".play-stop");
const musicPlayerTag = document.querySelector(".player");
const musicPlayerDiv = document.querySelector(".music-player");
const musicTotalTime = document.querySelector(".music-Time");
const musicPassedTime = document.querySelector(".music-passed-time");
const songName = document.querySelector(".song-name");
const equalizer = document.querySelector(".equaliser-container");
const lineProgress = document.querySelector(".line-progress");
const songSinger = document.querySelector(".song-singer");

let allMusicsData = [];
const filters = {
  searchItems: "",
};
// document.addEventListener("DOMContentLoaded", () => {
//   axios
//     .get("http://localhost:3000/items")
//     .then((res) => {
//       allMusicsData = res.data;
//       renderMusics(res.data, filters);
//     })
//     .catch((err) => console.log(err));
// });
function getMusics(){
  return musicData;
}
document.addEventListener("DOMContentLoaded", () => {
  allMusicsData = getMusics();
  renderMusics(allMusicsData, filters);
})

function renderMusics(musics, filters) {
  const filteredMusics = musics.filter((music) => {
    return (
      music.title.toLowerCase().includes(filters.searchItems.toLowerCase()) ||
      music.category
        .toLowerCase()
        .includes(filters.searchItems.toLowerCase()) ||
      music.singer.toLowerCase().includes(filters.searchItems.toLowerCase())
    );
  });
  // console.log(filteredMusics);
  musicContainer.innerHTML = "";

  filteredMusics.forEach((item) => {
    const musicDiv = document.createElement("div");
    musicDiv.classList.add("music-item", "w-36", "rounded-xl", "relative");
    musicDiv.innerHTML = `
        <div class="music-img w-full h-3/4 overflow-hidden rounded-xl">
            <img src=${item.image} alt="" class="h-full object-cover w-full">
        </div>
        <div class="music-inf w-full h-1/4 p-2 flex flex-col justify-between">
            <h3 class="music-name text-sm">${item.title}</h3>
            <div class="flex justify-between">
                <p class="music-singer text-gray-400">${item.singer}</p>
                <p class="music-timeline text-right text-gray-500 pr-2">${item.duration}</p>
            </div>
        </div>
        <button class="play-btn w-10 h-10 rounded-full  fas fa-play fa-lg absolute bottom-7 right-3" data-id="${item.id}"></button>
        `;
    musicContainer.appendChild(musicDiv);
    playMusic(filteredMusics);
  });
}

searchInput.addEventListener("input", (e) => {
  filters.searchItems = e.target.value;
  renderMusics(allMusicsData, filters);
});

categoriesBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // btn.classList.remove('active');
    // if (btn.dataset.filter === e.target.dataset.filter) {
    //     btn.classList.add('active');
    // } else {
    //     btn.classList.remove('active');
    // }
    const category = e.target.dataset.filter;
    filters.searchItems = category;
    renderMusics(allMusicsData, filters);
  });
});

function selectedMusicPlay(music) {
  musicPlayerDiv.style.backgroundImage = `URL(${music.image})`;
  musicTotalTime.innerText = music.duration;
  songName.innerText = music.title;
  songSinger.innerText = music.singer;
  musicPlayerTag.src = music.URL;
  musicPlayerTag.play();
  addPauseStyle();
}

function playMusic(musics) {
  const playBtns = document.querySelectorAll(".play-btn");

  playBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const selectedItem = musics.find(
        (music) => parseInt(e.target.dataset.id) === parseInt(music.id)
      );
      selectedMusicPlay(selectedItem);
      musicDetails(selectedItem);
      // console.log(selectedItem);
    });
  });
}
musicPlayerTag.addEventListener("ended", () => {
  addPlayStyle();
});

document.querySelector(".line").addEventListener("click", function (event) {
  let coordStart = this.getBoundingClientRect().left;
  let coordEnd = event.pageX;
  let p = (coordEnd - coordStart) / this.offsetWidth;
  // now.style.width = p.toFixed(3) * 100 + '%'
  musicPlayerTag.currentTime = p * musicPlayerTag.duration;
  musicPlayerTag.play();
  addPauseStyle();
});

function musicDetails(music) {
  musicPlayerTag.addEventListener("timeupdate", () => {
    const duration = timeToNumber(music.duration).toFixed(2);
    let currentTimeNum = musicPlayerTag.currentTime.toFixed(0);
    const playPercent = ((currentTimeNum / duration) * 100).toFixed(1);
    lineProgress.style.width = `${playPercent}%`;
    const currentTimeMin = msConversion(currentTimeNum * 1000);
    musicPassedTime.textContent = currentTimeMin;
    // console.log(playPercent)
    // musicPassedTime.textContent = msConversion(musicPlayerTag.currentTime * 1000);
  });
}

function timeToNumber(number) {
  let minToSec = parseInt(number.split(":")[0] * 60);
  let sec = parseInt(number.split(":")[1]);
  const totalsec = sec + minToSec;
  return totalsec;
}

function msConversion(millis) {
  let sec = Math.floor(millis / 1000);
  let hrs = Math.floor(sec / 3600);
  sec -= hrs * 3600;
  let min = Math.floor(sec / 60);
  sec -= min * 60;

  sec = "" + sec;
  sec = ("00" + sec).substring(sec.length);

  min = "" + min;
  min = ("00" + min).substring(min.length);
  if (hrs > 0) {
    return hrs + ":" + min + ":" + sec;
  } else {
    return min + ":" + sec;
  }
}

function updateProgress() {
  var current = player.currentTime;
  var percent = (current / player.duration) * 100;
  progress.style.width = percent + "%";

  currentTime.textContent = formatTime(current);
}
function togglePlay() {
  switch (playPauseBtn.classList.contains("fa-play")) {
    case true:
      musicPlayerTag.play();
      addPauseStyle();
      break;
    case false:
      musicPlayerTag.pause();
      addPlayStyle();
      break;
  }
}

function addPlayStyle() {
  playPauseBtn.classList.remove("fa-pause");
  playPauseBtn.classList.add("fa-play");
  equalizer.style.display = "none";
}

function addPauseStyle() {
  playPauseBtn.classList.remove("fa-play");
  playPauseBtn.classList.add("fa-pause");
  equalizer.style.display = "block";
}

playPauseBtn.addEventListener("click", togglePlay);
