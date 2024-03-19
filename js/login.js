//in lucru
import { displayErrorPopup } from "./lib/utils.js";

//  gt_isvor_admin
//  gt_isvor_admin_2024_gt

const loginForm = document.querySelector("#loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    const res = await fetch(
      "https://whereisvor-server.up.railway.app/api/v1/water-sources/auth/login",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (!res.ok) {
      throw new Error("Eroare la autentificare");
    }

    const { token } = await res.json();
    console.log(token);
    localStorage.setItem("token", token);

    // Accesam endpoint-ul admin dupa ce am primit token-ul
    const adminRes = await fetch(
      "https://whereisvor-server.up.railway.app/api/v1/water-sources/admin",
      {
        // method: 'GET',
        headers: {
          // 'Content-type': 'application/json',
          // Adaugam token-ul in header
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!adminRes.ok) {
      throw new Error("Eroare la accesarea endpoint-ului de admin");
    }

    const reader = await adminRes.text();
    console.log(reader);
    // window.location.assign(adminRes.url);
    // const adminData = await adminRes.json();
    // console.log(adminData);

    // Create a new HTML document from the fetched text
    const parser = new DOMParser();
    const newDocument = parser.parseFromString(reader, "text/html");

    // Replace the content of the current page with the content of the new document
    document.open();
    document.write(newDocument.documentElement.innerHTML);
    document.close();
  } catch (error) {
    displayErrorPopup(error.message);
    console.log(error.message);
  }
});
