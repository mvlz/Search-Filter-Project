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
                const songName = document.querySelector(".song-name");
                const songSinger = document.querySelector(".song-singer");
                // console.log(musicTotalTime.innerText)
                if (parseInt(e.target.dataset.id) === parseInt(music.id)) {
                    musicPlayer.style.backgroundImage = `URL(${music.image})`;
                    musicTotalTime.innerText = music.duration;
                    songName.innerText = music.title;
                    songSinger.innerText = music.singer;
                }
            });
        });
    });

}