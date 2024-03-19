import { displayErrorPopup } from './lib/utils.js';

const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#emailAddress');
const messageInput = document.querySelector('#message');
const formBtn = document.querySelector('#formSend');

const nameRegex = /^[a-zA-Z ]{1,30}$/;
const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;

function displaySuccessPopup() {
  const successModal = document.createElement('div');
  successModal.innerHTML = `
        <div class="modal fade modal-no-backdrop" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title text-success" id="errorModalLabel">Succes</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>Mesajul a fost trimis cu succes!</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary text-success" data-bs-dismiss="modal">Închide</button>
              </div>
            </div>
          </div>
        </div>`;
  document.body.appendChild(successModal);
  const successModalInstance = new bootstrap.Modal(document.getElementById('errorModal'), {
    backdrop: false,
  });
  successModalInstance.show();
}

formBtn.addEventListener('click', e => {
  e.preventDefault();

  if (!nameRegex.test(nameInput.value.trim())) {
    displayErrorPopup('Numele trebuie sa fie de cel putin 2 litere.');
  } else if (!emailRegex.test(emailInput.value)) {
    displayErrorPopup('Adresa de email nu este valida.');
  } else if (messageInput.value.length < 2) {
    displayErrorPopup('Mesajul trebuie sa fie mai lung de 1 caracter.');
  } else {
    displaySuccessPopup();
    nameInput.value = '';
    emailInput.value = '';
    messageInput.value = '';
  }
});
