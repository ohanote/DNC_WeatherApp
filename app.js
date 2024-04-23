const form = document.getElementById("form");
const errorText = document.getElementById("errorCatch");

const street = document.getElementById("street");
const district = document.getElementById("district");
const state = document.getElementById("state");

const latitude = document.getElementById("latInput");
const longitude = document.getElementById("longInput");

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

const getLatLong = (cep) => {
  fetch(`http://api.zippopotam.us/BR/${cep}`)
    .then((response) => response.json())
    .then((data) => {
      const latLongData = data;

      latitude.value = latLongData.places[0].latitude;
      longitude.value = latLongData.places[0].longitude;
    })
    .catch((error) => {
      errorText.innerHTML =
        "CEP não localizado. Insira sua latitude e longitude";
    });
};

const getWeatherData = (lat, long) => {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m`
  )
    .then((response) => response.json())
    .then((data) => console.log(data));
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formName = document.querySelector("#nameInput").value;
  const email = document.querySelector("#emailInput").value;
  const cep = document.querySelector("#cepInput").value;
  let _latitude = latitude;
  let _longitude = longitude;

  const data = [formName, email, cep, latitude, longitude];
  console.log(data);

  getCEPData(cep);

  if (!_latitude.value || !_longitude.value) {
    getLatLong(cep);
  }
  
  _latitude = latitude.value;
  _longitude = longitude.value;

  console.log(_latitude, _longitude);

  getWeatherData(_latitude, _longitude);
});
