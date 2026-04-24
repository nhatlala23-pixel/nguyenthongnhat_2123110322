using ConnectDB.Models;

namespace ConnectDB.Services
{
    public interface IMomoService
    {
        Task<MomoCreatePaymentResponseModel> CreatePaymentAsync(Invoice invoice);
        MomoExecuteResponseModel PaymentExecute(IQueryCollection collection);
    }
}
