import { getWorks, loginUser, getWorkById, getCategories } from "./api.js";

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
        deleteButton.addEventListener('click', async () => {
            try {
                await deleteWork(work.id)
                renderWorks(modalGallery, works)
                renderWorks(gallery, works)
            } catch (error) {
                alert('On n\'arrive pas à supprimer cet ouvrage.')
                throw error
            }
        })

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
    const galleryTitle = document.querySelector('.portfolio-title')

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
const modalNav = document.getElementById('modal-nav-1');
const modalContent = document.getElementById('modal-content-1');
const modalNav2 = document.getElementById('modal-nav-2'); 
const modalContent2 = document.getElementById('modal-content-2');

btnEditWorks.addEventListener('click', openModal)

function openModal() {
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-close-modal').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

// Close modal

const btnCloseModal = document.getElementById('close-modal');
btnCloseModal.addEventListener('click', closeModal)

function closeModal() {
    if (modal.classList.contains('modal-2')) {
        resetForm()
        modal.classList.remove('modal-2');
        modalNav2.style.display = 'none';
        modalContent2.style.display = 'none';
        modalNav.style.display = 'flex';
        modalContent.style.display = 'block';
    }
    modal.style.display = 'none';
    // modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.querySelector('.js-close-modal').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
}

function stopPropagation(e) {
    e.stopPropagation();
}

// Change between modals

const btnAddWork = document.getElementById('btn-add-work');
btnAddWork.addEventListener('click', changeModal)

const btnReturnModal = document.getElementById('return-modal');
btnReturnModal.addEventListener('click', changeModal)

function changeModal() {
     if (modal.classList.contains('modal-2')) {
        modal.classList.remove('modal-2');
        modalNav2.style.display = 'none';
        modalContent2.style.display = 'none';
        modalNav.style.display = 'flex';
        modalContent.style.display = 'block';
        resetForm()
    } else {
        modal.classList.add('modal-2');
        modalNav.style.display = 'none';
        modalContent.style.display = 'none';
        modalNav2.style.display = 'flex';
        modalContent2.style.display = 'block';
    }
}

// Add new project

// - Reading image file

const imgContainer = document.querySelector('.img-container')
const inputUpload = document.getElementById('img-upload')

imgContainer.addEventListener('click', () => {
    inputUpload.click()
})

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            resolve({ url: reader.result, name: file.name})
        }
        reader.onerror = () => {
            reject(`On n\'arrive pas a lire le fichier ${file.name}`)
        }

        reader.readAsDataURL(file)
    })
}

const imgUploaded = document.getElementById('upload-image')
const btnUpload = document.getElementById('btn-upload')
const btnInfo = document.getElementById('upload-info')

inputUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0]
    if (file) {
        try {
            const fileContent = await readFileContent(file)
            imgUploaded.src = fileContent.url
            if (imgUploaded.src !== ".assets/icons/upload-image.png") {
                imgContainer.style.padding = '0'
                imgUploaded.style.maxHeight = '169px'
                btnUpload.style.display = 'none'
                btnInfo.style.display = 'none'
            }
        } catch (error) {
            alert ('On n\'arrive pas à lire ce fichier.')
            throw error
        }
    }
})

// - Generate categories options

async function renderCategories() {
    const categoriesSelect = document.getElementById('category')
    const categories = await getCategories()
    categories.forEach((category) => {
        const optionElement = document.createElement('option')
        optionElement.value = category.name
        optionElement.innerText = category.name
        categoriesSelect.appendChild(optionElement)
    })
}

// Reset form

function resetForm() {
    const form = document.getElementById('modal-form')
    form.reset()

    imgContainer.style.padding = '22px 0 19px'
    imgUploaded.src = "./assets/icons/upload-image.png"
    btnUpload.style.display = 'block'
    btnInfo.style.display = 'block'
}

// FUNCTION CALLS

renderWorks(gallery, works);
renderWorks(modalGallery, works);
if (document.getElementById('login-form')) {
    loginUser();
}
updateNavAfterAuthentication()
renderCategories()
