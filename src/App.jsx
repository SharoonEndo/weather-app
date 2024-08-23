import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import WeatherCard from './components/WeatherCard';
function App() {
	const [coords, setCoords] = useState(null);
	const [weather, setWeather] = useState(null);
	const [temp, setTemp] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);
	const [showMessage, setShowMessage] = useState(false);
	const [city, setCity] = useState('');
	const [messageError, setMessageError] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setShowMessage(true);
		}, 3000);
		const success = (position) => {
			setCoords({
				lat: position.coords.latitude,
				lon: position.coords.longitude,
			});
		};
		const error = () => {
			setHasError(true);
			setIsLoading(false);
		};
		navigator.geolocation.getCurrentPosition(success, error);
	}, []);
	useEffect(() => {
		if (coords) {
			const API_KEY = 'b7a5a42bfa9a365bc4df039800826dbd';
			const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`;
			axios
				.get(url)
				.then((res) => {
					setWeather(res.data);
					const celsius = (res.data.main.temp - 273.15).toFixed(1);
					const fahrenheit = ((celsius * 9) / 5 + 32).toFixed(1);
					setTemp({ celsius, fahrenheit });
					setMessageError(false);
				})
				.catch((err) => {
					console.error(err);
					setMessageError(true);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [coords, city]);
	return (
		<div className="app flex-container">
			{isLoading ? (
				<div>
					<h1>Loading...</h1>
					{showMessage && <p>Please activate location</p>}
				</div>
			) : hasError ? (
				<h1>
					To obtain the weather of your city you must accept the permissions
				</h1>
			) : (
				<WeatherCard
					weather={weather}
					temp={temp}
					setCity={setCity}
					messageError={messageError}
					city={city}
				/>
			)}
			;
		</div>
	);
}
export default App;
