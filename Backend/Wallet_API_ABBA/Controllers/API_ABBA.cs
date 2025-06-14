using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wallet_API_ABBA.Data;
using Wallet_API_ABBA.Models;

namespace Wallet_API_ABBA.Controllers
{
	
	public class API_ABBA : Controller
	{
		private readonly BaseDatos _baseDatos = new BaseDatos();

		// GET: API_ABBA
		[HttpGet]
		public IActionResult ListarRegistros()
		{
			try
			{
				var registros = _baseDatos.ObtenerRegistros(0);
				return Ok(registros);
			}
			catch (Exception ex)
			{
				return BadRequest("Error al obtener los registros: " + ex.Message);
			}
		}

		// POST: API_ABBA
		[HttpPost]
		public IActionResult GuardarRegistro([FromBody] Registro registro)
		{
			try
			{
				string resultado = _baseDatos.GuardarRegistro(registro);
				if (string.IsNullOrEmpty(resultado))
				{
					return Ok("Registro guardado correctamente");
				}
				else
				{
					return BadRequest(resultado);
				}
			}
			catch (Exception ex)
			{
				return BadRequest("Error al guardar: " + ex.Message);
			}
		}

	}
}
