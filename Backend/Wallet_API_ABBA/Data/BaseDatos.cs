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
					string query = "INSERT INTO Registros (Criptomoneda, Exchange, Cantidad, Valor, TotalCompra, Fecha, OperacionId) " +
								  "VALUES (@Criptomoneda, @Exchange, @Cantidad, @Valor, @TotalCompra, @Fecha, @OperacionId)";

					con.Open();
					SqlCommand cmd = new SqlCommand(query, con);

					// Usar parámetros para evitar inyección SQL y problemas de formato
					cmd.Parameters.AddWithValue("@Criptomoneda", registro.Criptomoneda);
					cmd.Parameters.AddWithValue("@Exchange", registro.Exchange);
					cmd.Parameters.AddWithValue("@Cantidad", registro.Cantidad);
					cmd.Parameters.AddWithValue("@Valor", registro.Valor);
					cmd.Parameters.AddWithValue("@TotalCompra", registro.TotalCompra);
					cmd.Parameters.AddWithValue("@Fecha", registro.Fecha);
					cmd.Parameters.AddWithValue("@OperacionId", registro.OperacionId);

					cmd.ExecuteNonQuery();
					return "Registro guardado correctamente";
				}
				catch (Exception ex)
				{
					return "Error al guardar el registro: " + ex.Message;
				}
			}

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

