using ConnectDB.Models;

namespace ConnectDB.Services
{
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _configuration;

        public VnPayService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CreatePaymentUrl(Invoice invoice, HttpContext context)
        {
            var vnpay = new VnPayLibrary();
            var vnpConfig = _configuration.GetSection("VnPay");

            vnpay.AddRequestData("vnp_Version", vnpConfig["Version"]!);
            vnpay.AddRequestData("vnp_Command", vnpConfig["Command"]!);
            vnpay.AddRequestData("vnp_TmnCode", vnpConfig["TmnCode"]!);
            vnpay.AddRequestData("vnp_Amount", ((long)(invoice.TotalAmount * 100)).ToString()); // VNPAY amount is in cents
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", vnpConfig["CurrCode"]!);
            var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            if (string.IsNullOrEmpty(ipAddress) || ipAddress == "::1")
            {
                ipAddress = "127.0.0.1";
            }
            vnpay.AddRequestData("vnp_IpAddr", ipAddress);
            vnpay.AddRequestData("vnp_Locale", vnpConfig["Locale"]!);
            vnpay.AddRequestData("vnp_OrderInfo", $"ThanhToanHoaDon_{invoice.Id}");
            vnpay.AddRequestData("vnp_OrderType", "other"); // Default type
            vnpay.AddRequestData("vnp_ReturnUrl", vnpConfig["ReturnUrl"]!);
            vnpay.AddRequestData("vnp_TxnRef", invoice.Id.ToString());

            var paymentUrl = vnpay.CreateRequestUrl(vnpConfig["BaseUrl"]!, vnpConfig["HashKey"]!);

            return paymentUrl;
        }

        public VnPaymentResponseModel PaymentExecute(IQueryCollection collections)
        {
            var vnpay = new VnPayLibrary();
            foreach (var (key, value) in collections)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }

            var vnp_TxnRef = vnpay.GetResponseData("vnp_TxnRef");
            var vnp_TransactionId = vnpay.GetResponseData("vnp_TransactionNo");
            var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnp_SecureHash = collections.FirstOrDefault(p => p.Key == "vnp_SecureHash").Value;
            var vnp_OrderInfo = vnpay.GetResponseData("vnp_OrderInfo");

            bool isValidSignature = vnpay.ValidateSignature(vnp_SecureHash!, _configuration["VnPay:HashKey"]!);
            if (!isValidSignature)
            {
                return new VnPaymentResponseModel { Success = false };
            }

            return new VnPaymentResponseModel
            {
                Success = true,
                PaymentMethod = "VnPay",
                OrderDescription = vnp_OrderInfo,
                OrderId = vnp_TxnRef,
                TransactionId = vnp_TransactionId,
                Token = vnp_SecureHash!,
                VnPayResponseCode = vnp_ResponseCode
            };
        }
    }
}
