function getDescription(code) { //Get description from a WMO code
    const entry = wmo_code_table.find(item => item.code.includes(code));
    return entry ? entry.description : "Unknown code";
  }
function getFormattedDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
const wmo_code_table = [
    { "code": [0], "description": "Clear sky" },
    { "code": [1], "description": "Mainly clear" },
    { "code": [2], "description": "Partly cloudy" },
    { "code": [3], "description": "Overcast" },
    { "code": [45], "description": "Fog" },
    { "code": [48], "description": "Depositing rime fog" },
    { "code": [51], "description": "Light drizzle" },
    { "code": [53], "description": "Moderate drizzle" },
    { "code": [55], "description": "Dense drizzle" },
    { "code": [56], "description": "Light freezing drizzle" },
    { "code": [57], "description": "Dense freezing drizzle" },
    { "code": [61], "description": "Slight rain" },
    { "code": [63], "description": "Moderate rain" },
    { "code": [65], "description": "Heavy rain" },
    { "code": [66], "description": "Light freezing rain" },
    { "code": [67], "description": "Heavy freezing rain" },
    { "code": [71], "description": "Slight snowfall" },
    { "code": [73], "description": "Moderate snowfall" },
    { "code": [75], "description": "Heavy snowfall" },
    { "code": [77], "description": "Snow grains" },
    { "code": [80], "description": "Slight rain showers" },
    { "code": [81], "description": "Moderate rain showers" },
    { "code": [82], "description": "Violent rain showers" },
    { "code": [85], "description": "Slight snow showers" },
    { "code": [86], "description": "Heavy snow showers" },
    { "code": [95], "description": "Slight or moderate thunderstorm" },
    { "code": [96], "description": "Thunderstorm with slight hail" },
    { "code": [99], "description": "Thunderstorm with heavy hail" }
];

const getCurrWeatherData = async (latitude, longitude, units)=>{ //Get data of current weather
    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}${units === "metric" ? "" : "&temperature_unit=fahrenheit"}&timezone=auto&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,is_day&wind_speed_unit=ms`
    
    let data = await fetch(URL)
    .then((res)=>res.json());

    const {
        // latitude_data,
        // longitude_data,
        // generationtime_ms,
        // utc_offset_seconds,
        // timezone,
        // timezone_abbreviation,
        // elevation,
        // current_units: {
        //     time_unit,
        //     interval_unit,
        //     temperature_2m_unit,
        //     relative_humidity_2m_unit,
        //     apparent_temperature_unit,
        //     weather_code_unit,
        //     surface_pressure_unit,
        //     wind_speed_10m_unit,
        //     wind_direction_10m_unit,
        //     is_day_unit,
        // },
        current: {
            // time,
            // interval,
            temperature_2m,
            relative_humidity_2m,
            apparent_temperature,
            weather_code,
            surface_pressure,
            wind_speed_10m,
            wind_direction_10m,
            is_day
        }
    } = data;

    return {
        "description": getDescription(weather_code),
        "iconSrc": `icons/${weather_code>6? "" + weather_code : "" + is_day + weather_code}.png`,
        "temp": temperature_2m.toFixed(),
        "feels_like": apparent_temperature.toFixed(),
        "pressure": surface_pressure.toFixed(),
        "humidity": relative_humidity_2m.toFixed(),
        "wind_speed": wind_speed_10m.toFixed(),
        "wind_direction": wind_direction_10m,
        "is_day": is_day,
    }
}

const getHourlyWeatherData = async (latitude, longitude, units) => {
    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}${units === "metric" ? "" : "&temperature_unit=fahrenheit"}&timezone=auto&hourly=temperature_2m&wind_speed_unit=ms&forecast_days=4`
    let data = await fetch(URL)
    .then((data)=>data.json());

    const {
        hourly: {
            time,
            temperature_2m,
        } 
    } = data;

    return {
        "today": {
            "time": time.slice(0, 24),
            "temp": temperature_2m.slice(0, 24),
        },
        "dayTwo": {
            "time": time.slice(24, 48),
            "temp": temperature_2m.slice(24, 48),
        },
        "dayThree": {
            "time": time.slice(48, 72),
            "temp": temperature_2m.slice(48, 72),
        },
        "dayFour": {
            "time": time.slice(72, 108),
            "temp": temperature_2m.slice(72, 108),
        }
    }
}

const getForecastData = async (latitude, longitude, units) => {
    const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}${units === "metric" ? "" : "&temperature_unit=fahrenheit"}&timezone=auto&daily=weather_code,temperature_2m_max,temperature_2m_min&wind_speed_unit=ms&forecast_days=4`

    let data = await fetch(URL)
    .then((data)=>data.json());
    console.log("from WeatherService: ");
    console.log(data);
    const {
        // latitude_data,
        // longitude_data,
        // generationtime_ms,
        // utc_offset_seconds,
        // timezone,
        // timezone_abbreviation,
        // elevation,
        // daily_units: {
        //     time_unit,
        //     weather_code_unit,
        //     temperature_2m_max_unit,
        //     temperature_2m_min_unit,
        // },
        daily: {
            time,
            weather_code,
            temperature_2m_max,
            temperature_2m_min,
        }

    } = data;

    return {
        "description": weather_code.map((code)=>getDescription(code)),
        "iconSrc": weather_code.map((code) => `icons/icon_mini/${code}.png`),
        "date": time.map((day)=>getFormattedDate(day)),
        "temp_max": temperature_2m_max.map((t)=> t.toFixed()),
        "temp_min": temperature_2m_min.map((t)=>t.toFixed()),
    }
}


export {getCurrWeatherData, getForecastData, getHourlyWeatherData};