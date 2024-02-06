// Dummy data
const coords = [
  [25.619098, 45.648387],
  [25.584508, 45.646107],
  [25.63017, 45.664705],
  [25.585881, 45.662066],
];

// Add map:
mapboxgl.accessToken =
  'pk.eyJ1IjoicmFkdWZpbGkiLCJhIjoiY2xzNGp2MTN5MWVldTJqb2UzbDVhNWhobyJ9.JyqZzFSgW4xiWNn6nwXkXw';

const map = new mapboxgl.Map({
  container: 'map',
  center: [26.366689, 46.930792], // starting position [lng, lat]
  zoom: 14, // starting zoom
});

// Add markers to map
coords.map(coord => {
  const marker = new mapboxgl.Marker().setLngLat([coord[0], coord[1]]).addTo(map);
});

// Check geolocation and set map center if ok
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
    const [lng, lat] = [position.coords.longitude, position.coords.latitude];
    map.setCenter([lng, lat]);
    const userMarker = new mapboxgl.Marker({
      color: 'red',
    })
      .setLngLat([lng, lat])
      .addTo(map);
  });
} else {
  alert('Geolocation is not supported by your browser');
}

// console.log(
//   decodeURIComponent(
//     'https://api.mapbox.com/directions/v5/mapbox/walking/-74.173431%2C40.77917%3B-74.175859%2C40.762212?access_token=pk.eyJ1IjoiYm9nZGFuLTI4IiwiYSI6ImNsczNobDdicDB5cWcydm1lOGtnMXZjYWkifQ.UI-Umu7Pb1hHE2ZsQ7DYBQ'
//   )
// );

/*
https://api.mapbox.com/directions/v5/mapbox/walking/-74.173431,40.77917;-74.175859,40.762212?alternatives=false&geometries=geojson&overview=simplified&steps=false&access_token=pk.eyJ1IjoiYm9nZGFuLTI4IiwiYSI6ImNsczNobDdicDB5cWcydm1lOGtnMXZjYWkifQ.UI-Umu7Pb1hHE2ZsQ7DYBQ
*/
