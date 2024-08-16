const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorId=document.querySelector(".notfound");

let currentTab=userTab;
const API_KEY="600287a9baff7ce92ce7391a41dae17d";
currentTab.classList.add("current-tab");
getfromSessionStorage();  //aha pe hamne ye check kr liya ki kahi paehle se koi coordiante pada to nhi hai

function switchTab(clickedTab)
{
     if(clickedTab != currentTab)
     {
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
     
     if(!searchForm.classList.contains("active"))
     {
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
     }
     else
     {
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();
     }
    }
}

function getfromSessionStorage() {
       const localCoordinates=sessionStorage.getItem("user-coordinates");
       if(!localCoordinates)
       {
        grantAccessContainer.classList.add("active");
       }
       else{
          const coordinates=JSON.parse(localCoordinates);
          fetchUserWeatherInfo(coordinates);
       }
}

async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon}=coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    errorId.classList.remove("active");

    try{
        const response=await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        if (!data.sys) {
            throw data;
          }
    }
    catch(err)
    {
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        errorId.classList.add("active");
    }
}

function renderWeatherInfo(weatherInfo)
{
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.main;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;
}

userTab.addEventListener("click", ()=> {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getLocation() {
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showPosition);    
    }
    else
    {

    }
}

function showPosition(position)
{
    const userCoordinates= {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput=document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName === "")
    {
        return;
    }
    else
    {
        fetchsearchWeatherinfo(cityName);
    }
});

async function fetchsearchWeatherinfo(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorId.classList.remove("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        if (!data.sys) {
            throw data;
          }
    }
    catch(err)
    {
        userInfoContainer.classList.remove("active");
        loadingScreen.classList.remove("active");
        errorId.classList.add("active");
    }
}