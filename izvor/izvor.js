
export const fetchSinglePost = async (postId) => {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);

    if (!res.ok) {
      throw new Error("eroare");
    }

    const post = await res.json();
    return post;
  } catch (error) {
    console.log(error.message);
  }
};

export const displaySinglePost = async (postId) => {
  try {
    const post = await fetchSinglePost(postId);

    const container = document.querySelector("#containerIzvor");
    container.innerHTML = `
      <h1>${post.title}</h1>
      <p>${post.body}</p>
      <button id="likeButton">Like <span id="likeCounter"></span></button>
    `;

    document.title = post.title;

    const likeButton = document.getElementById("likeButton");
    const likeCounter = document.getElementById("likeCounter");
    const likedKey = `liked_${postId}`;
    
    let likes = parseInt(localStorage.getItem(likedKey)) || 0;
    likeCounter.innerText = likes > 0 ? `(${likes})` : '';

    if (localStorage.getItem(likedKey)) {
      likeButton.disabled = true;
    }

    likeButton.addEventListener("click", () => {
      if (!localStorage.getItem(likedKey)) {
        likes++;
        likeCounter.innerText = likes > 0 ? `(${likes})` : '';
        localStorage.setItem(likedKey, likes);
        likeButton.disabled = true;
      }
    });
  } catch (error) {
    console.error('Eroare:', error);
  }
};

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');
displaySinglePost(postId);