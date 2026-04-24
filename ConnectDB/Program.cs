using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using ConnectDB.Services;
using ConnectDB.Models;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace ConnectDB
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Cấu hình CORS
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy => policy.WithOrigins("http://localhost:5173", 
                                                 "https://nguyenthongnhat-2123110322.vercel.app",
                                                 "https://nguyenthongnhat-2123110322-khv9fibnp-nhatlala23-pixels-projects.vercel.app")
                                    .AllowAnyMethod()
                                    .AllowAnyHeader()
                                    .AllowCredentials());
            });

            // Lấy PORT từ Render (Nếu không có thì để hệ thống tự quyết định theo launchSettings)
            var renderPort = Environment.GetEnvironmentVariable("PORT");
            if (!string.IsNullOrEmpty(renderPort))
            {
                builder.WebHost.UseUrls($"http://+:{renderPort}");
            }

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

            builder.Services.AddControllers().AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
            });
            
            // Config Payment Options
            builder.Services.Configure<MomoOptionModel>(builder.Configuration.GetSection("Momo"));
            
            // Register Services
            builder.Services.AddScoped<IVnPayService, VnPayService>();
            builder.Services.AddScoped<IMomoService, MomoService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IAppointmentService, AppointmentService>();
            builder.Services.AddScoped<IMedicalRecordService, MedicalRecordService>();
            builder.Services.AddScoped<IDoctorService, DoctorService>();
            builder.Services.AddScoped<IPatientService, PatientService>();
            builder.Services.AddScoped<IInvoiceService, InvoiceService>();
            builder.Services.AddScoped<IDashboardService, DashboardService>();

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
                        try { databaseCreator?.CreateTables(); } catch { /* Bảng có thể đã tồn tại */ }
                    }
                    else
                    {
                        dbContext.Database.Migrate();
                    }

                    // Seed Admin User (Ưu tiên tạo tài khoản admin/admin123 để đăng nhập)
                    if (!dbContext.Users.Any(u => u.Username == "admin"))
                    {
                        var adminUser = new ConnectDB.Models.User
                        {
                            Username = "admin",
                            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                            Role = "Admin"
                        };
                        dbContext.Users.Add(adminUser);
                        dbContext.SaveChanges();
                        Console.WriteLine("***************************************************");
                        Console.WriteLine("--> SEED DATA SUCCESS: admin / admin123");
                        Console.WriteLine("***************************************************");
                    }

                    // Seed Departments (Chuyên khoa)
                    if (!dbContext.Departments.Any())
                    {
                        var departments = new List<ConnectDB.Models.Department>
                        {
                            new ConnectDB.Models.Department { Name = "Tim mạch", Description = "Điều trị các bệnh lý về tim và mạch máu chuyên sâu." },
                            new ConnectDB.Models.Department { Name = "Thần kinh", Description = "Chăm sóc não bộ và hệ thần kinh trung ương." },
                            new ConnectDB.Models.Department { Name = "Nhi khoa", Description = "Sức khỏe toàn diện cho trẻ em từ sơ sinh." },
                            new ConnectDB.Models.Department { Name = "Chấn thương", Description = "Phục hồi chức năng và điều trị cơ xương khớp." },
                            new ConnectDB.Models.Department { Name = "Nhãn khoa", Description = "Khám và chăm sóc sức khỏe thị lực chuyên khoa." },
                            new ConnectDB.Models.Department { Name = "Da liễu", Description = "Giải pháp cho làn da và các bệnh lý về da liễu." }
                        };
                        dbContext.Departments.AddRange(departments);
                        dbContext.SaveChanges();
                        Console.WriteLine("--> SEED DEPARTMENTS SUCCESS");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Database Init Error] {ex.Message}");
            }

            // Phục vụ file tĩnh từ wwwroot
            app.UseStaticFiles();

            // Chỉ dùng HTTPS redirect khi local, Render tự lo HTTPS ở load balancer
            app.UseCors("AllowFrontend");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
