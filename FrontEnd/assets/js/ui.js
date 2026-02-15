import { getWorks, loginUser } from "./api.js";

// Afficher tous les projets
const works = await getWorks();
const gallery = document.getElementById("gallery");
const modalGallery = document.querySelector('.modal-gallery');

async function renderWorks(galleryName, worksList) {
  galleryName.innerHTML = "";

  worksList.forEach((work) => {
    const article = document.createElement("figure");
    article.classList.add("gallery-work");

    const articleImg = document.createElement("img");
    articleImg.src = work.imageUrl;
    articleImg.alt = work.title;

    if (galleryName === gallery) {
        const articleTitle = document.createElement("figcaption");
        articleTitle.innerText = work.title;

        article.append(articleImg, articleTitle);
    }
    if (galleryName === modalGallery) {
        const deleteButton = document.createElement("button");
        deleteButton.setAttribute('id', 'delete-button');
        const deleteIcon = document.createElement("img");
        deleteIcon.src = "./assets/icons/delete-button.svg";
        deleteIcon.alt = "Delete";

        deleteButton.appendChild(deleteIcon);
        article.append(articleImg, deleteButton);
    }

    galleryName.appendChild(article);
  });
}

// Changer affichage des boutons de filtrage

const filterButtons = document.querySelectorAll(".btn-filter");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const activeFilter = document.querySelector(".active");
    activeFilter.classList.toggle("active");
    button.classList.toggle("active");
  });
});

// Filtres

filterButtons.forEach((button) => {
  let filterName = button.getAttribute("name");
  button.addEventListener("click", () => filterByCategory(filterName));

  function filterByCategory(filterName) {
    works.forEach((work) => {
      let filterValue = filterName.toLowerCase();
      let filteredWorks = works.filter((work) => {
        return filterValue === "all"
          ? work.title
          : work.category.name.toLowerCase() === filterValue;
      });

      renderWorks(gallery, filteredWorks);
    });
  }
});

// Update page after authentication

function updateNavAfterAuthentication() {
    const loginLink = document.getElementById('login-link')
    const editHeader = document.querySelector('.edit-mode-header')
    const editButton = document.getElementById('edit-button')
    const filters = document.querySelector('.filters')
    const galleryTitle = document.querySelector('.title')

    if (localStorage.getItem('token')) {
        loginLink.innerText = 'logout';
        loginLink.href = '#'
        loginLink.addEventListener('click', (event) => {
            event.preventDefault()
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            window.location.reload()
        })

        editHeader.style.display = 'flex'
        editButton.style.display = 'flex'
        filters.style.display = 'none'
        galleryTitle.style.marginBottom = '92px'
    } else {
        loginLink.innerText = 'login'
        loginLink.href = 'pages/login.html'
    }
}

// MODAL FUNCTIONS

// Modify gallery

const btnEditWorks = document.getElementById('edit-button');

btnEditWorks.addEventListener('click', () => {
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
})


// Function calls

renderWorks(gallery, works);
renderWorks(modalGallery, works);
if (document.getElementById('login-form')) {
    loginUser();
}
updateNavAfterAuthentication()
