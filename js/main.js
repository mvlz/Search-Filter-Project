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
                const musicPlayerDiv = document.querySelector(".music-player");
                const musicTotalTime = document.querySelector(".music-Time");
                const musicPassedTime = document.querySelector(".music-passed-time");
                const songName = document.querySelector(".song-name");
                const songSinger = document.querySelector(".song-singer");
                const musicPlayerTag = document.querySelector(".player");
                // console.log(musicTotalTime.innerText)
                if (parseInt(e.target.dataset.id) === parseInt(music.id)) {
                    musicPlayerDiv.style.backgroundImage = `URL(${music.image})`;
                    musicTotalTime.innerText = music.duration;
                    songName.innerText = music.title;
                    songSinger.innerText = music.singer;
                    musicPlayerTag.src = music.URL;
                    // lineProgress.style.width = passedTime;

                    const playPauseBtn = document.querySelector(".play-stop");
                    // let audio = new Audio(music.URL);
                    musicPlayerTag.play();
                    e.target.classList.remove("fa-play");
                    e.target.classList.add("fa-pause");

                    playPauseBtn.addEventListener("click", (e) => {
                        if (e.target.classList.contains("fa-play")) {
                            musicPlayerTag.play();
                            e.target.classList.remove("fa-play");
                            e.target.classList.add("fa-pause");
                            btn.classList.remove("fa-play");
                            btn.classList.add("fa-pause");
                        } else if (e.target.classList.contains("fa-pause")) {
                            musicPlayerTag.pause();
                            e.target.classList.remove("fa-pause");
                            e.target.classList.add("fa-play");
                            btn.classList.remove("fa-pause");
                            btn.classList.add("fa-play");
                        }
                    })
                    const lineProgress = document.querySelector(".line-progress");

                    musicPlayerTag.addEventListener('timeupdate',()=>{
                        const duration = (timeToNumber (music.duration)).toFixed(2);
                        let currentTimeNum =(musicPlayerTag.currentTime).toFixed(2);
                        const playPercent = (( currentTimeNum / duration) * 100).toFixed(2);
                        lineProgress.style.width = `${playPercent}%`;
                        const currentTimeMin = msConversion(musicPlayerTag.currentTime * 1000)
                        musicPassedTime.innerText = currentTimeMin;
                    });
                    // const lineProgress = document.querySelector(".line-progress");
                    // setInterval(() => {
                    //     let currentTimeNum = 0;

                    //     const duration = (timeToNumber (music.duration)).toFixed(2);
                    //     currentTimeNum =(musicPlayerTag.currentTime).toFixed(2);
                    //     const playPercent = (( currentTimeNum / duration) * 100).toFixed(2);
                    //     lineProgress.style.width = `${playPercent}%`;
                    //     const currentTimeMin = msConversion(musicPlayerTag.currentTime * 1000)
                    //     musicPassedTime.innerText = currentTimeMin;
                    // }, 500);

                    // clearInterval(intervalID)

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


  function updateProgress() {
    var current = player.currentTime;
    var percent = (current / player.duration) * 100;
    progress.style.width = percent + '%';
    
    currentTime.textContent = formatTime(current);
  }