using ConnectDB.Models;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace ConnectDB.Services
{
    public class MomoService : IMomoService
    {
        private readonly IOptions<MomoOptionModel> _options;

        public MomoService(IOptions<MomoOptionModel> options)
        {
            _options = options;
        }

        public async Task<MomoCreatePaymentResponseModel> CreatePaymentAsync(Invoice invoice)
        {
            var partnerCode = _options.Value.PartnerCode.Trim();
            var accessKey = _options.Value.AccessKey.Trim();
            var secretKey = _options.Value.SecretKey.Trim();
            var paymentUrl = _options.Value.PaymentUrl.Trim();
            var redirectUrl = _options.Value.ReturnUrl.Trim();
            var ipnUrl = _options.Value.IpnUrl.Trim();

            // Tạo mã đơn hàng đơn giản từ Ticks để tránh lỗi định dạng
            var requestId = DateTime.Now.Ticks.ToString();
            var orderId = "INV" + invoice.Id + "T" + requestId.Substring(requestId.Length - 10);
            var orderInfo = "ThanhToanHoaDon" + invoice.Id;
            var amount = ((long)invoice.TotalAmount).ToString();
            var extraData = "";
            var requestType = "captureWallet";

            // Chuỗi Hash chuẩn MoMo v2
            var rawHash = $"accessKey={accessKey}&amount={amount}&extraData={extraData}&ipnUrl={ipnUrl}&orderId={orderId}&orderInfo={orderInfo}&partnerCode={partnerCode}&redirectUrl={redirectUrl}&requestId={requestId}&requestType={requestType}";

            var signature = ComputeHmacSha256(rawHash, secretKey);

            var requestData = new
            {
                partnerCode = partnerCode,
                requestId = requestId,
                amount = long.Parse(amount),
                orderId = orderId,
                orderInfo = orderInfo,
                redirectUrl = redirectUrl,
                ipnUrl = ipnUrl,
                requestType = requestType,
                extraData = extraData,
                signature = signature,
                lang = "vi"
            };

            try
            {
                using (var client = new HttpClient())
                {
                    var content = new StringContent(JsonSerializer.Serialize(requestData), Encoding.UTF8, "application/json");
                    var response = await client.PostAsync(paymentUrl, content);
                    var responseContent = await response.Content.ReadAsStringAsync();

                    var result = JsonSerializer.Deserialize<MomoCreatePaymentResponseModel>(responseContent, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (result != null && result.ErrorCode != 0)
                    {
                        result.Message = $"MoMo Error {result.ErrorCode}: {result.Message}";
                    }

                    return result ?? new MomoCreatePaymentResponseModel { Message = "Cannot connect to MoMo" };
                }
            }
            catch (Exception ex)
            {
                return new MomoCreatePaymentResponseModel { Message = ex.Message };
            }
        }

        public MomoExecuteResponseModel PaymentExecute(IQueryCollection collection)
        {
            return new MomoExecuteResponseModel()
            {
                Amount = collection["amount"].ToString(),
                OrderId = collection["orderId"].ToString(),
                OrderInfo = collection["orderInfo"].ToString()
            };
        }

        private string ComputeHmacSha256(string message, string secretKey)
        {
            byte[] keyBytes = Encoding.UTF8.GetBytes(secretKey);
            byte[] messageBytes = Encoding.UTF8.GetBytes(message);

            using (var hmac = new HMACSHA256(keyBytes))
            {
                byte[] hashBytes = hmac.ComputeHash(messageBytes);
                return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        }
    }
}
