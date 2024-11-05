const urlBase = 'https://jsonplaceholder.typicode.com/posts';
let posts = [];

async function getData() {
    try {
        const res = await fetch(urlBase);
        posts = await res.json();
        renderPostList();
    } catch (error) {
        console.error('Error al llamar a la API', error);
    }
}

getData();

function renderPostList() {
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.classList.add('postItem');
        listItem.innerHTML = `
            <strong>${post.title}</strong>
            <p>${post.body}</p>
            <button onclick="editPost(${post.id})">Editar</button>
            <button onclick="deletePost(${post.id})">Borrar</button>

            <div id="editForm-${post.id}" class="editForm" style="display: none">
                <label for="editTitle">Título: </label>
                <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
                <label for="editBody">Comentario: </label>
                <textarea id="editBody-${post.id}" required>${post.body}</textarea>
                <button onclick="updatePost(${post.id})">Actualizar</button>
            </div>
        `;
        postList.appendChild(listItem);
    });
}

async function postData() {
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;

    if (postTitle.trim() === '' || postBody.trim() === '') {
        alert('Los campos son obligatorios');
        return;
    }

    try {
        const res = await fetch(urlBase, {
            method: 'POST',
            body: JSON.stringify({
                title: postTitle,
                body: postBody,
                userId: 1,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const data = await res.json();
        posts.unshift(data);
        renderPostList();
        postTitleInput.value = '';
        postBodyInput.value = '';
    } catch (error) {
        console.error('Error al querer crear posteo: ', error);
    }
}

function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display === 'none') ? 'block' : 'none';
}

async function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    try {
        const res = await fetch(`${urlBase}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                id: id,
                title: editTitle,
                body: editBody,
                userId: 1,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const data = await res.json();
        const index = posts.findIndex(post => post.id === data.id);
        
        if (index !== -1) {
            posts[index] = data;
        } else {
            alert('Hubo un error al actualizar la información del posteo');
        }
        renderPostList();
    } catch (error) {
        console.error('Error al querer actualizar posteo: ', error);
    }
}

async function deletePost(id) {
    try {
        const res = await fetch(`${urlBase}/${id}`, {
            method: 'DELETE',
        });
        
        if (res.ok) {
            posts = posts.filter(post => post.id !== id);
            renderPostList();
        } else {
            alert('Hubo un error y no se pudo eliminar el posteo');
        }
    } catch (error) {
        console.error('Hubo un error; ', error);
    }
}
