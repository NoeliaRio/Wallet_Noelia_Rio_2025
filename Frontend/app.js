function ListarRegistros() {
    fetch("https://localhost:7254/API_ABBA/ListarRegistros")
    .then(response => {
        if (!response.ok) {
            alert(response.status);
        }
        return response.json();
    })
    .then(data => {
        mostrarResumenCriptos(data); // Mostrar el resumen
        mostrarRegistros(data);     // Mostrar el listado detallado
    })
    .catch(error => console.error("Error al obtener registros:", error));
}

function mostrarRegistros(registros) {
    const lista = document.getElementById("listaRegistros");
    lista.innerHTML = "";

    // Ordenar por fecha (más reciente primero)
    registros.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    registros.forEach(registro => {
        const item = document.createElement("li");
        item.className = "registro-item";

        const fecha = new Date(registro.fecha);
        const fechaFormateada = fecha.toLocaleString();
        
        // Determinar color según operación (Azul compra Naranja venta por ahora)
        const color = registro.operacionId === 1 ? 'blue' : 'orange';
        const tipoOperacion = registro.operacionId === 1 ? 'COMPRA' : 'VENTA';
        
        item.innerHTML = `
            <span style="color: #666;">${fechaFormateada}</span> - 
            <strong>${registro.criptomoneda}</strong> - 
            <span style="color: ${color};">${tipoOperacion}</span> - 
            Cantidad: ${registro.cantidad} - 
            Valor: $${registro.valor} - 
            Total: $${registro.totalCompra} - 
            Exchange: ${registro.exchange}
        `;
        
        lista.appendChild(item);
    });
}

function mostrarResumenCriptos(registros) {
    const resumen = {
        BTC: { compras: 0, ventas: 0, balance: 0 },
        ETH: { compras: 0, ventas: 0, balance: 0 },
        USDT: { compras: 0, ventas: 0, balance: 0 }
    };

    registros.forEach(registro => {
        if (registro.operacionId === 1) { // Compra
            resumen[registro.criptomoneda].compras += registro.cantidad;
            resumen[registro.criptomoneda].balance += registro.cantidad;
        } else if (registro.operacionId === 2) { // Venta
            resumen[registro.criptomoneda].ventas += registro.cantidad;
            resumen[registro.criptomoneda].balance -= registro.cantidad;
        }
    });

    // Mostrar tarjetas
    const container = document.getElementById('precios-container');
    container.innerHTML = ''; // Limpiar antes de agregar
    
    for (const [moneda, datos] of Object.entries(resumen)) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';
        
        tarjeta.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 10px;">${moneda}</div>
            <div style="color: green;">Compras: ${datos.compras.toFixed(8)}</div>
            <div style="color: red;">Ventas: ${datos.ventas.toFixed(8)}</div>
            <div style="font-size: 18px; margin-top: 10px; border-top: 1px solid #ccc; padding-top: 5px;">
                Balance: ${datos.balance.toFixed(8)}
            </div>
        `;
        
        container.appendChild(tarjeta);
    }
}

// Constantes
const inputFecha = document.getElementById("txtFecha");
inputFecha.valueAsDate = new Date(); // pone la fecha de hoy por defecto
const inputCantidad = document.getElementById("txtCantidad");
const inputValor = document.getElementById("txtValor");
const inputTotal = document.getElementById("txtTotal");

function actualizarTotal() {
    const cantidad = parseFloat(inputCantidad.value) || 0;
    const valor = parseFloat(inputValor.value) || 0;
    inputTotal.value = (cantidad * valor).toFixed(2);
}

inputCantidad.addEventListener("input", actualizarTotal);
inputValor.addEventListener("input", actualizarTotal);

const tablaValores = {
    Binance: { BTC: 65000, ETH: 3400, USDT: 1 },
    Coinbase: { BTC: 65500, ETH: 3450, USDT: 1.01 },
};

document.getElementById("txtCriptomoneda").addEventListener("change", actualizarValor);
document.getElementById("txtExchange").addEventListener("change", actualizarValor);

function actualizarValor() {
    const cripto = document.getElementById("txtCriptomoneda").value;
    const exchange = document.getElementById("txtExchange").value;
    const valor = tablaValores[exchange]?.[cripto] ?? 0;
    inputValor.value = valor;
    actualizarTotal(); // recalcula el total al cambiar valor
}

function LimpiarFormulario() {
    inputCantidad.value = "";
    inputValor.value = "";
    inputTotal.value = "";
    document.getElementById("txtOperacionId").value = "";
    inputFecha.valueAsDate = new Date();
}

function EnviarRegistro() {
    const cripto = document.getElementById("txtCriptomoneda").value;
    const exchange = document.getElementById("txtExchange").value;
    const cantidad = parseInt(document.getElementById("txtCantidad").value);
    const valor = parseInt(document.getElementById("txtValor").value);
    const totalCompra = parseFloat(document.getElementById("txtTotal").value);
    const fecha = document.getElementById("txtFecha").value;
    const operacionId = parseInt(document.getElementById("txtOperacionId").value);

    // Generar fecha actual en formato YYYY-MM-DD HH:mm:ss


    if (!cripto || !exchange || isNaN(cantidad) || isNaN(valor) || isNaN(totalCompra)|| !fecha || isNaN(operacionId)) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    const nuevoRegistro = {
        id: 0,
        criptomoneda: cripto,
        exchange: exchange,
        cantidad: cantidad,
        valor: valor,
        totalCompra: totalCompra,
        fecha: fecha,
        operacionId: operacionId
    };

    fetch("https://localhost:7254/API_ABBA/GuardarRegistro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoRegistro)
    })
 .then(response => {
        if (!response.ok) {
            response.text().then(texto => {
                alert("Error al guardar: " + texto);
            });
            return;
        }
        alert("Registro guardado correctamente");
        LimpiarFormulario();
        ListarRegistros();
    })
    .catch(error => {
        alert("Error de red o servidor: " + error.message);
    });
}
