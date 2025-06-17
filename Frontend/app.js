function ListarRegistros() {
    fetch("https://localhost:7254/API_ABBA/ListarRegistros")
    .then(response => {
        if (!response.ok) {
            alert(response.status);
        }
        return response.json();
    })
    .then(data => {
        mostrarRegistros(data);
    })
    .catch(error => console.error("Error al obtener registros:", error));
}

function mostrarRegistros(registros) {
    const lista = document.getElementById("listaRegistros");
    lista.innerHTML = "";

    registros.forEach(registro => {
        const item = document.createElement("li");
        item.textContent = `CRIPTO: ${registro.criptomoneda} - EXCHANGE: ${registro.exchange} - CANTIDAD: ${registro.cantidad} - VALOR: ${registro.valor}`;
        lista.appendChild(item);
    });
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
