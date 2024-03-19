export async function getSprings() {
  try {
    const res = await fetch('https://whereisvor-server.up.railway.app/api/v1/water-sources');
    const data = await res.json();

    // Se incarca lista de imagini din source-images.json
    const imagesRes = await fetch('../../source-images.json');
    if (!imagesRes.ok) {
      throw new Error('Failed to fetch source-images.json');
    }
    const imagesData = await imagesRes.json();

    const springs = data.map(spring => {
      const springName = removeDiacritics(spring.name).toLowerCase().trim();

      const image = imagesData.find(img => {
        const imageName = removeDiacritics(img.title).toLowerCase().trim();
        return springName.includes(imageName);
      });

      // Imagine implicita
      const imagePath = image ? image.path : '../../source-images/generic.png';

      return {
        ...spring,
        image: imagePath,
      };
    });

    return springs;
  } catch (error) {
    console.error(error);
    displayErrorPopup(
      'A apărut o eroare în timp ce încercam să accesăm informațiile. Te rugăm să verifici conexiunea și să reîncarci pagina.'
    );
  }
}

// Funcție pentru eliminarea diacriticelor din șir
function removeDiacritics(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Preluare distanta catre izvor
export async function getDistanceToWaterSpring(userLng, userLat, targetSpring) {
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${userLng},${userLat};${targetSpring.longitude},${targetSpring.latitude}?alternatives=false&geometries=geojson&overview=simplified&steps=false&access_token=pk.eyJ1IjoiYm9nZGFuLTI4IiwiYSI6ImNsczNobDdicDB5cWcydm1lOGtnMXZjYWkifQ.UI-Umu7Pb1hHE2ZsQ7DYBQ`
    );
    const data = await response.json();
    const distance = (data.routes[0].distance / 1000).toFixed(2); //km
    return distance;
  } catch (error) {
    displayErrorPopup(
      `A apărut o eroare în timpul calculării distanței pentru "${targetSpring.name}". Te rugăm să verifici conexiunea și să reîncărci pagina.`
    );
  }
}

// Generare Pop-up
export function generatePopupHTML(spring, distance = null) {
  const popupContent = document.createElement('div');
  popupContent.innerHTML = `<div class="spring-map-marker-popup text-center">
          <div class="fw-bold h6 mb-3 text-capitalize springTitle">
              ${spring.name}
          </div>
          <a href="detalii-izvor.html?izvor=${spring.name}" class="btn btn-success rounded-pill btn-sm px-3 springSingleUrl">
            <b>Vezi Izvorul</b>
            <img src="images/arrow-pin-card.svg" alt="Arrow icon" />
          </a>
      </div>`;
  return popupContent;
}

// Convertire decimal în grade, minute și secunde
export function decimalToDMS(decimal, direction) {
  const degrees = Math.floor(decimal);
  const minutes = Math.floor((decimal - degrees) * 60);
  const seconds = ((decimal - degrees - minutes / 60) * 3600).toFixed(2);

  return `${degrees}° ${minutes}' ${parseFloat(seconds).toFixed(2)}" ${direction}`;
}

// Afisare eroare
export function displayErrorPopup(errorMessage) {
  const errorModal = document.createElement('div');
  errorModal.innerHTML = `
      <div class="modal fade modal-no-backdrop" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-danger" id="errorModalLabel">Eroare</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>${errorMessage}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary text-danger" data-bs-dismiss="modal">Închide</button>
            </div>
          </div>
        </div>
      </div>`;
  document.body.appendChild(errorModal);
  const errorModalInstance = new bootstrap.Modal(document.getElementById('errorModal'), {
    backdrop: false,
  });
  errorModalInstance.show();
}

// Actualizare like
export async function updateLikeCounter(springToUpdate) {
  springToUpdate.likeCounter += 1;
  const url = `https://whereisvor-server.up.railway.app/api/v1/water-sources/${springToUpdate.id}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(springToUpdate),
  });
  const data = await res.json();
  console.log(data);
  return data;
}

//Capitalizarea initialelor
export const toTitleCase = function (str) {
  str = str.toLowerCase().split(' ');
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
};
