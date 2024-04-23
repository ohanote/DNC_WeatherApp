const form = document.getElementById("form");
const errorText = document.getElementById("errorCatch");

const street = document.getElementById("street");
const district = document.getElementById("district");
const state = document.getElementById("state");

const formatCEP = (zipCode) => {
  return zipCode.replace(/-/g, "");
};

const getCEPData = (cep) => {
  fetch(`https://viacep.com.br/ws/${formatCEP(cep)}/json/`)
    .then((response) => response.json())
    .then((data) => {
      const cepData = data;

      street.innerHTML = cepData.logradouro;
      district.innerHTML = cepData.bairro;
      state.innerHTML = `${cepData.localidade}/${cepData.uf}`;
    });
};

const getLatLong = () => {
  const _cep = document.querySelector("#cepInput").value;
  const _latitude = document.getElementById("latInput");
  const _longitude = document.getElementById("longInput");
  console.log(_cep);

  fetch(`https://api.zippopotam.us/BR/${_cep}`)
    .then((response) => response.json())
    .then((data) => {
      const latLongData = data;

      _latitude.value = latLongData.places[0].latitude;
      _longitude.value = latLongData.places[0].longitude;
    })
    .catch((error) => {
      errorText.innerHTML =
        "CEP não localizado. Insira sua latitude e longitude";
      console.log(error);
    });
};

const getWeatherData = (lat, long) => {
  const double = (n) => {
    return n < 10 ? "0" + n : n;
  };

  const date = new Date();
  const checkDate = `${date.getUTCFullYear()}-${double(
    date.getUTCMonth()
  )}-${double(date.getUTCDate())}T${double(date.getUTCHours())}:${double(
    date.getUTCMinutes()
  )}`;

  const latitude = document.getElementById("latInput");
  const longitude = document.getElementById("longInput");
  const degrees = document.getElementById("degrees");

  if (!latitude.value || !longitude.value) {
    getLatLong(cep);
  }

  _latitude = latitude.value;
  _longitude = longitude.value;

  console.log(_latitude, _longitude);

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m`
  )
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i <= data.hourly.time.length; i++) {
        if (data.hourly.time[i] > checkDate){
          degrees.innerHTML = ` ${data.hourly.temperature_2m[i]} ºC`
        }
        
      }
    });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log(new Date().getDate());

  const _lat = document.getElementById("latInput");
  const _long = document.getElementById("longInput");

  const formName = document.querySelector("#nameInput").value;
  const email = document.querySelector("#emailInput").value;
  const cep = document.querySelector("#cepInput").value;

  getCEPData(cep);

  getWeatherData(_lat.value, _long.value);
});
