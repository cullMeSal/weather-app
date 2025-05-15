import "./App.css";
import { useState, useEffect } from "react";
import LocationSearchBar from "./components/LocationSearchBar";
import { getCurrWeatherData, getForecastData, getHourlyWeatherData, } from "./utilities/WeatherService";
import ForecastBlock from "./components/ForecastBlock";
import DescBlock from "./components/DescBlock";
import TempChart from "./components/TempChart";

function App() {
  const DEFAULT_FORECAST = {
    time: ["2025-02-23T00:00", "2025-02-23T01:00"],
    temp: [0, 0],
  };
  const HANOI_LOCATION = {
    lat: 21.0245,
    lon: 105.8412,
    display_place: "Hanoi",
  };

  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState("");
  const [todayHourlyTemperatureForecast, setTodayHourlyTemperatureForecast] = useState(DEFAULT_FORECAST);
  const [day2HourlyTemperatureForecast, setDay2HourlyTemperatureForecast] = useState(DEFAULT_FORECAST);
  const [day3HourlyTemperatureForecast, setDay3HourlyTemperatureForecast] = useState(DEFAULT_FORECAST);
  const [day4HourlyTemperatureForecast, setDay4HourlyTemperatureForecast] = useState(DEFAULT_FORECAST);
  const [next4DayForecast, setNext4DayForecast] = useState({
    description: [],
    iconSrc: [],
    date: [],
    temp_max: [],
    temp_min: [],
  });
  const [units, setUnits] = useState("metric");
  // Utility useStates for visuals
  const [loading, setLoading] = useState(false);
  const [forecastDescVis, setForecastDescVis] = useState(false);
  const [forecastChartDay, setForecastChartDay] = useState(0);


  const handleLocationSelect = async (place) => {
    setLocation(place);
    console.log(place);
  };

  const handleUnitChange = async () => {
    await setUnits(units === "metric" ? "imperial" : "metric");
  };

  useEffect(() => {
    // Fetching/Updating main weather data whenever location or unit value is changed.
    const fetchWeatherData = async () => {
      setLoading(true);

      if (location === null) {
        // RUN WITH HANOI'S LOCATION WHEN NO LOCATION IS SET YET
        setLocation({
          lat: 21.0245,
          lon: 105.841,
          display_place: "Hanoi",
        });
        let data = await getCurrWeatherData(
          HANOI_LOCATION.lat,
          HANOI_LOCATION.lon,
          units
        );
        // Get basic forecast data, just max/min temp and weather code. Because daily data API and hourly data API are different :)
        let forecastData = await getForecastData(
          HANOI_LOCATION.lat,
          HANOI_LOCATION.lon,
          units
        );
        // Get hourly forecast data (temperature) for today & next 3 days (4 in total).
        let tempForecastData = await getHourlyWeatherData(
          HANOI_LOCATION.lat,
          HANOI_LOCATION.lon,
          units
        );
        console.log(tempForecastData);
        setWeather(data);
        // Assign forecast data for displaying
        setNext4DayForecast(forecastData);
        setTodayHourlyTemperatureForecast(tempForecastData.today);
        setDay2HourlyTemperatureForecast(tempForecastData.dayTwo);
        setDay3HourlyTemperatureForecast(tempForecastData.dayThree);
        setDay4HourlyTemperatureForecast(tempForecastData.dayFour);
        console.log(weather);
        console.log(next4DayForecast);

        setTimeout(() => setLoading(false), 500);
      } else {
        let data = await getCurrWeatherData(location.lat, location.lon, units);
        // Get basic forecast data, just max/min temp and weather code. Because daily data API and hourly data API are different :)
        let forecastData = await getForecastData(location.lat, location.lon, units);
        // Get hourly forecast data (temperature) for today & next 3 days (4 in total).
        let tempForecastData = await getHourlyWeatherData(
          location.lat,
          location.lon,
          units
        );
        setWeather(data);
        // Assign forecast data for displaying
        setNext4DayForecast(forecastData);
        setTodayHourlyTemperatureForecast(tempForecastData.today);
        setDay2HourlyTemperatureForecast(tempForecastData.dayTwo);
        setDay3HourlyTemperatureForecast(tempForecastData.dayThree);
        setDay4HourlyTemperatureForecast(tempForecastData.dayFour);
        console.log(weather);
        console.log(next4DayForecast);
        console.log(day2HourlyTemperatureForecast);

        setTimeout(() => setLoading(false), 500);
      }
    };
    fetchWeatherData();
  }, [location, units]);

  const switchForecastDescState = () => {
    if (forecastDescVis) setForecastDescVis(false);
    else setForecastDescVis(true);
  };

  // Format the fetched display name to be shorter for displaying (First & last location name only)
  const formatDisplayName = (name) => { 
    if (!name) return;
    let splittedName = name.split(", ");
    return `${splittedName[0]}, ${splittedName[splittedName.length - 1]}`;
  };

  return (
    <div className="App">
      <div className={`overlay ${loading ? "fade-in" : "fade-out"}`}></div>

      <div id="container">
        <hr></hr>
        <div id="current">
          <div>
            <div id="curr-head">
              <div className="temp-location">
                <div>
                  <h1 id="curr-temp">{weather.temp}</h1>
                  <button id="displayed-unit" onClick={handleUnitChange}>
                    {units === "metric" ? "°C" : "°F"}
                  </button>
                </div>
                <p id="location-name">
                  {location === null
                    ? "Hanoi"
                    : formatDisplayName(location.display_name)}
                </p>
              </div>

              <div id="search-bar">
                <LocationSearchBar
                  onLocationSelect={handleLocationSelect}
                ></LocationSearchBar>
              </div>
            </div>
            <div id="curr-tail">
              <div className="curr-desc">
                <p id="weather-state">{weather.description}</p>
              </div>
              <div className="temp-in-day">
                <TempChart
                  tempData={todayHourlyTemperatureForecast}
                  tempUnit={units}
                  isToday={1}
                ></TempChart>
              </div>
              <div className="curr-icon">
                <img src={weather.iconSrc} alt="icon of current weather"></img>
              </div>
            </div>
          </div>
        </div>
        <hr></hr>
        <div id="descriptions">
          <DescBlock
            title="Feels like"
            iconSrc="/weather-app/icons/icon_temperature.png"
            value={weather.feels_like}
            unit={units === "metric" ? "°C" : "°F"}
          ></DescBlock>
          <DescBlock
            title="Humidity"
            iconSrc="/weather-app/icons/icon_humidity.png"
            value={weather.humidity}
            unit="%"
          ></DescBlock>
          <DescBlock
            title="Wind"
            iconSrc="/weather-app/icons/icon_wind.png"
            value={weather.wind_speed}
            unit="m/s"
            wind_dir={weather.wind_direction}
          ></DescBlock>
          <DescBlock
            title="Pressure"
            iconSrc="/weather-app/icons/icon_pressure.png"
            value={weather.pressure}
            unit="hPa"
          ></DescBlock>
        </div>
        <hr></hr>
        <div id="forecast">
          <ForecastBlock
            onClick={() => {
              switchForecastDescState();
              setForecastChartDay(1);
            }}
            date={next4DayForecast.date[1]}
            temp_min={next4DayForecast.temp_min[1]}
            temp_max={next4DayForecast.temp_max[1]}
            icon={next4DayForecast.iconSrc[1]}
          ></ForecastBlock>
          <ForecastBlock
            onClick={() => {
              switchForecastDescState();
              setForecastChartDay(2);
            }}
            date={next4DayForecast.date[2]}
            temp_min={next4DayForecast.temp_min[2]}
            temp_max={next4DayForecast.temp_max[2]}
            icon={next4DayForecast.iconSrc[2]}
          ></ForecastBlock>
          <ForecastBlock
            onClick={() => {
              switchForecastDescState();
              setForecastChartDay(3);
            }}
            date={next4DayForecast.date[3]}
            temp_min={next4DayForecast.temp_min[3]}
            temp_max={next4DayForecast.temp_max[3]}
            icon={next4DayForecast.iconSrc[3]}
          ></ForecastBlock>
          <div id="credit" /*:)*/>
            <p>Product</p>
            <p>of</p>
            <p>Sal.</p>
          </div>
          <div
            className={`forecast-desc ${
              forecastDescVis ? "" : "forecast-desc-invis"
            }`}
            onClick={switchForecastDescState}
          >
            <h2 className="fc-date">{next4DayForecast.date[forecastChartDay]}</h2>
            <img
              src={next4DayForecast.iconSrc[forecastChartDay]}
              className="forecast-desc-icon"
              alt="forecasted weather"
            ></img>
            <div id="forecast-temp-chart">
              <TempChart
                tempData={
                  forecastChartDay === 1
                    ? day2HourlyTemperatureForecast
                    : forecastChartDay === 2
                    ? day3HourlyTemperatureForecast
                    : day4HourlyTemperatureForecast
                }
                tempUnit={units}
                isToday={0}
              ></TempChart>
            </div>
          </div>
        </div>
        <hr></hr>
      </div>
    </div>
  );
}

export default App;
