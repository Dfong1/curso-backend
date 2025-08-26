
const socket = io();

socket.on('newProduct', (product) => {
    console.log(product);
    const container = document.getElementById('list-products');
    const html = `
        <div class="col-md-4 col-sm-12 mt-3" data-id="${product.id}">
            <div class="card">
                <div class="card-body">
                    <div class="product w-100">
                        <div class="d-flex">
                            <div class="justify-content-center align-items-center">
                                <div class="" style="height: 150px;">
                                    ${product.thumbnails.length ? `<img src="${product.thumbnails[0]}" class="m-auto w-auto h-100" alt="${product.title}">` : `<p>No image available</p>`}
                                </div>
                            </div>
                        </div>
                        <hr>
                        <h3>${product.title}</h3>
                        <p><b>Precio:</b> ${product.price}</p>
                        <p>${product.description}</p>
                        <p><b>Stock:</b> ${product.stock}</p>
                        <p><b>Categoría:</b> ${product.category}</p>
                        <div class="row">
                            <button class="col-8 btn btn-primary" disabled>Agregar al carrito</button>
                            <button class="btn btn-danger col-4 delete-producto" data-id="${product.id}">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    console.log('New product added:', product);
});

socket.on('deleteProduct', (productId) => {
    const productElement = document.querySelector(`.col-md-4[data-id="${productId}"]`);
    if (productElement) {
        productElement.remove();
    }
});


const form = document.getElementById('addProductForm');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const product = Object.fromEntries(formData);

    product.thumbnails = product.thumbnails ? product.thumbnails : [];
    product.price = product.price ? parseFloat(product.price) : 0;
    product.stock = product.stock ? parseInt(product.stock) : 0;

    product.status = true;

    console.log(product)

    const res = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });
    if (!res.ok) {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
        return;
    }
    form.reset();
});

// .delete-producto
const deleteButtons = document.querySelectorAll('.delete-producto');
deleteButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const productId = button.getAttribute('data-id');
        console.log(productId)
        const res = await fetch(`http://localhost:8080/api/products/${productId}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            const errorData = await res.json();
            alert(`Error: ${errorData.error}`);
            return;
        }
    });
});