    async function getWorks() {
        try {
            const response = await fetch('http://localhost:5678/api/works')
            return await response.json()
        } catch (error) {
            alert('On n\'arrive pas à trouver les ouvrages.')
            throw error
        }
    }

    export {getWorks}