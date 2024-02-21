// list.js
import { getSprings, displayErrorPopup } from './lib/utils.js';

// Fetch springs data 
const loadSprings = async () => {
    try {
        const springs = await getSprings();
        const gridCards = document.querySelector('.grid-cards');
        
        if (springs) { 
            springs.forEach(item => {
                const card = createCard(item);
                gridCards.appendChild(card);
            });
        } else {
            // Custom error handling
            displayErrorPopup('Nu s-au putut încărca datele.');
        }
    } catch (error) {
        // Custom error handling
        displayErrorPopup(`Nu s-au putut încărca datele: ${error.message}`);
    }
};

loadSprings();

//create grid for springs
const createCard = (item) => {
    const card = document.createElement('div');
    card.classList.add('overflow-hidden', 'border-secondary', 'card', 'card-details');

    const img = document.createElement('img');
    img.src = item.image;
    img.classList.add('img-spring-card');
    card.appendChild(img);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.appendChild(cardBody);

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.innerHTML = `<b>${item.name}</b>`;
    cardBody.appendChild(title);

    const locationLabel = document.createElement('p');
    locationLabel.classList.add('card-text');
    locationLabel.textContent = 'Locație:';
    cardBody.appendChild(locationLabel);

    const location = document.createElement('p');
    location.classList.add('card-text-km');
    cardBody.appendChild(location);

    const heartIcon = document.createElement('img');
    heartIcon.src = 'Images/heart-symbol.svg';
    heartIcon.classList.add('position-absolute', 'bottom-0', 'end-0', 'heart-card');
    cardBody.appendChild(heartIcon);

    // Reverse geocode spring's location
    reverseGeocode(item.longitude, item.latitude)
    .then(springAddress => {
        location.textContent = `${springAddress}`;
    })
    .catch(error => {
        // Custom error handling
        displayErrorPopup(`Adresa nu a fost găsită: ${error}`);
    });

    // Reverse geocoding spring's location
    reverseGeocode(item.longitude, item.latitude)
    .then(springAddress => {
        const location = card.querySelector('.card-text-km');
        location.textContent = `${springAddress}`;
    })
    .catch(error => {
        // Custom error handling
        displayErrorPopup(`Adresa nu a fost găsită: ${error}`);
    });

    return card;
}

const reverseGeocode = async (lng, lat) => {
    const accessToken = 'pk.eyJ1IjoicmFkdWZpbGkiLCJhIjoiY2xzNGp2MTN5MWVldTJqb2UzbDVhNWhobyJ9.JyqZzFSgW4xiWNn6nwXkXw';
    try {
        const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}`);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            return data.features[0].place_name;
        } else {
            throw new Error('Adresa nu e disponibilă');
        }
    } catch (error) {
        // Custom error handling
        displayErrorPopup(`Adresa nu e disponibilă: ${error}`);
        throw error; 
    }
};
