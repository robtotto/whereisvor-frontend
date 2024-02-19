import { generatePopupHTML, getDistanceToWaterSpring, getSprings } from './lib/utils.js';

// Element selectors:
const toggleButton = document.querySelector('#buttonList');
const mapContainer = document.querySelector('#map');

// fetching springs data
const springs = await getSprings();
// console.log(springs);

// Default user coords (somewhere in Piatra Neamt):
let lng = 26.366689;
let lat = 46.930792;

// Add map to page:
mapboxgl.accessToken =
  'pk.eyJ1IjoicmFkdWZpbGkiLCJhIjoiY2xzNGp2MTN5MWVldTJqb2UzbDVhNWhobyJ9.JyqZzFSgW4xiWNn6nwXkXw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [lng, lat], // starting position [lng, lat]
  zoom: 14, // starting zoom
})
  .addControl(new mapboxgl.NavigationControl())
  .addControl(new mapboxgl.ScaleControl());

//
// Check geolocation and set map center with new coords if allowed
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      // get location coords
      [lng, lat] = [position.coords.longitude, position.coords.latitude];

      // set map center and user marker with popup
      map.setCenter([lng, lat]);
      const userMarker = new mapboxgl.Marker({
        color: '#fd7e14',
      })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup({ offset: 35, closeButton: false }).setText('Aici te afli tu'))
        .addTo(map);

      // Add water spring markers info:
      springs.forEach(async spring => {
        const distance = await getDistanceToWaterSpring(lng, lat, spring);
        const popupHTML = generatePopupHTML(spring, distance);

        // update marker and popup
        const popup = new mapboxgl.Popup({ offset: 35, closeButton: false }).setHTML(popupHTML);

        const marker = new mapboxgl.Marker({ color: '#FF6161' })
          .setLngLat(spring.coordinate)
          .setPopup(popup)
          .addTo(map);
      });
    },
    error => alert('No coordinates available!')
  );
}

// Add default markers on the map without geolocation:
springs.forEach(spring => {
  const popupHTML = generatePopupHTML(spring);

  const popup = new mapboxgl.Popup({
    offset: 35,
    closeButton: false,
  }).setHTML(popupHTML);

  const marker = new mapboxgl.Marker({ color: '#FF6161' })
    .setLngLat([spring.coordinate[0], spring.coordinate[1]])
    .setPopup(popup)
    .addTo(map);
});
/////////////////////////////////////////////////////////////////////

// Toggle map / list

let isMapVisible = true;

toggleButton.addEventListener('click', function () {
  isMapVisible = !isMapVisible;

  mapContainer.style.display = isMapVisible ? 'none' : 'block';
});
