const criptomonedas = ["BTC", "ETH", "USDT"];
const exchanges = ["bybit", "pollux", "satoshitango"];
const fiat = "ARS";
const volumen = 1;
let preciosGlobales = {};

async function consultarCriptoPrecios() {
  const resultados = {};

  for (const cripto of criptomonedas) {
    resultados[cripto] = {};

    for (const exchange of exchanges) {
      const url = `https://criptoya.com/api/${exchange}/${cripto}/${fiat}/${volumen}`;
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.error(`HTTP ${response.status} en ${exchange}/${cripto}`);
          resultados[cripto][exchange] = { raw: 0, formato: "—" };
          continue;
        }
        const data = await response.json();
        const precio = data.ask ?? 0;

        resultados[cripto][exchange] = {
          raw: precio,
          formato: precio.toLocaleString("es-AR", { style: "currency", currency: "ARS" })
        };

      } catch (err) {
        console.error(`Error en fetch ${exchange}/${cripto}:`, err);
        resultados[cripto][exchange] = { raw: 0, formato: "—" };
      }
    }
  }

  console.table(resultados);
  return resultados;
}

async function renderizarTarjetas() {
    const resultados = await consultarCriptoPrecios();
    preciosGlobales = resultados;
    const cont = document.getElementById("precios-container");
    cont.innerHTML = "";
  
    for (const cripto of criptomonedas) {
      const precios = resultados[cripto];
      const div = document.createElement("div");
      div.classList.add("tarjeta");
      div.innerHTML = `
        <h3>${cripto}</h3>
        <p><strong>Bybit:</strong> ${precios.bybit.formato}</p>
        <p><strong>Pollux:</strong> ${precios.pollux.formato}</p>
        <p><strong>Satoshi:</strong> ${precios.satoshitango.formato}</p>
      `;
      cont.appendChild(div);
    }
  }
  function calcularValorYTotal() {
    const cripto = document.getElementById("txtCriptomoneda").value;
    const exchange = document.getElementById("txtExchange").value.toLowerCase();
    const cantidad = parseFloat(document.getElementById("txtCantidad").value);

    if (!cripto || !exchange || isNaN(cantidad)) {
        alert("Seleccioná criptomoneda, exchange y cantidad antes de calcular.");
        return;
    }

    const datosCripto = preciosGlobales[cripto]?.[exchange];
    if (!datosCripto || typeof datosCripto.raw !== "number") {
        alert("No se encontró el valor para esa combinación.");
        return;
    }

    const valorUnitario = datosCripto.raw;

    // Setear valor y total
    document.getElementById("txtValor").value = valorUnitario.toFixed(2);
    document.getElementById("txtTotal").value = (valorUnitario * cantidad).toFixed(2);

    document.getElementById("precioInfo").textContent =
        `Precio actual de ${cripto} en ${exchange.charAt(0).toUpperCase() + exchange.slice(1)}: $${valorUnitario.toFixed(2)} ARS`;
}
