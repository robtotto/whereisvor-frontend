import {
  getSprings,
  generatePopupHTML,
  getDistanceToWaterSpring,
  displayErrorPopup,
  decimalToDMS,
  updateLikeCounter,
} from "./lib/utils.js";

import {
  accessToken,
  defaultLng,
  defaultLat,
  colorMarker,
  skinMapbox,
  containerMapbox,
} from "../globals.js";

const springList = document.querySelector("#sprigList");
let springs;

///////////////////////////  HARTA  ///////////////////////////////////////////

export const initializeSprings = async () => {
  try {
    springs = await getSprings();

    // Adaugare harta pe pagina
    mapboxgl.accessToken = accessToken;

    // Coordonatele implicite
    let lng = defaultLng;
    let lat = defaultLat;

    const map = new mapboxgl.Map({
      container: containerMapbox,
      style: skinMapbox,
      center: [lng, lat], // pozitia de inceput [lng, lat]
      cooperativeGestures: true,
      zoom: 6,
    })
      .addControl(new mapboxgl.NavigationControl())
      .addControl(new mapboxgl.ScaleControl());

    // Locatia utilizatorului
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            [lng, lat] = [position.coords.longitude, position.coords.latitude];

            // Centreaza harta dupa coordonatele utilizatorului
            map.setCenter([lng, lat]);

            // Sorteaza izvoarele dupa distanta fata de utilizator
            for (let i = 0; i < springs.length; i++) {
              const spring = springs[i];
              const distance = await getDistanceToWaterSpring(lng, lat, spring);
              spring.distance = distance;
            }

            springs.sort(
              (spring1, spring2) => spring1.distance - spring2.distance
            );

            springList.innerHTML = "";

            // Adauga pins info
            for (let i = 0; i < springs.length; i++) {
              const spring = springs[i];
              try {
                const distance = spring.distance;
                const card = generateListCard(spring, distance);
                springList.appendChild(card);

                // Actualizeaza pins si popup
                const popupContent = generatePopupHTML(spring, distance);
                const popup = new mapboxgl.Popup().setDOMContent(popupContent);

                const marker = new mapboxgl.Marker({
                  color: colorMarker,
                })
                  .setLngLat([spring.longitude, spring.latitude])
                  .setPopup(popup)
                  .addTo(map);
              } catch (error) {
                console.error(error);
                displayErrorPopup(
                  "A apărut o eroare în timp ce încercam să accesăm informațiile. Te rugăm să verifici conexiunea și să reîncărci pagina."
                );
              }
            }
          } catch (error) {
            displayErrorPopup(
              "Ne pare rău, a apărut o eroare la accesarea locației tale. Te rugăm să verifici permisiunile sau conexiunea și să încerci din nou."
            );
          }
        },
        (error) =>
          displayErrorPopup(
            "Dorim să afișăm distanța de la tine până la cel mai apropiat izvor. Permite accesul la locația ta din setările de browser."
          )
      );
    } else {
      displayErrorPopup(
        "Ne pare rău, browserul tău nu suportă geolocalizarea. Pentru a utiliza această funcționalitatea, te rugăm să încerci cu un alt browser sau să o activezi în setările actuale ale browserului tău."
      );
    }

    // Adauga markere pe harta cu geolocatia dezactivata
    springs.forEach((spring) => {
      const popupContent = generatePopupHTML(spring);
      const card = generateListCard(spring);
      springList.appendChild(card);

      const popup = new mapboxgl.Popup().setDOMContent(popupContent);

      const marker = new mapboxgl.Marker({ color: colorMarker })
        .setLngLat([spring.longitude, spring.latitude])
        .setPopup(popup)
        .addTo(map);
    });
  } catch (error) {
    displayErrorPopup(
      "A apărut o eroare în timp ce încercam să accesăm informațiile. Te rugăm să verifici conexiunea și să reîncărci pagina."
    );
  }
};

///////////////////////////  LISTA  ///////////////////////////////////////////

// Card lista izvoare
function generateListCard(spring, distance = null) {
  const card = document.createElement("div");
  card.classList.add("spring-item-card", "col");

  card.innerHTML = `
      <div class="spring-item-card-inner position-relative">
      <a href="detalii-izvor.html?izvor=${encodeURIComponent(spring.name)}" 
      class="stretched-link text-decoration-none link-dark springItemCardLink">
       <img src="${
         spring.image
       }" class="spring-item-card-img springItemCardImg" 
       alt="${spring.name}" />
       <div class="spring-item-card-body">
       <div class="spring-item-card-content">
         <h5 class="spring-title text-capitalize fw-bold springItemCardContentTitle">
         ${spring.name}          
         </h5>
         <div class="spring-coordinates">
         <div class="springCoordinatesLat">Latitudine: ${decimalToDMS(
           spring.latitude,
           "N"
         )}</div>
         <div class="springCoordinatesLon">Longitudine: ${decimalToDMS(
           spring.longitude,
           "E"
         )}</div>
         </div>
         ${
           distance
             ? `<div class="spring-distance springItemCardContentDistance">${distance} km</div>`
             : '<div class="spring-distance springItemCardContentDistance">Distanță necunoscută</div>'
         }
       </div>
          </a>
          <button class="spring-heart-wrap btn p-1 border-0 rounded-3 btn-outline-light springItemCardHeart"
            data-id="${spring.id}" 
            data-liked="${spring.isLiked ? "true" : "false"}" 
            type="button">
            <img class="unliked" src="Images/heart-symbol.svg" />
            <img class="liked" src="Images/heart-symbol-liked.svg" />
            <span class="springItemCardHeartNumber">${spring.likeCounter}</span>
          </button>
        </div>
      </div>
    </div>`;

  const likeBtn = card.querySelector(".springItemCardHeart");
  likeBtn.dataset.id = spring.id;

  // Extragem din local storage informatia cu privire la existenta like-ului
  likeBtn.dataset.liked = localStorage.getItem(spring.id) ? "true" : "false";

  const unlikedImg = card.querySelector(".unliked");
  const likedImg = card.querySelector(".liked");
  const likeCounter = card.querySelector(".springItemCardHeartNumber");

  likeBtn.addEventListener("click", async function () {
    //previne dublu click sau click daca izvorul e deja "liked"
    if (this.clicked || JSON.parse(localStorage.getItem(spring.id))) {
      return;
    }
    this.clicked = true;
    const springId = parseInt(this.dataset.id);
    const springToUpdate = springs.find((spring) => spring.id === springId);

    try {
      const updatedSpring = await updateLikeCounter(springToUpdate);
      const likeCount = updatedSpring.likeCounter;

      // Salvam aprecierea izvorului in local storage
      localStorage.setItem(updatedSpring.id, JSON.stringify(true));

      likeCounter.textContent = likeCount;

      // Toggle liked/unliked
      likedImg.classList.toggle("liked", updatedSpring.isLiked);
      unlikedImg.classList.toggle("unliked", !updatedSpring.isLiked);
    } catch (error) {
      displayErrorPopup(
        "A apărut o eroare în timp ce încercam să accesăm informațiile. Te rugăm să verifici conexiunea și să reîncărci pagina."
      );
    }

    const isLiked = this.dataset.liked === "true";
    this.dataset.liked = (!isLiked).toString();
  });

  return card;
}

initializeSprings();
