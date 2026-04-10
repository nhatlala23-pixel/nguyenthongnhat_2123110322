namespace ConnectDB.Helpers
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }

        public ApiResponse(bool success, string message, T? data = default)
        {
            Success = success;
            Message = message;
            Data = data;
        }

        public static ApiResponse<T> SuccessResult(T data, string message = "Success") 
            => new ApiResponse<T>(true, message, data);

        public static ApiResponse<T> FailureResult(string message) 
            => new ApiResponse<T>(false, message);
    }

    public class ApiResponse : ApiResponse<object>
    {
        public ApiResponse(bool success, string message, object? data = null) 
            : base(success, message, data)
        {
        }

        public static ApiResponse SuccessResult(string message = "Success") 
            => new ApiResponse(true, message);

        public static ApiResponse FailureResult(string message) 
            => new ApiResponse(false, message);
    }
}
