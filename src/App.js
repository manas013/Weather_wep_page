import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Forcast from "./components/Forcast";
import Inputs from "./components/Inputs";
import TemperatureAndDetails from "./components/TemperatureAndDetails";
import TimeAndLocations from "./components/TimeAndLocations";
import Topbuttons from "./components/Topbuttons";
import getFormattedWeatherData from "./services/weatherService";

function App() {
  const [query, setQuery] = useState({ q: "howrah" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    const fetchWeather = async () => {
      await getFormattedWeatherData({ ...query, units }).then((data) => {
        toast.success(`Successfull weather for ${data.name}, ${data.country}`);
        setWeather(data);
        console.log(data);
      });
    };
    fetchWeather();
  }, [query, units]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";

    const threshold = units === "metric" ? 20 : 60;

    if (weather.temp <= threshold) return "from-cyan-700 to-blue-700";

    return "from-yellow-700 to orange-700";
  };

  return (
    <div
      className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br from-cyan-700 to-blue-700 h-fit shadow-xl shadow-grey-400 ${formatBackground()}`}
    >
      <Topbuttons setQuery={setQuery} />
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />
      {weather && (
        <div>
          <TimeAndLocations weather={weather} />
          <TemperatureAndDetails weather={weather} />
          <Forcast title="Hourly Forecast" items={weather.hourly} />
          <Forcast title="Daily Forecast" items={weather.daily} />
        </div>
      )}

      <ToastContainer autoClose={5000} theme="colored" newestOnTop={true} />
    </div>
  );
}

export default App;
