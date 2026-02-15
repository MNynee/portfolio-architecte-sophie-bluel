import { getWorks, loginUser } from "./api.js";

const works = await getWorks();
const gallery = document.getElementById("gallery");
const modalGallery = document.querySelector('.modal-gallery');

// Afficher tous les projets

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
        deleteButton.addEventListener('click', () => deleteWork())

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

// Open edit gallery modal

const btnEditWorks = document.getElementById('edit-button');
const modal = document.getElementById('modal');

btnEditWorks.addEventListener('click', () => {
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
})

// Close modal

const btnCloseModal = document.getElementById('close-modal');
btnCloseModal.addEventListener('click', closeModal)

function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
}

function stopPropagation(e) {
    e.stopPropagation();
}

// Open add new work modal

const btnAddWork = document.getElementById('btn-add-work');

btnAddWork.addEventListener('click', () => {
    const modalWrapper = document.querySelector('.modal-wrapper');
    modalWrapper.innerHTML = `
    <div class="modal-nav">
			<img src="assets/icons/return-modal.svg" alt="Retourner" class="return-modal" id="return-modal">
			<img src="assets/icons/close-modal.svg" alt="Fermer" class="close-modal" id="close-modal">
		</div>
		<div class="modal-content">
			<h3 class="modal-title">Ajout photo</h3>
			<form class="modal-form">
                <div class="img-container"></div>
            </form>
			<hr>
			<button class="button-add" id="btn-send-work">Ajouter une photo</button>
		</div>
    `
})

// FUNCTION CALLS

renderWorks(gallery, works);
renderWorks(modalGallery, works);
if (document.getElementById('login-form')) {
    loginUser();
}
updateNavAfterAuthentication()
