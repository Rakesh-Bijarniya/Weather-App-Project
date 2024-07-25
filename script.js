const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const userInfoContainer = document.querySelector(".user-info-container");
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container");

const API_KEY = "cf54efd9b28e940bde1c09df11b4ea33";
let currentTab = userTab;
currentTab.classList.add("current-tab");

getfromSessionStorage();

searchTab.addEventListener('click',() => {
    switchTab(searchTab);
})
userTab.addEventListener('click',() => {
    switchTab(userTab);
})

function switchTab(newTab){
    if(newTab != currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab = newTab;
        currentTab.classList.add("current-tab");
        
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }   
}

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("userInfo");
    if (localCoordinates) {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
    else{
        grantAccessContainer.classList.add("active");
    }
}

const grantAccessButton = document.querySelector("[data-grantAccess-btn]");
grantAccessButton.addEventListener('click',getLocation);
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback);
    }
    else{
        alert('Your Phone is not support geolocation !');
    }
}
function successCallback(p){
    const userCoordinates = {
        lat: p.coords.latitude,
        lon: p.coords.longitude,
    }
    sessionStorage.setItem('userInfo', JSON.stringify(userCoordinates) );

    getfromSessionStorage();
}

async function fetchUserWeatherInfo(coordinates) {
    let {lat,lon} = coordinates;

    grantAccessContainer.classList.remove("active");

    loadingScreen.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } 
    catch (err) {
        console.log('error');
        loadingScreen.classList.remove("active");
        
        const errorImg = document.querySelector('[error-found]');
        errorImg.classList.add("active");
        errorImg.src = `.\images\not-found.png`;
    }
}
function renderWeatherInfo(data) {
    const cityName = document.querySelector("[data-cityName]")
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerHTML = data?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    desc.innerHTML = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerHTML = `${data?.main?.temp} °C`;
    windspeed.innerHTML = `${data?.wind?.speed} m/s`;
    humidity.innerHTML = `${data?.main?.humidity} %`;
    cloudiness.innerHTML = `${data?.clouds?.all} %`;
}

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit',(event) => {
    event.preventDefault();
    let cityName = searchInput.value;

    if (cityName == "") {
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }

})

async function fetchSearchWeatherInfo(cityName) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    } 
    catch (err) {
        console.log('error'+err);
        loadingScreen.classList.remove("active");

        const errorImg = document.querySelector('[error-found]');
        errorImg.classList.add("active");
        errorImg.src = "not-found.png";
    }
    
}