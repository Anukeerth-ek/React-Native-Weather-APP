import axios from "axios";
import { apiKey } from "../constants";

const foreCastEndPoint = params=> `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}`
const locationEndPoint = params=> `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`


const apiCall = async (endpoint)=> {
    const option = {
        method: "GET",
        url: endpoint
    }
    try{
        const response = await axios.request(option)
        return response.data
    }
    catch(err) {
            console.log("ERROR!", err)
            return null
    }
}

export const fetchWeatherForecast = params=> {
    return apiCall(foreCastEndPoint(params))
}

export const fetchLocations = params=> {
    return apiCall(locationEndPoint(params))
}