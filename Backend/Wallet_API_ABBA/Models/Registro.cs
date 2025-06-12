namespace Wallet_API_ABBA.Models
{
	public class Registro
	{
		public int Id { get; set; }
		public string Criptomoneda { get; set; }
		public string Exchange { get; set; }
		public int Cantidad { get; set; }
		public int Valor { get; set; }
		public DateTime Fecha { get; set; }
		public int OperacionId { get; set; }

		public Operacion? operacion { get; set; }
	}
}
