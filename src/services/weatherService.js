import { DateTime } from "luxon";

const API_KEY = "6e26b1ef92a1ad9aa5322fa1d65f358d";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getWeatherData = (infotype, searchParams) => {
  const url = new URL(BASE_URL + "/" + infotype);
  url.search = new URLSearchParams({ ...searchParams, appid: API_KEY });

  console.log("Request URL:", url.href);

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => data)
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      throw error; // Propagate the error further if needed
    });
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_max, temp_min, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];
  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_max,
    temp_min,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    details,
    icon,
    speed,
  };
};
const formatToLocalTime = (
  sec,
  zone,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(sec).setZone(zone).toFormat(format);

const formatForecastWeather = (data) => {
  console.log(data);
  let { timezone, daily, hourly } = data;
  daily = daily.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "ccc"),
      temp: d.temp.day,
      icon: d.weather[0].icon,
    };
  });

  hourly = hourly.slice(1, 6).map((d) => {
    return {
      title: formatToLocalTime(d.dt, timezone, "hh:mm a"),
      temp: d.temp,
      icon: d.weather[0].icon,
    };
  });

  return { timezone, daily, hourly };
};
const getFormattedWeatherData = async (searchParams) => {
  const FormattedCurrentWeatherData = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  const { lat, lon } = FormattedCurrentWeatherData;

  const formattedForecastWeather = await getWeatherData("onecall", {
    lat,
    lon,
    exclude: "current,minutely,alerts",
    units: searchParams.units,
  }).then(formatForecastWeather);
  return { ...FormattedCurrentWeatherData, ...formattedForecastWeather };
};
const iconurlFromCode = (code) =>
  `http://openweathermap.org/img/wn/${code}@2x.png`;

export default getFormattedWeatherData;
export { formatToLocalTime, iconurlFromCode };
