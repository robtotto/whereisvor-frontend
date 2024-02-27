// https://whereisvor-server.up.railway.app/api/v1/water-sources
export async function getSprings() {
  try {
    const res = await fetch('https://whereisvor-server.up.railway.app/api/v1/water-sources');
    const data = await res.json();
    return data;
  } catch (error) {
    displayErrorPopup('Error displaying springs. Please try again later.');
  }
}

////////////////////// Calculate Distances //////////////////////////
export async function getDistanceToWaterSpring(userLng, userLat, targetSpring) {
  try {
    // get distance
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${userLng},${userLat};${targetSpring.coordinate[0]},${targetSpring.coordinate[1]}?alternatives=false&geometries=geojson&overview=simplified&steps=false&access_token=pk.eyJ1IjoiYm9nZGFuLTI4IiwiYSI6ImNsczNobDdicDB5cWcydm1lOGtnMXZjYWkifQ.UI-Umu7Pb1hHE2ZsQ7DYBQ`
    );

    const data = await response.json();
    const distance = (data.routes[0].distance / 1000).toFixed(2); //km

    return distance;
  } catch (error) {
    displayErrorPopup(
      `Error calculating distance for "${targetSpring.name}". Please try again later.`
    );
  }
}

///////////////////////Generate HTML for popups ///////////////////
export function generatePopupHTML(spring, distance = null) {
  // Custom popup:
  return !distance
    ? `
    <div id="popup-card" class="overflow-hidden card">
          <div class="row g-0">
          <div class="col-4 pupup-image">
          <img src="${spring.image}" class="img-spring-card" alt="img">
        </div>
          <div class="col-8">
            <div class="card-body">
              <h4 class="card-title">${spring.name}</h4>
              <p class="card-text">
                <img
                  src="Images/heart-symbol.svg"
                  class="position-absolute bottom-0 end-0 heart-card"
                  id="heartCard"
                  alt="heart-symbol" />
              </p>
            </div>
          </div>
        </div>
    </div>
        
    `
    : `
    <div class="overflow-hidden card">
          <div class="row g-0">
          <div class="col-4">
          <img src="${spring.image}" class="img-spring-card" alt="img">
          </div>
          <div class="col-8">
            <div class="card-body">
            <h4 class="card-title">${spring.name}</h4>
              <h4
              <p class="card-text-km">${distance} km</p>
              <p class="card-text">
                <img
                  src="Images/heart-symbol.svg"
                  class="position-absolute bottom-0 end-0 heart-card"
                  id="heartCard"
                  alt="heart-symbol" />
              </p>
            </div>
          </div>
        </div>
      </div> 
      `;
}

////////////////// HANDLE ERROR ////////////////////////////////
export function displayErrorPopup(errorMessage) {
  const errorModal = document.createElement('div');
  errorModal.innerHTML = `
    <div class="modal fade modal-no-backdrop" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger" id="errorModalLabel">Error</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>${errorMessage}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary text-danger" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append the modal to the body of your HTML
  document.body.appendChild(errorModal);

  // Show the modal
  const errorModalInstance = new bootstrap.Modal(document.getElementById('errorModal'), {
    backdrop: false,
  });
  errorModalInstance.show();
}

//////////////////////Update likes ////////////////////
export async function updateLikeCounter(id, springToUpdate) {
  const res = await fetch(`http://localhost:8000/izvoare/${id}`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ ...springToUpdate, likeCounter: springToUpdate.likeCounter + 1 }),
  });

  const data = await res.json();
  console.log(data);
  return data;
}
