using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using ConnectDB.Services;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace ConnectDB
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Lấy PORT từ Render (hoặc dùng 8080 mặc định)
            var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
            builder.WebHost.UseUrls($"http://+:{port}");

            // Add services to the container.
            // Nếu có DATABASE_URL (PostgreSQL trên Render) thì chuyển đổi sang Connection String chuẩn của .NET
            var rawDatabaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
            var databaseUrl = rawDatabaseUrl?.Trim(' ', '"', '\'', '\n', '\r');
            string connectionString;

            if (!string.IsNullOrEmpty(databaseUrl))
            {
                // Xử lý cả 'postgres://' và 'postgresql://' để parse ra connection string
                if (databaseUrl.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) || 
                    databaseUrl.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
                {
                    var databaseUri = new Uri(databaseUrl);
                    var userInfo = databaseUri.UserInfo.Split(':');
                    var dbPort = databaseUri.Port > 0 ? databaseUri.Port : 5432;
                    connectionString = $"Host={databaseUri.Host};Port={dbPort};Database={databaseUri.AbsolutePath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};SSL Mode=Require;Trust Server Certificate=True;";
                }
                else
                {
                    connectionString = databaseUrl;
                }
                
                builder.Services.AddDbContext<AppDbContext>(options =>
                    options.UseNpgsql(connectionString));
                
                // Đồng bộ kiểu dữ liệu DateTime với PostgreSQL (Tránh lỗi UTC)
                AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
            }
            else
            {
                builder.Services.AddDbContext<AppDbContext>(options =>
                    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            }

            // Configure JWT Authentication
            var jwtSettings = builder.Configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };
            });

            builder.Services.AddControllers();
            
            // Register Services
            builder.Services.AddScoped<IVnPayService, VnPayService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IAppointmentService, AppointmentService>();
            builder.Services.AddScoped<IMedicalRecordService, MedicalRecordService>();
            builder.Services.AddScoped<IDoctorService, DoctorService>();
            builder.Services.AddScoped<IPatientService, PatientService>();
            builder.Services.AddScoped<IInvoiceService, InvoiceService>();

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            
            // Configure Swagger for JWT
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Hospital API", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            app.UseMiddleware<Middlewares.ExceptionMiddleware>();
            app.UseSwagger();
            app.UseSwaggerUI(c => 
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hospital API v1");
                c.RoutePrefix = string.Empty; // Để truy cập thẳng qua root URL / 
            });

            // Tự động khởi tạo/apply Migration khi App khởi chạy
            try
            {
                using (var scope = app.Services.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    
                    // Nếu trên Render (Postgres), dùng cơ chế ép tạo bảng
                    if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DATABASE_URL")))
                    {
                        var databaseCreator = dbContext.Database.GetService<Microsoft.EntityFrameworkCore.Storage.IDatabaseCreator>() as Microsoft.EntityFrameworkCore.Storage.RelationalDatabaseCreator;
                        try { databaseCreator.CreateTables(); } catch { /* Bảng có thể đã tồn tại */ }
                    }
                    else
                    {
                        dbContext.Database.Migrate();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Database Init Error] {ex.Message}");
            }

            // Chỉ dùng HTTPS redirect khi local, Render tự lo HTTPS ở load balancer
            if (!app.Environment.IsProduction())
            {
                app.UseHttpsRedirection();
            }

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
