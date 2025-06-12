using Microsoft.EntityFrameworkCore;
using Wallet_API_ABBA.Models;

namespace Wallet_API_ABBA.Data
{
	public class AppDBcontext: DbContext
	{
		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
			optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=Wallet_ABBA;Trusted_Connection=True;MultipleActiveResultSets=True");
		}
		public DbSet<Registro> Registros { get; set; }
		public DbSet<Operacion> Operaciones { get; set; }
	}
}
