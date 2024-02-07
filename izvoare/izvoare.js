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
  h3.innerText = el.title;
  p.innerText = el.body;
  li.append(h3, p);
  list.append(li);
});
