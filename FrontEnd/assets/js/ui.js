import { getWorks } from "./api.js";

// Afficher tous les projets
const works = await getWorks();

async function renderWorks(worksList) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  worksList.forEach((work) => {
    const article = document.createElement('figure')
    article.classList.add('gallery-work')

    const articleImg = document.createElement('img')
    articleImg.src = work.imageUrl
    articleImg.alt = work.title

    const articleTitle = document.createElement('figcaption')
    articleTitle.innerText = work.title

    article.append(articleImg, articleTitle)
    gallery.appendChild(article)
  });
}

// Changer affichage des boutons de filtrage

const filterButtons = document.querySelectorAll('.btn-filter')

filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const activeFilter = document.querySelector('.active')
        activeFilter.classList.toggle('active')
        button.classList.toggle('active')
    })
})

// Filtres

const btnFilterAll = document.getElementById('btn-filter-all')
const btnFilterObjets = document.getElementById('btn-filter-objets')
const btnFilterApparts = document.getElementById('btn-filter-apparts')
const btnFilterHotels = document.getElementById('btn-filter-hotels')

btnFilterAll.addEventListener('click', () => {
    const filteredWorks = works.filter(work => {
        return work.title
    })
    renderWorks(filteredWorks)
})

btnFilterObjets.addEventListener('click', () => {
    const filteredWorks = works.filter(work => {
        return work.category.name === "Objets"
    })
    renderWorks(filteredWorks)
})

btnFilterApparts.addEventListener('click', () => {
    const filteredWorks = works.filter(work => {
        return work.category.name === "Appartements"
    })
    renderWorks(filteredWorks)
})

btnFilterHotels.addEventListener('click', () => {
    const filteredWorks = works.filter(work => {
        return work.category.name === "Hotels & restaurants"
    })
    renderWorks(filteredWorks)
})


renderWorks(works);
