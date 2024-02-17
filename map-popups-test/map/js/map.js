const sourceData = {
  'Izvor 1': {
    id: 1,
    coordinate: [25.59350159864167, 45.64387187074832],
    image: 'Images/spring.png',
    name: 'Izvor 1',
    description: 'Sed quis neque id lacus maximus aliquet.  Suspendisse potenti. Sed eleifend turpis nec ex eleifend faucibus. Aenean eget ante at quam tristique ullamcorper. ',
    likeCounter:3
  },
  'Izvor 2': {
    id: 2,
    coordinate: [25.630898865420438, 45.636348798796504],
    image: 'Images/spring.png',
    name: 'Izvor 2',
    description: 'Am intalnit un izvor fericit',
    likeCounter:11
  },
  'Izvor 3': {
    id: 3,
    coordinate: [25.59286859736815, 45.64348933366974],
    image: 'Images/spring.png',
    name: 'Izvor 3',
    description: 'Acesta este un izvor vesel si zglobiu.',
    likeCounter:17
  },
  'Izvor 4': {
    id: 4,
    coordinate: [25.6308023058968, 45.636798899522084],
    image: 'Images/spring.png',
    name: 'Izvor 4',
    description: 'Cras vestibulum nisi ac lorem faucibus, non feugiat justo consectetur.',
    likeCounter:0
  },
  'Izvor 5': {
    id: 5,
    coordinate: [25.635158213405624, 45.632327738633],
    image: 'Images/spring.png',
    name: 'Izvor 5',
    description: 'Vivamus quis bibendum tortor. Maecenas sit amet posuere odio.',
    likeCounter:21
  },
  'Izvor 6': {
    id: 6,
    coordinate: [25.58942464128678, 45.64276925678877],
    image: 'Images/spring.png',
    name: 'Izvor 6',
    description: 'Sed nec ipsum at eros consequat mollis. Nulla facilisi. Vivamus vel felis eget metus congue pellentesque.',
    likeCounter:9
  }
};

let lng = 0; // Initialize lng
let lat = 0; // Initialize lat

// Map creation
mapboxgl.accessToken = 'pk.eyJ1IjoicmFkdWZpbGkiLCJhIjoiY2xzNGp2MTN5MWVldTJqb2UzbDVhNWhobyJ9.JyqZzFSgW4xiWNn6nwXkXw';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', 
  center: [lng, lat], // starting position [lng, lat]
  zoom: 14 // starting zoom
});

// Add controls for zoom & rotation
map.addControl(new mapboxgl.NavigationControl());

// Add scale
map.addControl(new mapboxgl.ScaleControl());

// Get distance to source
const getDistanceToSource = async (userLng, userLat, sourceData) => {
  try {
    const sources = Object.values(sourceData);
    
    for (const sourceItem of sources) {
      const { coordinate, image, name, description, likeCounter } = sourceItem;

      // get distance from mapbox
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${userLng},${userLat};${coordinate[0]},${coordinate[1]}?alternatives=false&geometries=geojson&overview=simplified&steps=false&access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0 && data.routes[0].distance) {
        const distance = (data.routes[0].distance / 1000).toFixed(2); //km

        // Add distance property to sourceItem
        sourceItem.distance = distance;
      } else {
        console.error('No valid route found.');
      }
    }

    // Sort sources by distance
    sources.sort((a, b) => a.distance - b.distance);

    for (const sourceItem of sources) {
      const { coordinate, image, name, distance, description, likeCounter } = sourceItem;

      // Popup template with data
      const popupContent = `
  <div id="popup-card" class="overflow-hidden card card-details z-2 position-absolute start-50 translate-middle-x">
    <button class="mapboxgl-popup-close-button" aria-label="close">X</button>
    <div class="row g-0">
      <div class="col-4">
        <img src="${image}" class="img-spring-card" alt="img">
      </div>
      <div class="col-8">
        <div class="card-body">
          <h4 class="card-title">${name}</h4>
          <p class="card-text-km">${distance} km</p>
          <p class="card-text">${description}</p>
          <div class="heart-container">
          <span class="like-counter">${likeCounter}
            <img
              src="Images/heart-symbol.svg"
              class="position-absolute bottom-0 end-0 heart-card"
              id="heartCard"
              alt="heart-symbol" />
            </span>
          </div>
        </div>
      </div>
    </div>
</div>    
      `;

      const popup = new mapboxgl.Popup({ offset: 3, closeButton: false  }).setHTML(popupContent);

      // close button
      const closeButton = popup._content.querySelector('.mapboxgl-popup-close-button');
      closeButton.addEventListener('click', () => {
        popup.remove();
      });

      const marker = new mapboxgl.Marker({ color: '#FF6161' })
        .setLngLat(coordinate)
        .setPopup(popup)
        .addTo(map);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Check geolocation 
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      [lng, lat] = [position.coords.longitude, position.coords.latitude];

      // Set map center and user marker with popup
      map.setCenter([lng, lat]);
      const userMarker = new mapboxgl.Marker({
        color: 'green',
      })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup({ offset: 35, closeButton: false }).setText('Aici te afli tu'))
        .addTo(map);

      // Source markers info:
      getDistanceToSource(lng, lat, sourceData);
    },
    error => alert('No coordinates available!')
  );
  
} else {
  alert('Geolocation is not supported by your browser');
}
