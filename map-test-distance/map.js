const coords = [
  [25.630663988310232, 45.63619443082712],
  [25.59472468584814, 45.64387937144925], 
  [25.58942464128678, 45.64276925678877],  
  [25.58919933574875, 45.642244194894985],  
  [25.587364704896014, 45.64516947708139], 
];

mapboxgl.accessToken = 'pk.eyJ1IjoicmFkdWZpbGkiLCJhIjoiY2xzNGp2MTN5MWVldTJqb2UzbDVhNWhobyJ9.JyqZzFSgW4xiWNn6nwXkXw';
const map = new mapboxgl.Map({
  container: 'map',
  center: [26.366689, 46.930792],
  zoom: 14
});

const distanceContainer = document.getElementById('distance');
const geojson = {
  'type': 'FeatureCollection',
  'features': []
};
const linestring = {
  'type': 'Feature',
  'geometry': {
    'type': 'LineString',
    'coordinates': []
  }
};

map.on('load', () => {
  map.addSource('geojson', {
    'type': 'geojson',
    'data': geojson
  });

  map.addLayer({
    id: 'measure-points',
    type: 'circle',
    source: 'geojson',
    paint: {
      'circle-radius': 5,
      'circle-color': '#000'
    },
    filter: ['in', '$type', 'Point']
  });
  map.addLayer({
    id: 'measure-lines',
    type: 'line',
    source: 'geojson',
    layout: {
      'line-cap': 'round',
      'line-join': 'round'
    },
    paint: {
      'line-color': '#000',
      'line-width': 2.5
    },
    filter: ['in', '$type', 'LineString']
  });

  // Adăugarea marcatorilor pentru fiecare element din coords
  coords.forEach(coord => {
    const marker = new mapboxgl.Marker()
      .setLngLat(coord)
      .addTo(map);
  });

  map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['measure-points']
    });

    if (geojson.features.length > 1) geojson.features.pop();

    distanceContainer.innerHTML = '';

    if (features.length) {
      const id = features[0].properties.id;
      geojson.features = geojson.features.filter(
        (point) => point.properties.id !== id
      );
    } else {
      const point = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [e.lngLat.lng, e.lngLat.lat]
        },
        'properties': {
          'id': String(new Date().getTime())
        }
      };

      geojson.features.push(point);
    }

    if (geojson.features.length > 1) {
      linestring.geometry.coordinates = geojson.features.map(
        (point) => point.geometry.coordinates
      );

      geojson.features.push(linestring);

      const value = document.createElement('pre');
      const distance = turf.length(linestring);
      value.textContent = `Total distance: ${distance.toLocaleString()}km`;
      distanceContainer.appendChild(value);
    }

    map.getSource('geojson').setData(geojson);
  });
});

map.on('mousemove', (e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['measure-points']
  });
  map.getCanvas().style.cursor = features.length
    ? 'pointer'
    : 'crosshair';
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
      .setPopup(new mapboxgl.Popup({ offset: 35 }).setText('Aici te afli tu'))
      .addTo(map);
  });
} else {
  alert('Geolocation is not supported by your browser');
}