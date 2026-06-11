const API_KEY = "CWA-397EBE94-2BC7-4162-8479-A2765A0703D6";

export const getWeather = async (city = "臺南市") => {
  const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${API_KEY}&locationName=${city}`;

  const res = await fetch(url);
  const data = await res.json();

  const location = data.records.location[0];
  const weather = location.weatherElement;

  return {
    city,
    description: weather[0].time[0].parameter.parameterName,
    rain: weather[1].time[0].parameter.parameterName,
    minT: weather[2].time[0].parameter.parameterName,
    maxT: weather[4].time[0].parameter.parameterName,
  };
};