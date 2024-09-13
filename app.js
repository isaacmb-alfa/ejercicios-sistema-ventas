const vendedorSelec = document.querySelector('#vendedor');
const productoSelec = document.querySelector('#producto');
const precioText = document.querySelector('#precio');
const cantidadInput = document.querySelector('#cantidad');
const formulario = document.querySelector('#formulario');
const ventasJuana = document.querySelector('#ventas-juana tbody');
const ventasPedro = document.querySelector('#ventas-pedro tbody');
const totalVentasJuana = document.querySelector('#ventas-juana tfoot');
const totalVentasPedro = document.querySelector('#ventas-pedro tfoot');
const tablaTotales = document.querySelector('#tabla-totales tbody');
const premioDiv = document.querySelector('#premio');
// alertas
const toastLiveSuccess = document.getElementById('liveToastSuccess');
const toastLiveError = document.getElementById('liveToastError');


//buttons
const btnGuardar = document.querySelector('#guardar');
const btnGanador = document.querySelector('#ganador');

let arrVentasJuana = [];
let arrVentasPedro = [];
let ventasTotales = [];
let arrayshort = [];

let producto = {
    nombre: '',
    precio,
}
let venta = {
    vendedor: '',
    id: '',
    cantidad: 0,
    producto
}
document.addEventListener('DOMContentLoaded', () => {
    cargarVentas();
    imprimirVenta();
    totalXvendedor('Juana' || 'Pedro');
    imprimirTotales(ventasTotales);
});


// addEventListeners
productoSelec.addEventListener('change', (e) => {
    //cambia el valor del precio por producto seleccionado
    const productosLocal = JSON.parse(localStorage.getItem('Productos'));
    if (productosLocal) {
        for (let i = 0; i < productosLocal.length; i++) {
            const element = productosLocal[i];
            const nombreProducto = String(removeAccents(element.nombre)).toLowerCase();
            if (nombreProducto === e.target.value) {
                precioText.textContent = `$${element.precio} dls`;
                guardarProducto(nombreProducto, element.precio);
            }
        }
    }
});


// quitar acentos de los nombres para busqueda 
const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    if (vendedorSelec.value && productoSelec.value && Number(cantidadInput.value)) {
        let { nombre, precio } = producto;
        venta = {
            vendedor: vendedorSelec.value,
            cantidad: Number(cantidadInput.value),
            id: Date.now(),
            producto: {
                nombre,
                precio
            }
        }
        guardarVenta(venta);
        mostrarAlerta('Guardando venta', 'exito');
        precioText.textContent = '$0 dls',
            formulario.reset();
        return;

    }
    mostrarAlerta('Todos los datos son obligatorios', 'error');
});

//alertas

function mostrarAlerta(mensaje, tipo) {
    const toastBootstrapError = bootstrap.Toast.getOrCreateInstance(toastLiveError);
    const toastBootstrapSuccess = bootstrap.Toast.getOrCreateInstance(toastLiveSuccess);
    const mensajeEx = document.getElementById('mensajeEx');
    const mensajeEr = document.getElementById('mensajeEr');
    if (tipo === 'exito') {
        toastBootstrapSuccess.show();
        mensajeEx.textContent = mensaje;
        return;
    }
    toastBootstrapError.show();
    mensajeEr.textContent = mensaje;
}

function guardarVenta(venta) {

    const { vendedor, cantidad, producto: { nombre } } = venta;
    if (vendedor === 'Juana') {
        const productoExiste = arrVentasJuana.some(venta => venta.producto.nombre === nombre);
        if (productoExiste) {
            const productos = arrVentasJuana.map(ventaProducto => {
                if (ventaProducto.producto.nombre === nombre) {
                    ventaProducto.cantidad += cantidad;
                    console.log('entro aquí');
                    return ventaProducto;
                } else {

                    return ventaProducto;
                }
            });
            arrVentasJuana = [...productos];
        } else {
            arrVentasJuana = [...arrVentasJuana, venta];
        }
        guardarVentasLocal(vendedor, arrVentasJuana);
        imprimirVenta();
        totalXvendedor(vendedor);
        imprimirTotales(ventasTotales);


    } else if (vendedor === 'Pedro') {
        const productoExiste1 = arrVentasPedro.some(venta => venta.producto.nombre === nombre);
        if (productoExiste1) {
            const productos = arrVentasPedro.map(ventaProducto => {
                if (ventaProducto.producto.nombre === nombre) {
                    ventaProducto.cantidad += cantidad;
                    return ventaProducto;
                } else {
                    return ventaProducto;
                }
            });
            arrVentasPedro = [...productos];
        } else {
            arrVentasPedro = [...arrVentasPedro, venta];

        }
        guardarVentasLocal(vendedor, arrVentasPedro);
        imprimirVenta();
        totalXvendedor(vendedor);
        imprimirTotales(ventasTotales);
    }
};

