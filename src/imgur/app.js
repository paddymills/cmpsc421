const CLIENT_ID = "fe6151027ddd8cf";

const headers = new Headers();
headers.append("Authorization", `Client-ID ${CLIENT_ID}`);

window.onload = async () => {
  await init();
};

async function init() {
  // get random word
  let res = await fetch(`https://random-word-api.herokuapp.com/word`);
  let data = await res.json();
  const randomWord = data[0];
  console.log(`Random word: ${randomWord}`);

  // get top images
  res = await fetch(`https://api.imgur.com/3/gallery/search/?q=${randomWord}`, {
    headers,
  });
  if (!res.ok) {
    alert("Failed to fetch top data");
    console.log(res);
    return;
  }

  data = await res.json();
  if (data.data.length < 5) {
    console.log("Lets get something better");
    return await init();
  }

  console.log(data);

  const cards_container = document.getElementById("cards");
  const cards = data.data.map(createCard);
  cards_container.append(...cards);
}

function createCard(data) {
  // console.log(data);
  const card_wrapper = document.createElement("div");
  card_wrapper.classList.add("col", "s2", "m3");

  const card = document.createElement("div");
  card.classList.add("card");

  // create card image
  const img_container = document.createElement("div");
  img_container.classList.add("card-image");
  let media = data.images !== undefined ? data.images[0] : data;
  if (media.type.startsWith("video")) {
    const video = document.createElement("video");
    video.src = media.link;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.height = 200;
    video.width = 300;
    img_container.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = media.link;
    img_container.appendChild(img);
  }
  const span = document.createElement("span");
  span.textContent = data.title;
  img_container.appendChild(span);

  // views, likes, comments
  const card_content = document.createElement("div");
  card_content.classList.add("card-content");
  const views = document.createElement("p");
  views.textContent = `Views: ${data.views}`;
  const likes = document.createElement("p");
  likes.textContent = `Likes: ${data.ups}`;
  const comments = document.createElement("p");
  comments.textContent = `Comments: ${data.comment_count || 0}`;
  card_content.appendChild(views);
  card_content.appendChild(likes);
  card_content.appendChild(comments);

  const card_actions = document.createElement("div");
  card_actions.classList.add("card-action");
  const view = document.createElement("a");
  view.href = "#";
  view.classList.add("waves-effect", "waves-light", "btn", "modal-trigger");
  view.textContent = "View details";
  view.addEventListener("click", async (e) => {
    e.preventDefault();

    // fetch comments
    await renderComments(data.id);
  });
  card_actions.appendChild(view);

  card.appendChild(img_container);
  card.appendChild(card_content);
  card.appendChild(card_actions);

  card_wrapper.appendChild(card);

  return card_wrapper;
}

async function renderComments(id) {
  const res = await fetch(
    `https://api.imgur.com/3/gallery/${id}/comments/best`,
    {
      headers,
    },
  );
  const comments = await res.json();
  console.log(comments);

  const dialog = document.getElementById("comments");
  const commentsList = document.getElementById("comments-ls");

  for (const comment of comments.data) {
    const li = document.createElement("li");
    const div = document.createElement("div");
    div.classList.add("collapsible-header");

    const icon = document.createElement("i");
    icon.classList.add("material-icons");
    icon.textContent = "comment";

    const p = document.createElement("p");
    p.classList.add("truncate");
    p.textContent = comment.comment;
    const span = document.createElement("span");
    span.classList.add("badge");
    span.textContent = comment.author;

    const body = document.createElement("div");
    body.classList.add("collapsible-body");
    body.textContent = comment.comment;

    div.appendChild(icon);
    div.appendChild(p);
    div.appendChild(span);
    div.appendChild(body);

    li.appendChild(div);
    commentsList.appendChild(li);
  }

  dialog.showModal();
}
