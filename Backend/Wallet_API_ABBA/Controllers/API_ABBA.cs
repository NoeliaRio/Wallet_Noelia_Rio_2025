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

		// GET: API_ABBA/Details/5
		public ActionResult Details(int id)
		{
			return View();
		}

		// GET: API_ABBA/Create
		public ActionResult Create()
		{
			return View();
		}

		// POST: API_ABBA/Create
		[HttpPost]
		[ValidateAntiForgeryToken]
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

		// GET: API_ABBA/Edit/5
		public ActionResult Edit(int id)
		{
			return View();
		}



		// GET: API_ABBA/Delete/5
		public ActionResult Delete(int id)
		{
			return View();
		}

		// POST: API_ABBA/Delete/5
		[HttpPost]
		[ValidateAntiForgeryToken]
		public ActionResult Delete(int id, IFormCollection collection)
		{
			try
			{
				return RedirectToAction(nameof(Index));
			}
			catch
			{
				return View();
			}
		}
	}
}
