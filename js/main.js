const searchInput = document.querySelector(".search-input");
const musicContainer = document.querySelector(".musics-content");
const categoriesBtns = document.querySelectorAll(".btn");
let allMusicsData = [];
const filters = {
    searchItems: "",
};
document.addEventListener("DOMContentLoaded", () => {
    axios
        .get("http://localhost:3000/items")
        .then((res) => {
            allMusicsData = res.data;
            renderMusics(res.data, filters);
            playMusic(res.data);
        })
        .catch((err) => console.log(err));
});

function renderMusics(musics, filters) {
    const filteredMusics = musics.filter((music) => {
        return music.title.toLowerCase().includes(filters.searchItems.toLowerCase()) || music.category.toLowerCase().includes(filters.searchItems.toLowerCase()) ||
            music.singer.toLowerCase().includes(filters.searchItems.toLowerCase());
    });
    console.log(filteredMusics);
    musicContainer.innerHTML = "";
    filteredMusics.forEach(item => {
        const musicDiv = document.createElement("div");
        musicDiv.classList.add("music-item", "w-1/6", "rounded-xl", "relative");
        musicDiv.innerHTML = `
        <div class="music-img w-full h-3/4 overflow-hidden rounded-xl">
            <img src=${item.image} alt="" class="w-full">
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
    });
}
searchInput.addEventListener("input", (e) => {
    // console.log(e.target.value)
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
    })
})


function playMusic(musics) {
    musics.forEach(music => {
        // console.log(music)
        const playBtns = document.querySelectorAll(".play-btn");

        playBtns.forEach(btn => {
            // console.log(btn.dataset.id);
            btn.addEventListener("click", (e) => {
                const musicPlayer = document.querySelector(".music-player");
                const musicTotalTime = document.querySelector(".music-Time");
                const musicPassedTime = document.querySelector(".music-passed-time");
                const songName = document.querySelector(".song-name");
                const songSinger = document.querySelector(".song-singer");
                // console.log(musicTotalTime.innerText)
                if (parseInt(e.target.dataset.id) === parseInt(music.id)) {
                    musicPlayer.style.backgroundImage = `URL(${music.image})`;
                    musicTotalTime.innerText = music.duration;
                    songName.innerText = music.title;
                    songSinger.innerText = music.singer;
                    // lineProgress.style.width = passedTime;

                    const playPauseBtn = document.querySelector(".play-stop");
                    let audio = new Audio(music.URL);
                    audio.play();
                    playPauseBtn.classList.remove("fa-play");
                    playPauseBtn.classList.add("fa-pause");

                    playPauseBtn.addEventListener("click", () => {
                        if (playPauseBtn.classList.contains("fa-play")) {
                            audio.play();
                            playPauseBtn.classList.remove("fa-play");
                            playPauseBtn.classList.add("fa-pause");
                        } else if (playPauseBtn.classList.contains("fa-pause")) {
                            audio.pause();
                            playPauseBtn.classList.remove("fa-pause");
                            playPauseBtn.classList.add("fa-play");
                        }
                    })

                    // let number = "04:50"
                    // let minToSec = parseInt(music.duration.split(":")[0] * 60);
                    // let sec = parseInt(music.duration.split(":")[1]);
                    // const totalSec = sec + minToSec;
                    // console.log(totalSec);
                    
                    const lineProgress = document.querySelector(".line-progress");
                    setInterval(() => {
                        const duration = timeToNumber (music.duration)
                        const playPercent = (audio.currentTime / duration) * 100;
                        // console.log(parseInt(music.duration))
                        lineProgress.style.width = `${playPercent}%`;
                        const currentTime = msConversion(audio.currentTime * 1000)
                        musicPassedTime.innerText = currentTime;
                    }, 1000);

                }
            });
        });
    });

}

// function millisToMinutesAndSeconds(millis) {
//     let minutes = Math.floor(millis / 60);
//     let seconds = ((millis % 60) / 1).toFixed(0);
//     return minutes + ":" + (seconds < 1 ? '00' : '') + seconds;
//   }



function timeToNumber (number){
//   let number = "03:33";
  let minToSec = parseInt(number.split(":")[0] * 60);
  let sec = parseInt(number.split(":")[1]);
  return totalSec = sec + minToSec;
}

function msConversion(millis) {
    let sec = Math.floor(millis / 1000);
    let hrs = Math.floor(sec / 3600);
    sec -= hrs * 3600;
    let min = Math.floor(sec / 60);
    sec -= min * 60;
  
    sec = '' + sec;
    sec = ('00' + sec).substring(sec.length);
  
    min = '' + min;
    min = ('00' + min).substring(min.length);
    if (hrs > 0) {
      return hrs + ":" + min + ":" + sec;
    }
    else {
      return min + ":" + sec;
    }
  }