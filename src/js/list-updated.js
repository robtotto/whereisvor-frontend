//list-updated.js

import { getSprings, displayErrorPopup, updateLikeCounter } from './lib/utils.js';

const springList = document.getElementById('springList');
let springs;

//Toggle
document.addEventListener('DOMContentLoaded', function () {
  const mapButton = document.getElementById('spring-map-button');
  const listButton = document.getElementById('spring-list-button');
  const mapTab = document.getElementById('spring-map');
  const listTab = document.getElementById('spring-list');

  listTab.classList.remove('active', 'show');

  mapButton.addEventListener('click', function () {
    listTab.classList.remove('active', 'show');
    mapTab.classList.add('active', 'show');
  });

  listButton.addEventListener('click', function () {
    mapTab.classList.remove('active', 'show');
    listTab.classList.add('active', 'show');
  });
});

// Generare elemente UI
const createCard = item => {
  const card = document.createElement('div');
  card.classList.add('col', 'spring-item-card');

  const innerDiv = document.createElement('div');
  innerDiv.classList.add('spring-item-card-inner', 'position-relative');
  card.appendChild(innerDiv);

  const img = document.createElement('img');
  img.classList.add('spring-item-card-img', 'springItemCardImg');
  img.src = item.image;
  img.alt = 'izvor';
  innerDiv.appendChild(img);

  const cardBody = document.createElement('div');
  cardBody.classList.add('spring-item-card-body');
  innerDiv.appendChild(cardBody);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('spring-item-card-content');
  cardBody.appendChild(contentDiv);

  const title = document.createElement('h5');
  title.classList.add('spring-title', 'fw-bold', 'springItemCardContentTitle');
  const titleLink = document.createElement('a');
  titleLink.classList.add(
    'stretched-link',
    'text-decoration-none',
    'link-dark',
    'springItemCardLink'
  );
  titleLink.textContent = item.name;
  title.appendChild(titleLink);
  contentDiv.appendChild(title);

  const description = document.createElement('div');
  description.classList.add('spring-description', 'springItemCardContentDescription');
  description.textContent = item.description;
  contentDiv.appendChild(description);

  const distance = document.createElement('div');
  distance.classList.add('spring-distance', 'springItemCardContentDistance');
  distance.textContent = item.distance;
  contentDiv.appendChild(distance);

  // like button
  const likeBtn = document.createElement('button');
  likeBtn.classList.add(
    'spring-heart-wrap',
    'btn',
    'p-1',
    'border-0',
    'rounded-3',
    'btn-outline-light',
    'springItemCardHeart'
  );
  likeBtn.setAttribute('type', 'button');
  likeBtn.dataset.id = item.id;

  // setam valoarea initiala în functie de starea curenta a like-ului
  likeBtn.setAttribute('data-liked', item.isLiked ? 'true' : 'false');
  const unlikedImg = document.createElement('img');
  unlikedImg.classList.add('unliked');
  unlikedImg.src = 'Images/heart-symbol.svg';
  const likedImg = document.createElement('img');
  likedImg.classList.add('liked');
  likedImg.src = 'Images/heart-symbol-liked.svg';

  // contor likes
  const likeCounter = document.createElement('span');
  likeCounter.classList.add('springItemCardHeartNumber');
  likeCounter.textContent = item.likeCounter;

  // afisare inima liked/unliked
  if (item.isLiked) {
    likeBtn.appendChild(likedImg);
  } else {
    likeBtn.appendChild(unlikedImg);
  }

  likeBtn.appendChild(likeCounter);
  cardBody.appendChild(likeBtn);

  // buton likes click event
  likeBtn.addEventListener('click', async function () {
    // dezactivare buton likes (pana implementam unlike)
    //likeBtn.disabled = true;

    const springId = this.dataset.id;
    const springToUpdate = springs.find(spring => spring.id === springId);

    const likeCounter = this.querySelector('.springItemCardHeartNumber');

    // actualizare contor
    try {
      const updatedSpring = await updateLikeCounter(springId, springToUpdate);
      const likeCount = updatedSpring.likeCounter;

      // actualizare contor in UI
      likeCounter.textContent = likeCount;

      // Toggle likedImg/unlikedImg
      if (updatedSpring.isLiked) {
        if (!this.contains(likedImg)) {
          this.appendChild(likedImg);
        }
        if (this.contains(unlikedImg)) {
          this.removeChild(unlikedImg);
        }
      } else {
        if (!this.contains(unlikedImg)) {
          this.appendChild(unlikedImg);
        }
        if (this.contains(likedImg)) {
          this.removeChild(likedImg);
        }
      }
    } catch (error) {
      displayErrorPopup('A apărut o eroare la actualizarea contorului de like-uri:', error);
    }

    // Actualizare inima în functie de starea like-ului după click
    const isLiked = this.dataset.liked === 'true';
    this.dataset.liked = (!isLiked).toString();
    if (isLiked) {
      this.removeChild(likedImg);
      this.appendChild(unlikedImg);
    } else {
      this.removeChild(unlikedImg);
      this.appendChild(likedImg);
    }
  });

  return card;
};

// Fetch springs data
const loadSprings = async () => {
  try {
    springs = await getSprings();

    if (springs) {
      springs.forEach(item => {
        const card = createCard(item);
        if (springList) {
          springList.appendChild(card);
        } else {
          console.error("Elementul cu id-ul 'springList' nu a fost găsit în DOM.");
        }
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