function guardarProducto(nom, prec) {

    producto.nombre = nom;
    producto.precio = prec;
    return producto;

};
function guardarVentasLocal(vendedor, array) {
    localStorage.setItem(String(vendedor).toLowerCase(), JSON.stringify(array));
};

function imprimirVenta() {
    //limpiamos el html para evitar duplicados

    limpiarHTML('ventas');
    arrVentasJuana.forEach((venta, index) => {
        const { cantidad, id, producto: { nombre, precio } } = venta;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-capitalize" id="${id}">${nombre}</td>
            <td>${cantidad}</td>
            <td>$${precio * cantidad} dls</td>
            <td class="d-flex justify-content-center"><button class="btn btn-sm btn-danger" data-id="${id}">X</button></td>
            `;
        ventasJuana.appendChild(row);
    });
    arrVentasPedro.forEach((venta) => {
        // console.log(venta);

        const { cantidad, id, producto: { nombre, precio } } = venta;
        // console.log(venta);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="text-capitalize" id="${id}">${nombre}</td>
            <td>${cantidad}</td>
            <td>$${precio * cantidad} dls</td>
            <td class="d-flex justify-content-center"><button class="btn btn-sm btn-danger" data-id="${id}">X</button></td>
            `;
        ventasPedro.appendChild(row);
    });
}



