const criptomonedas = ["btc", "sol", "ada"];
const exchanges = ["bitso", "pollux", "satoshitango"];
const fiat = "ars";
const volumen = 1;

async function consultarCriptoPrecios() {
    const resultados = {};

    for (const cripto of criptomonedas) {
        resultados[cripto.toUpperCase()] = {};

        for (const exchange of exchanges) {
        const url = `https://criptoya.com/api/${exchange}/${cripto}/${fiat}/${volumen}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Error en ${exchange} para ${cripto}`);

            const data = await response.json();
            resultados[cripto.toUpperCase()][exchange] = data.totalPrice;
        } catch (error) {
            resultados[cripto.toUpperCase()][exchange] = "Error";
            console.error(error.message);
        }
        }
    }

    console.table(resultados);
    return resultados;
}