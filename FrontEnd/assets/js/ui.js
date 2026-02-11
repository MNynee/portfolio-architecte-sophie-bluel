import { getWorks } from "./api.js";

async function renderWorks() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const works = await getWorks();

  works.forEach((work) => {
    const article = document.createElement('figure')

    const articleImg = document.createElement('img')
    articleImg.src = work.imageUrl
    articleImg.alt = work.title

    const articleTitle = document.createElement('figcaption')
    articleTitle.innerText = work.title

    article.append(articleImg, articleTitle)
    gallery.appendChild(article)
  });
}

renderWorks();
