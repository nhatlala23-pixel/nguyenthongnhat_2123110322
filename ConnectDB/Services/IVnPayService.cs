using ConnectDB.Models;

namespace ConnectDB.Services
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(Invoice invoice, HttpContext context);
        VnPaymentResponseModel PaymentExecute(IQueryCollection collections);
    }

    public class VnPaymentRequestModel
    {
        public int InvoiceId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Amount { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class VnPaymentResponseModel
    {
        public bool Success { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string OrderDescription { get; set; } = string.Empty;
        public string OrderId { get; set; } = string.Empty;
        public string PaymentId { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string VnPayResponseCode { get; set; } = string.Empty;
    }
}
