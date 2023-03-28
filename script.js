const weatherModel = {
    apiKey: "dc6c2ded3a6f7a164b3f31f626c643ba",
    getWeather: async function(city) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`);
        // If the response is not OK (i.e., the city was not found), throw an error
        if (!response.ok) {
            throw new Error("Please enter a valid city.");
        }
        // Otherwise, parse the response as JSON and return an object with weather data
        const data = await response.json();
        return {
            name: data.name,
            icon: data.weather[0].icon,
            description: data.weather[0].description,
            temp: Math.round(data.main.temp),
            temp_min: Math.round(data.main.temp_min),
            temp_max: Math.round(data.main.temp_max),
            humidity: data.main.humidity,
            speed: data.wind.speed
        };
    }
};

// Define the weatherView object, which contains references to various elements on the page
const weatherView = {
    city: document.querySelector("#city"),
    icon: document.querySelector("img"),
    description: document.querySelector("#description"),
    temp: document.querySelector("#temp"),
    min: document.querySelector("#min"),
    max: document.querySelector("#max"),
    humidity: document.querySelector("#humidity"),
    wind: document.querySelector("#wind"),
    searchBox: document.querySelector(".search-box"),
    weatherBox: document.querySelector(".weather-box"),
    weatherDetails: document.querySelector(".weather-details"),
    loadingSpinner: document.querySelector(".loading-spinner"),

    // Show a loading spinner on the page
    showSpinner: function() {
        this.loadingSpinner.style.display = "block";
    },
    
    // Hide the loading spinner on the page
    hideSpinner: function() {
        this.loadingSpinner.style.display = "none";
    },
    
    // Update the page with weather data and a background image
    displayWeather: function(data, backgroundImage) {
        this.city.innerText = data.name;
        this.icon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
        this.description.innerText = data.description;
        this.temp.innerText = `${data.temp}°C`;
        this.max.innerText = `H:${data.temp_max}°C`;
        this.min.innerText = `L:${data.temp_min}°C`;
        this.humidity.innerText = `${data.humidity}%`;
        this.wind.innerText = `${data.speed} km/h`;
        document.body.style.backgroundImage = `url('${backgroundImage}')`;
        this.weatherBox.style.display = "block";
        this.weatherDetails.style.display = "flex";
    },

    // Display an error message to the user
    displayError: function(message) {
        alert(message);
    },

    // Reset the search input field
    resetSearch: function() {
        this.searchBox.querySelector("input").value = "";
    }
};

// Define the weatherController object, which handles user input and interacts with the other objects
const weatherController = {
    // Perform a search for weather data when the user clicks the search button or hits enter
    search: async function() {
        const city = document.querySelector("#search-bar").value;
        try {
            weatherView.showSpinner();
            const data = await weatherModel.getWeather(city);
            const backgroundImage = `https://source.unsplash.com/1600x900/?${city}`;
			weatherView.displayWeather(data, backgroundImage);
			weatherView.resetSearch();
		} catch (error) {
			weatherView.displayError(error.message);
		} finally {
			weatherView.hideSpinner();
		}
	},

    enter: function() {
        document.querySelector("#search-btn").addEventListener("click", () => this.search());
        document.querySelector("#search-bar").addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                this.search();
            }
        });
    }
};

weatherController.enter();