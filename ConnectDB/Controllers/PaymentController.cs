using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IInvoiceService _invoiceService;

        public PaymentController(IVnPayService vnPayService, IInvoiceService invoiceService)
        {
            _vnPayService = vnPayService;
            _invoiceService = invoiceService;
        }

        // POST: api/payment/create/{invoiceId}
        [HttpPost("create/{invoiceId}")]
        [Authorize]
        public async Task<IActionResult> CreatePayment(int invoiceId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var invoice = await _invoiceService.GetInvoiceAsync(invoiceId, userId, userRole);
            if (invoice == null) return NotFound("Invoice not found or access denied");

            if (invoice.IsPaid) return BadRequest("Invoice is already paid");

            var url = _vnPayService.CreatePaymentUrl(invoice, HttpContext);
            return Ok(new { paymentUrl = url });
        }

        // GET: api/payment/vnpay-return
        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VnPayReturn()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            if (response == null || response.VnPayResponseCode != "00")
            {
                return BadRequest(new { message = "Payment failed", response });
            }

            // Payment success - Update invoice via Service
            var invoiceId = int.Parse(response.OrderId);
            var success = await _invoiceService.ProcessVnPayPaymentAsync(invoiceId, response.TransactionId!);

            if (!success) return BadRequest("Could not process payment for this invoice");

            return Ok(new { message = "Payment successful", invoiceId = invoiceId, transactionId = response.TransactionId });
        }

        // GET: api/payment
        [HttpGet]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> GetAllPayments()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var invoices = await _invoiceService.GetAllInvoicesAsync(userId, userRole);
            var payments = invoices.Where(i => i.IsPaid).Select(i => new
            {
                i.Id,
                i.TotalAmount,
                i.PaymentMethod,
                i.PaymentDate,
                i.TransactionId,
                i.IsPaid,
                PatientName = i.Appointment?.Patient?.FullName ?? "N/A",
                i.CreatedDate
            });

            return Ok(payments);
        }

        // GET: api/payment/{id}
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetPaymentById(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var invoice = await _invoiceService.GetInvoiceAsync(id, userId, userRole);
            if (invoice == null || !invoice.IsPaid) return NotFound("Payment not found or access denied");

            return Ok(new
            {
                invoice.Id,
                invoice.TotalAmount,
                invoice.IsPaid,
                invoice.PaymentMethod,
                invoice.PaymentDate,
                invoice.TransactionId,
                invoice.CreatedDate,
                PatientName = invoice.Appointment?.Patient?.FullName ?? "N/A",
                AppointmentDate = invoice.Appointment?.AppointmentTime
            });
        }

        // POST: api/payment/refund/{id}
        [HttpPost("refund/{id}")]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> RefundPayment(int id)
        {
            var success = await _invoiceService.RefundInvoiceAsync(id);
            if (!success) return BadRequest("Invoice not found or no payment to refund");

            return Ok(new { message = "Refund successful", invoiceId = id });
        }
    }
}
