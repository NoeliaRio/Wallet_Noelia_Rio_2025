using Wallet_API_ABBA.Models;
using Microsoft.Data.SqlClient;
namespace Wallet_API_ABBA.Data
{
	public class BaseDatos
	{
		private string conexionString = "Server=(localdb)\\mssqllocaldb;Database=Wallet_ABBA;Trusted_Connection=True;MultipleActiveResultSets=True";
		public List<Operacion> ObtenerOperaciones(int operacionBusq)
		{
			List<Operacion> lista = new List<Operacion>();

			using (SqlConnection con = new SqlConnection(conexionString))
			{
				string query = "SELECT * FROM Operaciones";
				if (operacionBusq > 0)
					query = "SELECT * FROM Operaciones WHERE Id = " + operacionBusq;

				con.Open();
				SqlCommand cmd = new SqlCommand(query, con);
				SqlDataReader reader = cmd.ExecuteReader();

				while (reader.Read())
				{
					lista.Add(new Operacion
					{
						Id = (int)reader["Id"],
						Nombre = reader["Nombre"].ToString()
					});
				}
			}

			return lista;
		}

		public List<Registro> ObtenerRegistros(int idBusqueda)
		{
			List<Registro> lista = new List<Registro>();

			using (SqlConnection con = new SqlConnection(conexionString))
			{
				string query = "SELECT * FROM Registros";
				if (idBusqueda > 0)
					query = $"SELECT * FROM Registros WHERE Id = {idBusqueda}";

				con.Open();
				SqlCommand cmd = new SqlCommand(query, con);
				SqlDataReader reader = cmd.ExecuteReader();

				while (reader.Read())
				{
					var operacionId = (int)reader["OperacionId"];
					lista.Add(new Registro
					{
						Id = (int)reader["Id"],
						Criptomoneda = reader["Criptomoneda"].ToString(),
						Exchange = reader["Exchange"].ToString(),
						Cantidad = (decimal)reader["Cantidad"],
						Valor = (decimal)reader["Valor"],
						TotalCompra = (decimal)reader["TotalCompra"],
						Fecha = (DateTime)reader["Fecha"],
						OperacionId = operacionId,
						operacion = ObtenerOperaciones(operacionId).FirstOrDefault()
					});
				}
			}

			return lista;
		}

		public string GuardarRegistro(Registro registro)
		{
			using (SqlConnection con = new SqlConnection(conexionString))
			{
				try
				{
					string query = $"INSERT INTO Registros (Criptomoneda, Exchange, Cantidad, Valor, TotalCompra, Fecha, OperacionId) " +
								   $"VALUES ('{registro.Criptomoneda}', '{registro.Exchange}', {registro.Cantidad}, {registro.Valor}, {registro.TotalCompra}, '{registro.Fecha:yyyy-MM-dd HH:mm:ss}', {registro.OperacionId})";

					con.Open();
					SqlCommand cmd = new SqlCommand(query, con);
					cmd.ExecuteNonQuery();
				}
				catch (Exception ex)
				{
					return "Error al guardar el registro: " + ex.Message;
				}
			}

			return "";
		}

		public string GuardarOperacion(Operacion operacion)
		{
			using (SqlConnection con = new SqlConnection(conexionString))
			{
				try
				{
					string query = $"INSERT INTO Operaciones (Nombre) VALUES ('{operacion.Nombre}')";

					con.Open();
					SqlCommand cmd = new SqlCommand(query, con);
					cmd.ExecuteNonQuery();
				}
				catch (Exception ex)
				{
					return "Error al guardar la operación: " + ex.Message;
				}
			}

			return "";
		}
	}
}