function limpiarHTML(limpiar) {
    if (limpiar === 'ventas') {
        while (ventasJuana.firstChild || ventasPedro.firstChild) {
            if (ventasJuana.firstChild) {
                ventasJuana.removeChild(ventasJuana.firstChild);
            }
            if (ventasPedro.firstChild) {

                ventasPedro.removeChild(ventasPedro.firstChild);
            }
        }
    }
    if (limpiar === 'totales') {
        while (totalVentasJuana.firstChild || totalVentasPedro.firstChild) {
            if (totalVentasJuana.firstChild) {
                totalVentasJuana.removeChild(totalVentasJuana.firstChild);
            }
            if (totalVentasPedro.firstChild) {
                totalVentasPedro.removeChild(totalVentasPedro.firstChild);
            }
        }
    }
    if (limpiar === 'totalesVendedor') {
        while (tablaTotales.firstChild) {
            tablaTotales.removeChild(tablaTotales.firstChild);
        }
    }


}
function cargarVentas() {
    const ventasLocalJuana = JSON.parse(localStorage.getItem('juana')) || [];
    const ventasLocalPedro = JSON.parse(localStorage.getItem('pedro')) || [];
    if (ventasLocalJuana) {
        arrVentasJuana = ventasLocalJuana;
    }
    if (ventasLocalPedro) {
        arrVentasPedro = ventasLocalPedro;
    }

}
function totalXvendedor(vendedor) {
    limpiarHTML('totales');
    if (arrVentasJuana) {
        let totalCantidad = 0;
        let totalPrecio = 0;
        arrVentasJuana.forEach(venta => {
            const { cantidad, producto: { precio } } = venta;
            totalCantidad += cantidad;
            totalPrecio += (cantidad * precio);
        });
        const row = document.createElement('tr');
        row.className = 'fw-bold';
        row.innerHTML = `
            <td class="col">Totales</td>
            <td class="col">${totalCantidad}</td>
            <td class="col">$${totalPrecio} dls</td>
            `;
        totalVentasJuana.appendChild(row);
        guardarTotales('Juana', totalCantidad, totalPrecio);
        limpiarHTML('totalesVendedor');
    }
    if (arrVentasPedro) {
        let totalCantidad = 0;
        let totalPrecio = 0;
        arrVentasPedro.forEach(venta => {
            const { cantidad, producto: { precio } } = venta;
            totalCantidad += cantidad;
            totalPrecio += (cantidad * precio);
        });
        const row = document.createElement('tr');
        row.className = 'fw-bold';
        row.innerHTML = `
            <td class="col">Totales</td>
            <td class="col">${totalCantidad}</td>
            <td class="col">$${totalPrecio} dls</td>
            `;
        totalVentasPedro.appendChild(row);
        guardarTotales('Pedro', totalCantidad, totalPrecio);
        limpiarHTML('totalesVendedor');
    }
}
function guardarTotales(vendedor, cantidad, total) {
    let ventasXVendedorTotales = {
        vendedor: vendedor,
        cantidad: cantidad,
        precio: total
    }
    ventasTotales = [...ventasTotales, ventasXVendedorTotales];
    return ventasTotales;
}
function imprimirTotales(ventasTotales) {

    limpiarHTML('totalesVendedor');
    arrayshort = ventasTotales.slice(-2);

    arrayshort.forEach(ventasVendedor => {
        const { vendedor, cantidad, precio } = ventasVendedor
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="col">${vendedor}</td>
            <td class="col">${cantidad}</td>
            <td class="col">$${precio} dls</td>
            `;
        tablaTotales.appendChild(row);
    });
    return arrayshort;
};

btnGanador.addEventListener('click', (e) => {
    // console.log(arrayshort);
    let ganador = {
        vendedor: '',
        cantidad: 0,
        total: 0
    }
    arrayshort.forEach(element => {
        const { vendedor, cantidad, precio } = element;
        if (precio > ganador.total) {
            ganador = {
                vendedor: vendedor,
                cantidad: cantidad,
                total: precio
            }
            return ganador;
        }
    });
    premioDiv.querySelector('h4').textContent = ganador.vendedor;
    premioDiv.querySelector('p').innerHTML = `Por acumular $${ganador.total} dls en sus ${ganador.cantidad} ventas`
});

ventasJuana.addEventListener('click', (e) => {
    eliminarVentas(e);
});
ventasPedro.addEventListener('click', (e) => {
    eliminarVentas(e);
});

function eliminarVentas(e) {
    if (e.target.getAttribute('data-id')) {


        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger me-2"
            },
            buttonsStyling: false
        });
        swalWithBootstrapButtons.fire({
            title: "¿Estas Seguro?",
            text: "¡Esta acción no se puede revertir!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Borrar",
            cancelButtonText: "Conservar",
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                eliminarDelArray(e);
                swalWithBootstrapButtons.fire({
                    title: "Borrado",
                    text: "Las ventas han sido borradas",
                    icon: "success"
                });
            } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire({
                    title: "No se borraron las ventas",
                    text: "No se eliminó la información",
                    icon: "error"
                });
            }
        });
    }


}

function eliminarDelArray(e){
    if (ventasJuana.firstChild) {
        const ventaId = Number(e.target.getAttribute('data-id'));
        // console.log(ventasJuana.firstChild.firstChild.nextSibling.id);
        
        arrVentasJuana = arrVentasJuana.filter(venta => venta.id !== ventaId);   
        guardarVentasLocal('juana', arrVentasJuana);
        totalXvendedor('juana');
        imprimirVenta();
        imprimirTotales(ventasTotales);
        
    }
    if (ventasPedro.firstChild) {
        const ventaId = Number(e.target.getAttribute('data-id'));
        // console.log(ventasJuana.firstChild.firstChild.nextSibling.id);
        
        arrVentasPedro = arrVentasPedro.filter(venta => venta.id !== ventaId);   
        guardarVentasLocal('pedro', arrVentasPedro);
        totalXvendedor('pedro');
        imprimirVenta();
        imprimirTotales(ventasTotales);
    }
};
