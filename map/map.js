// Dummy data
const coords = [
  [25.619098069991736, 45.64838769062287],
  [25.584508303390475, 45.646107614795504],
  [25.630170228531597, 45.664705523692845],
  [25.585881594372164, 45.662066196611036],
];

if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
    const [lng, lat] = [position.coords.longitude, position.coords.latitude];
    map.setCenter([lng, lat]);
    coords.map(coord => {
      const marker = new mapboxgl.Marker().setLngLat([coord[0], coord[1]]).addTo(map);
    });
  });
} else {
  alert('Geolocation is not supported by your browser');
}

mapboxgl.accessToken =
  'pk.eyJ1IjoiYm9nZGFuLTI4IiwiYSI6ImNsczRrNDBjdzA0YTYycm54ZWd2M212Z2oifQ.baXXtWrFcumCCbeXt7E6dw';

// GT token
/*
pk.eyJ1IjoicmFkdWZpbGkiLCJhIjoiY2xzNGp2MTN5MWVldTJqb2UzbDVhNWhobyJ9.JyqZzFSgW4xiWNn6nwXkXw
*/

const map = new mapboxgl.Map({
  container: 'map',
  center: [26.366689, 46.930792], // starting position [lng, lat]
  zoom: 15, // starting zoom
});
