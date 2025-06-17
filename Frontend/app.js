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

// Mostrar resumen de criptomonedas sin usar 3 colores diferentes
function mostrarResumenCriptos(registros) {
    const resumen = {
        BTC: { compras: 0, ventas: 0, balance: 0 },
        ETH: { compras: 0, ventas: 0, balance: 0 },
        USDT: { compras: 0, ventas: 0, balance: 0 }
    };

    registros.forEach(registro => {
        const moneda = registro.criptomoneda;
        const cantidad = registro.cantidad;

        if (registro.operacionId === 1) {
            resumen[moneda].compras += cantidad;
            resumen[moneda].balance += cantidad;
        } else if (registro.operacionId === 2) {
            resumen[moneda].ventas += cantidad;
            resumen[moneda].balance -= cantidad;
        }
    });

    const container = document.getElementById('resumen-criptos');
    container.innerHTML = '';

    const titulo = document.createElement('h2');
    titulo.textContent = 'Resumen de Criptomonedas';
    container.appendChild(titulo);

    const tarjetasContainer = document.createElement('div');
    tarjetasContainer.className = 'tarjetas-container';

    for (const [moneda, datos] of Object.entries(resumen)) {
        const tarjeta = document.createElement('div');
        tarjeta.className = `tarjeta tarjeta-${moneda.toLowerCase()}`;

        tarjeta.innerHTML = `
            <div class="tarjeta-titulo">${moneda}</div>
            <div>Compras: ${datos.compras.toFixed(8)}</div>
            <div>Ventas: ${datos.ventas.toFixed(8)}</div>
            <div class="tarjeta-balance">Balance: ${datos.balance.toFixed(8)}</div>
        `;

        tarjetasContainer.appendChild(tarjeta);
    }

    container.appendChild(tarjetasContainer);
}


function EnviarRegistro() {
    const cripto = document.getElementById("txtCriptomoneda").value;
    const exchange = document.getElementById("txtExchange").value;
    const cantidad = parseInt(document.getElementById("txtCantidad").value);
    const valor = parseInt(document.getElementById("txtValor").value);
    const totalCompra = parseFloat(document.getElementById("txtTotal").value);
    const fecha = document.getElementById("txtFecha").value;
    const operacionId = parseInt(document.getElementById("txtOperacionId").value);

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
    })
    .catch(error => {
        alert("Error de red o servidor: " + error.message);
    });
}
