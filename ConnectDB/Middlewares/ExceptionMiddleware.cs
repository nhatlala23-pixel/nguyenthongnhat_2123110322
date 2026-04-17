using Microsoft.AspNetCore.Http;
using System;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using ConnectDB.Helpers;
using ConnectDB.Exceptions;
using Microsoft.Extensions.Logging;

namespace ConnectDB.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Something went wrong: {ex.Message}");
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            
            var statusCode = (int)HttpStatusCode.InternalServerError;
            var message = "Internal Server Error from the custom middleware.";

            if (exception is AppException appException)
            {
                statusCode = (int)appException.StatusCode;
                message = appException.Message;
            }

            context.Response.StatusCode = statusCode;

            var response = ApiResponse.FailureResult(message);

            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
