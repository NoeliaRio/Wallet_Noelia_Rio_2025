function ListarRegistros() {
    fetch("https://localhost:7254/api/registros/listar")
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

function EnviarRegistro() {
    const cripto = document.getElementById("txtCriptomoneda").value;
    const exchange = document.getElementById("txtExchange").value;
    const cantidad = parseInt(document.getElementById("txtCantidad").value);
    const valor = parseInt(document.getElementById("txtValor").value);
    const fecha = document.getElementById("txtFecha").value;
    const operacionId = parseInt(document.getElementById("txtOperacionId").value);

    if (!cripto || !exchange || isNaN(cantidad) || isNaN(valor) || !fecha || isNaN(operacionId)) {
        alert("Completa todos los campos correctamente.");
        return;
    }

    const nuevoRegistro = {
        id: 0,
        criptomoneda: cripto,
        exchange: exchange,
        cantidad: cantidad,
        valor: valor,
        fecha: fecha,
        operacionId: operacionId
    };

    fetch("https://localhost:7254/api/registros/guardar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoRegistro)
    })
    .then(response => {
        if (!response.ok) {
            alert("Error al guardar el registro");
            return;
        }
        alert("Registro guardado correctamente");
        ListarRegistros();
    })
    .catch(error => {
        alert("Error: " + error);
    });
}