    async function getWorks() {
        try {
            const response = await fetch('http://localhost:5678/api/works')
            return await response.json()
        } catch (error) {
            alert('On n\'arrive pas à trouver les ouvrages.')
            throw error
        }
    }

    async function loginUser() {
        const loginForm = document.getElementById('login-form')
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault()
            try {
                const userData = {
                    email: document.getElementById('userEmail').value,
                    password: document.getElementById('userPassword').value
                }
                const payload = JSON.stringify(userData)
                const response = await fetch('http://localhost:5678/api/users/login', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json"},
                    body: payload
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    const errorElement = document.querySelector('#error-message p')
                    errorElement.parentElement.hidden = false
                    return
                } else {
                    const data = await response.json()
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('userId', data.userId)
                    window.location.href = '../index.html'
                }
    
            } catch (error) {
                alert('Erreur de connexion.')
                throw error
            }
        })
    }  

    async function getWorkById(workId) {
        try {
            const response = await fetch(`http://localhost:5678/api/works/${workId}`)
            return await response.json()
        } catch (error) {
            alert('On n\'arrive pas à trouver cet ouvrage.')
            throw error
        }
    }

    async function getCategories() {
        try {
            const response = await fetch('http://localhost:5678/api/categories')
            return await response.json()
        } catch (error) {
            alert('On n\'arrive pas à trouver les catégories.')
            throw error
        }
    }

    const token = localStorage.getItem('token')

    async function addNewWork(work) {
        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`},
                body: JSON.stringify(work)
            })

            return await response.json()
        } catch (error) {
            alert('On n\'arrive pas à ajouter cet ouvrage.')
            throw error
        }
    }

    async function deleteWork(workId) {
        try {
            await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}`},
            })
        } catch (error) {
            alert('On n\'arrive pas à supprimer cet ouvrage.')
            throw error
        }
    }

    export {getWorks, loginUser, getWorkById, getCategories, addNewWork, deleteWork}