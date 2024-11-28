module.exports = {
    weatherData: [
      { 
        latitude: 45, 
        longitude: -78, 
        temperature: 31, 
        humidity: 61,    
        precipitation_rate: 0  
      },
      { 
        latitude: 40, 
        longitude: -74, 
        temperature: 22,  
        humidity: 60,     
        precipitation_rate: 1 
      },
      { 
        latitude: 34, 
        longitude: -118, 
        temperature: 24,  
        humidity: 65,     
        precipitation_rate: 2 
      },
    ],
    summarizedWeatherData: [
        {
          max_temperature: 25,
          min_temperature: 18,
          avg_temperature: 21,
          max_precipitation_rate: 3,
          min_precipitation_rate: 1,
          avg_precipitation_rate: 2,
          max_humidity: 70,
          min_humidity: 55,
          avg_humidity: 62,
        },
    ],
    returnedSummarizedWeatherData: [
        {
          max: {
            Temperature: 25,
            Precipitation_rate: 3,
            Humidity: 70,
          },
          min: {
            Temperature: 18,
            Precipitation_rate: 1,
            Humidity: 55,
          },
          avg: {
            Temperature: 21,
            Precipitation_rate: 2,
            Humidity: 62,
          },
        },
      ],
  };
  