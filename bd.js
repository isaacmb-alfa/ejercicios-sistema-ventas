const productos = [
    {
        nombre: 'Aqua',
        precio: 200
    },
    {
        nombre: 'Emoción',
        precio: 180
    },
    {
        nombre: 'Alegría',
        precio: 160
    },
    {
        nombre: 'Frescura',
        precio: 150
    },

];

localStorage.setItem('Productos', JSON.stringify(productos));

const vededores = [
    {
        nombre: 'Juana',
        password: 12345
    },
    {
        nombre: 'Pedro',
        password: 12345
    },

];
localStorage.setItem('Vendedores', JSON.stringify(vededores));