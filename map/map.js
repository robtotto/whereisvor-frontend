// Dummy water spring data:
const coords = [
  [25.619098, 45.648387],
  [25.584508, 45.646107],
  [25.63017, 45.664705],
  [25.585881, 45.662066],
  [25.705594, 45.660288],
];

// Default user coords (somewhere in Piatra Neamt):
let lng = 26.366689;
let lat = 46.930792;

// Add map to page:
mapboxgl.accessToken =
  'pk.eyJ1IjoicmFkdWZpbGkiLCJhIjoiY2xzNGp2MTN5MWVldTJqb2UzbDVhNWhobyJ9.JyqZzFSgW4xiWNn6nwXkXw';

const map = new mapboxgl.Map({
  container: 'map',
  center: [lng, lat], // starting position [lng, lat]
  zoom: 14, // starting zoom
});

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
        color: 'red',
      })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup({ offset: 35 }).setText('Aici te afli tu'))
        .addTo(map);

      // Add water spring markers info:
      coords.map(coord => {
        getDistanceToWaterSpring(lng, lat, coord);
      });
    },
    error => alert('No coordinates available!')
  );
}

// Add default markers on the map without geolocation:
coords.map(coord => {
  const popup = new mapboxgl.Popup({ offset: 35 }).setText('Acesta e un popup');
  2;
  const marker = new mapboxgl.Marker().setLngLat([coord[0], coord[1]]).setPopup(popup).addTo(map);
});
/////////////////////////////////////////////////////////////////////
// Helper functions:
async function getDistanceToWaterSpring(userLng, userLat, targetCoords) {
  // get distance
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/walking/${userLng},${userLat};${targetCoords[0]},${targetCoords[1]}?alternatives=false&geometries=geojson&overview=simplified&steps=false&access_token=pk.eyJ1IjoiYm9nZGFuLTI4IiwiYSI6ImNsczNobDdicDB5cWcydm1lOGtnMXZjYWkifQ.UI-Umu7Pb1hHE2ZsQ7DYBQ`
  );

  const data = await response.json();
  const distance = (data.routes[0].distance / 1000).toFixed(2); //km

  // update marker and popup
  const popup = new mapboxgl.Popup({ offset: 35 }).setText(`La ${distance} km departare`);
  2;
  const marker = new mapboxgl.Marker().setLngLat(targetCoords).setPopup(popup).addTo(map);
}
