import React, { useState, useEffect } from "react";
import axios from "axios";
const Weather = () => {
  const [city, setCity] = useState("Delhi");
  const [weather, setWeather] = useState(null);
  const [days, setDays] = useState([]);
  const apiKey = "411992309b1152b0006bfab0dd61f1c0";
  const baseURL = "https://api.openweathermap.org/data/2.5/forecast";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getLocationName);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (city !== "") {
      axios
        .get(baseURL, {
          params: {
            q: city,
            appid: apiKey,
            units: "metric",
            cnt: 40,
          },
        })
        .then((response) => {
          setWeather(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [city]);

  const getLocationName = async (position) => {
    try {
      const { data } = await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
      );
      setCity(data.city);
    } catch (error) {
      console.log(error);
    }
  };

  const getDayOfWeek = (date) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = new Date(date).getDay();
    return daysOfWeek[day];
  };

  useEffect(() => {
    if (weather) {
      const forecastList = weather.list;
      const newDays = forecastList.reduce((acc, forecast, index) => {
        if (index === 0 || index % 8 === 0) {
          const newDay = {
            day: getDayOfWeek(forecast.dt_txt),
            date: new Date(forecast.dt * 1000).getDate(),
            temperature: forecast.main.temp,
            weather: forecast.weather[0],
            wind: forecast.wind.speed,
            humidity: forecast.main.humidity,
            pressure: forecast.main.pressure,
            clouds: forecast.clouds,
          };
          acc.push(newDay);
        }
        return acc;
      }, []);
      setDays(newDays);
    }
  }, [weather]);
  console.log(days);
  return (
    <div className="lg:px-4 mt-2 md:m-0">
      <input
        value={city}
        onChange={(e) => {
          setCity(e.target.value);
        }}
        style={{ outline: "none" }}
        type="text"
        placeholder="Type here"
        className="input input-bordered input-sm w-5/6 md:w-1/3  flex justify-center  m-auto "
      />

      <div className="card lg:card-side bg-base-100   flex justify-center">
        {days.length > 0 && (
          <div className="lg:w-2/5 rounded-md h-96 m-auto w-full">
            <div className="">
              <p className="text-center capitalize text-2xl">{city}</p>
              <p className="text-center">
                {days[0].day} {new Date().toLocaleDateString()}
              </p>
              <img
                className="w-56 h-56 m-auto"
                src={`https://openweathermap.org/img/wn/${days[0].weather.icon}@2x.png`}
                alt=""
              />
              <div className="flex justify-around my-2">
                <p className="text-2xl font-bold">{days[0].temperature} °C</p>
                <p className="text-2xl font-bold capitalize ">
                  {days[0].weather.description}
                </p>
              </div>
              <div className="flex justify-around my-2">
                <p className="md:text-xl">Pressure : {days[0].pressure}</p>
                <p className=" md:text-xl ">Wind : {days[0].wind} m/s</p>
              </div>
              <div className="flex justify-around my-2">
                <p className="md:text-xl">Clouds : {days[0].clouds.all}%</p>
                <p className="md:text-xl">Humidity : {days[0].humidity}%</p>
              </div>
            </div>
          </div>
        )}

        <div className="card-body  ">
          {days.slice(1).map((daydata, index) => (
            <div
              className="card card-side sm:w-full bg-base-100 shadow-2xl "
              key={index}
            >
              <figure>
                <img
                  className=""
                  src={`https://openweathermap.org/img/wn/${daydata.weather.icon}@2x.png`}
                  alt="Movie"
                />
              </figure>
              <div className="card-body ">
                <div className="flex justify-around ">
                  <p className="pe-2">
                    {daydata.date} {daydata.day}{" "}
                  </p>
                  <p className="hidden  md:block">
                    <i className="bx bxs-thermometer"></i> {daydata.temperature}{" "}
                    °C
                  </p>
                  <p className="">
                    <i className="bx bx-wind"></i> {daydata.wind} m/s
                  </p>
                </div>
                <div className="flex justify-around">
                  <p className="pe-2">{daydata.weather.main}</p>
                  <p className="hidden  md:block">
                    <i className="bx bx-cloud"></i> {daydata.clouds.all} %
                  </p>
                  <p className="">
                    <i className="bx bxs-droplet-half"></i> {daydata.humidity} %
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
