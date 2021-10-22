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
        })
        .catch((err) => console.log(err));
});

function renderMusics(musics, filters) {
    const filteredMusics = musics.filter((music) => {
        return music.title.toLowerCase().includes(filters.searchItems.toLowerCase()) || music.category.toLowerCase().includes(filters.searchItems.toLowerCase())
        ||  music.singer.toLowerCase().includes(filters.searchItems.toLowerCase());
    });
    console.log(filteredMusics);
    musicContainer.innerHTML = "";
    filteredMusics.forEach(item => {
        const musicDiv = document.createElement("div");
        musicDiv.classList.add("music-item", "w-1/6", "h-1/3", "rounded-xl", "relative");
        musicDiv.innerHTML = `
        <div class="music-img w-full h-2/3 overflow-hidden rounded-xl">
            <img src=${item.image} alt="" class="w-full">
        </div>
        <div class="music-inf w-full h-1/3 p-2">
            <h3 class="music-name">${item.title}</h3>
            <p class="music-singer">${item.singer}</p>
            <p class="music-timeline text-right">${item.duration}</p>
        </div>
        <button class="play-btn w-10 h-10 rounded-full bg-purple-800 fas fa-play fa-lg absolute bottom-1/4 right-4"></button>
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
