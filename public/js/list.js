// list.js

import {getSprings } from './lib/utils.js';

// fetching springs springs
const springs = await getSprings();
// console.log(springs);
 
    const gridCards = document.querySelector('.grid-cards');
    if (springs) {
        springs.forEach(item => {
            const card = createCard(item);
            gridCards.appendChild(card);
        });
    } else {
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Nu s-au putut încărca datele.';
        gridCards.appendChild(errorMessage);
    }

// Funcție pentru a crea un card pentru fiecare element din listă
function createCard(item) {
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
  location.textContent = `Latitudine: ${item.latitude}, Longitudine: ${item.longitude}`;
  cardBody.appendChild(location);

  const heartIcon = document.createElement('img');
  heartIcon.src = 'Images/heart-symbol.svg';
  heartIcon.classList.add('position-absolute', 'bottom-0', 'end-0', 'heart-card');
  cardBody.appendChild(heartIcon);

  return card;
}

// Apelăm funcția pentru afișarea datelor când se încarcă pagina
window.addEventListener('DOMContentLoaded', displaysprings);
