const list = document.querySelector("#list");

const fetchData = async () => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");

    if (!res.ok) {
      throw new Error("eroare");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const data = await fetchData();
console.log(data);

data.forEach((el) => {
  const li = document.createElement("li");
  const h3 = document.createElement("h3");
  const p = document.createElement("p");
  const button = document.createElement("button");
  h3.innerText = el.title;
  p.innerText = el.body;
  button.innerText = "Detalii";

  button.addEventListener("click", () => {
    window.location.href = `../izvor/index.html?id=${el.id}`; 
  });

  li.append(h3, p, button); 
  list.append(li);
});
  list.append(li);
