// Get list of works from API

async function getWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  } catch (error) {
    alert("On n'arrive pas à trouver les ouvrages.");
    throw error;
  }
}

// Send credentials to authenticate login

async function loginUser() {
  const loginForm = document.getElementById("login-form");
  
  if (!loginForm) return;

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const userData = {
        email: document.getElementById("userEmail").value,
        password: document.getElementById("userPassword").value,
      };
      const payload = JSON.stringify(userData);
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorElement = document.querySelector("#error-message p");
        errorElement.parentElement.hidden = false;
        return;

      } else {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        window.location.href = "../index.html";
      }
    } catch (error) {
      alert("Erreur de connexion.");
      throw error;
    }
  });
}

// Get list of categories from API

async function getCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
  } catch (error) {
    alert("On n'arrive pas à trouver les catégories.");
    throw error;
  }
}

// Send new work data to API

const token = localStorage.getItem("token");

async function addNewWork(imageFile, title, categoryId) {
  try {
    if (!token) {
      alert("Vous devez être connecté pour ajouter un ouvrage.");
      throw new Error("Not authenticated");
      window.location.href = "../pages/login.html";
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", imageFile);
    formData.append("category", categoryId);

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || `Request failed: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    alert("On n'arrive pas à ajouter cet ouvrage.");
    throw error;
  }
}

// Delete work data from API

async function deleteWork(workId) {
  try {
    await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    alert("On n'arrive pas à supprimer cet ouvrage.");
    throw error;
  }
}

export {
  getWorks,
  loginUser,
  getCategories,
  addNewWork,
  deleteWork,
};
