mapboxgl.accessToken =
  'pk.eyJ1IjoicmFkdWZpbGkiLCJhIjoiY2xzNGp2MTN5MWVldTJqb2UzbDVhNWhobyJ9.JyqZzFSgW4xiWNn6nwXkXw';

const map = new mapboxgl.Map({
  container: 'map',
  center: [26.366689, 46.930792],
  zoom: 14,
});

// Add controls for zoom & rotation
map.addControl(new mapboxgl.NavigationControl());

// Add scale
map.addControl(new mapboxgl.ScaleControl());

// sort coordonates
function sortCoordsByDistance(userLng, userLat) {
  const izvoareCoordonate = {
    'Izvor 1': [25.630663988310232, 45.63619443082712],
    'Izvor 2': [25.63413897372648, 45.637023948520685],
    'Izvor 3': [25.630931051918537, 45.63355059158994],
    'Izvor 4': [25.6308023058968, 45.636798899522084],
    'Izvor 5': [25.635158213405624, 45.632327738633],
    'Izvor 6': [25.58942464128678, 45.64276925678877],
    'Izvor 7': [25.61740278132686, 45.64954956999111]
  };

  const coordonate = Object.values(izvoareCoordonate);
  const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${userLng},${userLat};${coordonate
    .map(coord => coord.join(','))
    .join(
      ';'
    )}?alternatives=false&geometries=geojson&overview=simplified&steps=false&access_token=${
    mapboxgl.accessToken
  }`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const distances = data.routes.map(route => route.distance);

      const sortedCoords = coordonate.slice().sort((a, b) => {
        const distanceA = distances.shift();
        const distanceB = distances.shift();
        return distanceA - distanceB;
      });

      // add sorted markers on map
      sortedCoords.forEach((coord, index) => {
        const numeIzvor = Object.keys(izvoareCoordonate).find(
          key => izvoareCoordonate[key][0] === coord[0] && izvoareCoordonate[key][1] === coord[1]
        );
        const popup = new mapboxgl.Popup({ offset: 35 }).setText(numeIzvor);
        const marker = new mapboxgl.Marker()
          .setLngLat([coord[0], coord[1]])
          .setPopup(popup)
          .addTo(map);
      });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// check geolocation
if ('geolocation' in navigator) {
  navigator.geolocation.getCurrentPosition(position => {
    const [lng, lat] = [position.coords.longitude, position.coords.latitude];
    map.setCenter([lng, lat]);
    const userMarker = new mapboxgl.Marker({
      color: 'red',
    })
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup({ offset: 35 }).setText('Aici te afli tu'))
      .addTo(map);

  
    sortCoordsByDistance(lng, lat);
  });
} else {
  alert('Geolocation is not supported by your browser');
}
