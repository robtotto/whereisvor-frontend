import {
  getSprings,
  displayErrorPopup,
  updateLikeCounter,
  decimalToDMS,
  toTitleCase,
} from './lib/utils.js';

import { accessToken, colorMarker, skinMapbox, containerMapbox } from '../globals.js';

// Preluare detalii izvor dupa nume
async function getSpringDetails(springName) {
  try {
    const springs = await getSprings();
    const spring = springs.find(spring => spring.name === springName);

    // Modificare titlu document
    document.title = `Detalii izvoare - ${toTitleCase(spring.name)}`;

    return spring;
  } catch (error) {
    console.error(error);
    displayErrorPopup(
      'A apărut o eroare în timp ce încercam să accesăm informațiile. Te rugăm să verifici conexiunea și să reîncărci pagina.'
    );
  }
}

// Pagina unui izvor
async function renderSpringDetails() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const springName = urlParams.get('izvor');

    if (!springName) {
      console.error('Invalid spring name');
      return;
    }

    // Preluare detalii izvor dupa nume
    const springDetails = await getSpringDetails(springName);

    if (!springDetails) {
      console.error('Spring details not found');
      return;
    }

    // Adaugare harta pe pagina
    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: containerMapbox,
      style: skinMapbox,
      center: [springDetails.longitude, springDetails.latitude], // pozitia de inceput [lng, lat]
      cooperativeGestures: true,
      zoom: 10,
    })
      .addControl(new mapboxgl.NavigationControl())
      .addControl(new mapboxgl.ScaleControl());

    const popupContent = `
      <div class="spring-map-marker-popup text-center">
       <div class = "fw-bold h6 mb-3 springTitle">
        <h3 class="fw-bold h6 mb-3 text-capitalize springTitle">${springDetails.name}</h3>
       </div>
        <a class="btn btn-success rounded-pill btn-sm px-3 springCoordinatesLink"
        href="https://www.google.com/maps/dir/?api=1&destination=${springDetails.latitude},${springDetails.longitude}" target="_blank" rel="nofollow">Direcții către izvor</a>
      </div>
    `;

    // create the popup
    const popup = new mapboxgl.Popup().setHTML(popupContent);

    // Crearea markerului
    const marker = new mapboxgl.Marker({
      color: colorMarker,
    })
      .setLngLat([springDetails.longitude, springDetails.latitude])
      .setPopup(popup)
      .addTo(map);

    // Elementele care urmeaza sa fie populate dinamic
    const springTitle = document.querySelector('.springTitle');
    const springLikeCounter = document.querySelector('.springItemCardHeartNumber');
    const springCoordinatesLink = document.querySelector('.springCoordinatesLink');

    const springLatitude = document.querySelector('.springCoordinatesLat');
    const springLongitude = document.querySelector('.springCoordinatesLon');
    const springDescription = document.querySelector('.springDescription');

    // Convertirea latitudinii și longitudinii în grade, minute și secunde, cu indicațiile de direcție
    const latitudeDMS = decimalToDMS(springDetails.latitude, 'N' + '');
    const longitudeDMS = decimalToDMS(springDetails.longitude, 'E');

    // Popularea elementelor
    springTitle.textContent = springDetails.name;
    springLatitude.textContent = latitudeDMS;
    springLongitude.textContent = longitudeDMS;
    springLikeCounter.textContent = springDetails.likeCounter;

    if (springDetails.description) {
      springDescription.textContent = springDetails.description;
    } else {
      springDescription.innerHTML = `<div class="hr-danger"><hr /></div>`;
    }

    springCoordinatesLink.href = `https://www.google.com/maps/dir/?api=1&destination=${springDetails.latitude},${springDetails.longitude}`;
    springCoordinatesLink.target = '_blank';
    springCoordinatesLink.rel = 'nofollow';

    // Imagine izvor
    const springImage = document.querySelector('.spring-img');
    springImage.src = springDetails.image;

    // Copiaza link-ul paginii (add-to-any)
    const copyLinkBtn = document.querySelector('.a2a_kit');

    if (copyLinkBtn) {
      const currentUrl = window.location.href;
      copyLinkBtn.setAttribute('data-a2a-url', currentUrl);
    }

    const titluIzvor = document.querySelector('.springShare');

    if (titluIzvor) {
      titluIzvor.setAttribute('data-a2a-title', springDetails.name);
    } else {
      displayErrorPopup('Nu s-au putut extrage datele.');
    }

    // Adaugare like
    const likeBtn = document.querySelector('.springHeart');
    likeBtn.dataset.id = springDetails.id;
    // Extragem din local storage informatia cu privire la existenta like-ului
    likeBtn.dataset.liked = localStorage.getItem(springDetails.id) ? 'true' : 'false';

    const unlikedImg = likeBtn.querySelector('.unliked');
    const likedImg = likeBtn.querySelector('.liked');
    const likeCounter = likeBtn.querySelector('.springItemCardHeartNumber');

    likeBtn.addEventListener('click', async function () {
      //previne dublu click sau click daca izvorul e deja "liked"
      if (this.clicked || JSON.parse(localStorage.getItem(springDetails.id))) {
        return;
      }

      this.clicked = true;

      const springToUpdate = springDetails;

      try {
        const updatedSpring = await updateLikeCounter(springToUpdate);
        const likeCount = updatedSpring.likeCounter;

        // Salvam aprecierea izvorului in local storage
        localStorage.setItem(updatedSpring.id, JSON.stringify(true));

        likeCounter.textContent = likeCount;

        // Toggle hearts liked/unliked
        likedImg.classList.toggle('liked', updatedSpring.isLiked);
        unlikedImg.classList.toggle('unliked', !updatedSpring.isLiked);
      } catch (error) {
        console.log(error);
        displayErrorPopup(
          'A apărut o eroare în timp ce încercam să accesăm informațiile. Te rugăm să verifici conexiunea și să reîncărci pagina.'
        );
      }

      const isLiked = this.dataset.liked === 'true';
      this.dataset.liked = (!isLiked).toString();
    });
  } catch (error) {
    console.error(error);
    displayErrorPopup(
      'A apărut o eroare în timp ce încercam să accesăm informațiile. Te rugăm să verifici conexiunea și să reîncărci pagina.'
    );
  }
}

document.addEventListener('DOMContentLoaded', renderSpringDetails);
