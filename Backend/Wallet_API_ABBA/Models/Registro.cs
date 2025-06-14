namespace Wallet_API_ABBA.Models
{
	public class Registro
	{
		public int Id { get; set; }
		public string Criptomoneda { get; set; }
		public string Exchange { get; set; }
		public decimal Cantidad { get; set; } 
		public decimal Valor { get; set; }  
		public decimal TotalCompra { get; set; }
		public DateTime Fecha { get; set; } 
		public int OperacionId { get; set; }

		public Operacion? operacion { get; set; }
	}
}
