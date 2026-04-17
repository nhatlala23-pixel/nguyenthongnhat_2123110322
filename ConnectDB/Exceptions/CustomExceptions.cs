using System;
using System.Net;

namespace ConnectDB.Exceptions
{
    public class AppException : Exception
    {
        public HttpStatusCode StatusCode { get; }

        public AppException(string message, HttpStatusCode statusCode = HttpStatusCode.InternalServerError) 
            : base(message)
        {
            StatusCode = statusCode;
        }
    }

    public class NotFoundException : AppException
    {
        public NotFoundException(string message) 
            : base(message, HttpStatusCode.NotFound)
        {
        }
    }

    public class ForbiddenException : AppException
    {
        public ForbiddenException(string message) 
            : base(message, HttpStatusCode.Forbidden)
        {
        }
    }

    public class BadRequestException : AppException
    {
        public BadRequestException(string message) 
            : base(message, HttpStatusCode.BadRequest)
        {
        }
    }
}
