internal class Program
{
	private static void Main(string[] args)
	{
		var builder = WebApplication.CreateBuilder(args);

		// Define la política CORS
		builder.Services.AddCors(options =>
		{
			options.AddPolicy("AllowAll", policy =>
			{
				policy
					.AllowAnyOrigin()
					.AllowAnyHeader()
					.AllowAnyMethod();
			});
		});

		// Add services to the container.
		builder.Services.AddControllers();
		builder.Services.AddControllersWithViews();

		var app = builder.Build();

		// Usa la política CORS
		app.UseCors("AllowAll");

		// Configure the HTTP request pipeline.
		if (!app.Environment.IsDevelopment())
		{
			app.UseExceptionHandler("/Home/Error");
			// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
			app.UseHsts();
		}

		app.UseHttpsRedirection();
		app.UseStaticFiles();

		app.UseRouting();

		app.UseAuthorization();

		app.MapControllerRoute(
			name: "default",
			pattern: "{controller=Home}/{action=Index}/{id?}");

		// Mapea rutas con atributos [HttpPost], [HttpGet] para APIs!!!!(el de arriva es para vistas con mvc completo)
		app.MapControllers();

		app.Run();
	}
}