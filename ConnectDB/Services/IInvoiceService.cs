using ConnectDB.DTOs;
using ConnectDB.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ConnectDB.Services
{
    public interface IInvoiceService
    {
        Task<Invoice?> GetInvoiceAsync(int id, int userId, string role);
        Task<IEnumerable<Invoice>> GetAllInvoicesAsync(int userId, string role);
        Task<bool> PayInvoiceAsync(int id, int userId, string role);
        Task<bool> ProcessVnPayPaymentAsync(int invoiceId, string transactionId);
        Task<bool> RefundInvoiceAsync(int id);
        Task<bool> UpdateInvoiceAsync(int id, InvoiceUpdateDto model);
        Task<bool> DeleteInvoiceAsync(int id);
    }
}
