import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import {
  generatePopupHTML,
  getDistanceToWaterSpring,
  getSprings,
  displayErrorPopup,
  updateLikeCounter,
} from './lib/utils.js';

// fetching springs data
const springs = await getSprings();

// Default user coords (somewhere in Piatra Neamt):
let lng = 26.366689;
let lat = 46.930792;

// Add map to page:
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [lng, lat], // starting position [lng, lat]
  zoom: 14, // starting zoom
})
  .addControl(new mapboxgl.NavigationControl())
  .addControl(new mapboxgl.ScaleControl());

// Check geolocation and set map center with new coords if allowed
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      try {
        // get location coords
        [lng, lat] = [position.coords.longitude, position.coords.latitude];

        // set map center and user marker with popup
        map.setCenter([lng, lat]);
        const userMarker = new mapboxgl.Marker({
          color: '#fd7e14',
        })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ closeButton: false }).setText('Aici te afli tu'))
          .addTo(map);

        // Add water spring markers info:
        springs.forEach(async spring => {
          try {
            const distance = await getDistanceToWaterSpring(lng, lat, spring);
            const popupHTML = generatePopupHTML(spring, distance);

            ////////////// LIKE COUNTER UPDATE //////////////
            const popupContent = document.createElement('div');
            popupContent.innerHTML = `       
        <div class="popup__card">
            <div class="popup__card--content">
                <h4>${spring.name}</h4>
                <p>${distance} km</p>
                <img
                  src="Images/heart-symbol.svg"
                  class="popup__card--heart"
                  alt="heart-symbol" 
                  data-id="${spring.id}"/>
            </div>
        </div>
            `;

            // update marker and popup
            const popup = new mapboxgl.Popup({
              closeButton: false,
            }).setDOMContent(popupContent);

            popup.on('open', () => {
              popupContent.addEventListener('click', e => {
                if (!e.target.classList.contains('popup__card--heart')) return;

                console.log(e.target.dataset.id);

                updateLikeCounter(e.target.dataset.id, spring);
              });
            });
            ////////////////////////////////////////////////////////////
            const marker = new mapboxgl.Marker({ color: '#FF6161' })
              .setLngLat([spring.longitude, spring.latitude])
              .setPopup(popup)
              .addTo(map);
          } catch (error) {
            displayErrorPopup(`Error updating water spring marker: ${error.message}`);
          }
        });
      } catch (error) {
        displayErrorPopup(`Error setting user marker and map center: ${error.message}`);
      }
    },
    error => displayErrorPopup(`Error getting current position: ${error.message}`)
  );
} else {
  displayErrorPopup('Geolocation is not supported by your browser.');
}

// Add default markers on the map without geolocation:
springs.forEach(spring => {
  const popupHTML = generatePopupHTML(spring);

  ////////////// LIKE COUNTER UPDATE //////////////
  const popupContent = document.createElement('div');
  popupContent.innerHTML = `       
<div class="popup__card">
  <div class="popup__card--content">
      <h4>${spring.name}</h4>
      <img
        src="Images/heart-symbol.svg"
        class="popup__card--heart"
        alt="heart-symbol" 
        data-id="${spring.id}"/>
  </div>
</div>
  `;

  const popup = new mapboxgl.Popup({
    closeButton: false,
  }).setDOMContent(popupContent);

  popup.on('open', () => {
    popupContent.addEventListener('click', e => {
      if (!e.target.classList.contains('popup__card--heart')) return;

      console.log(e.target.dataset.id);

      updateLikeCounter(e.target.dataset.id, spring);
    });
  });
  ////////////////////////////////////////////////////////////

  const marker = new mapboxgl.Marker({ color: '#FF6161' })
    .setLngLat([spring.longitude, spring.latitude])
    .setPopup(popup)
    .addTo(map);
});
