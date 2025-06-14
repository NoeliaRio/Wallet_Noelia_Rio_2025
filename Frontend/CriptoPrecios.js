const criptomonedas = ["BTC", "ETH", "USDT"];
const exchanges = ["bybit", "pollux", "satoshitango"];
const fiat = "ARS";
const volumen = 1;

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
          resultados[cripto][exchange] = "—";
          continue;
        }
        const data = await response.json();
        const precio = data.ask ?? "—";  
        resultados[cripto][exchange] = precio.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

      } catch (err) {
        console.error(`Error en fetch ${exchange}/${cripto}:`, err);
        resultados[cripto][exchange] = "—";
      }
    }
  }

  console.table(resultados);
  return resultados;
}

async function renderizarTarjetas() {
    const resultados = await consultarCriptoPrecios();
    const cont = document.getElementById("precios-container");
    cont.innerHTML = "";
  
    for (const cripto of criptomonedas) {
      const precios = resultados[cripto];
      const div = document.createElement("div");
      div.classList.add("tarjeta");
      div.innerHTML = `
        <h3>${cripto}</h3>
        <p><strong>Bybit:</strong> ${precios.bybit}</p>
        <p><strong>Pollux:</strong> ${precios.pollux}</p>
        <p><strong>Satoshi:</strong> ${precios.satoshitango}</p>
      `;
      cont.appendChild(div);
    }
  }