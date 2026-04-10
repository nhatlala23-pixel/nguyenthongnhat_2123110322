using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.DTOs;
using System.Security.Claims;

using ConnectDB.Services;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoicesController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        // 1. Xem hóa đơn
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetInvoice(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var invoice = await _invoiceService.GetInvoiceAsync(id, userId, userRole);
            if (invoice == null) return NotFound();
            
            return Ok(invoice);
        }

        // 1b. Xem danh sách hóa đơn
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetInvoices()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var invoices = await _invoiceService.GetAllInvoicesAsync(userId, userRole);
            return Ok(invoices);
        }

        // 2. Thanh toán hóa đơn (Dành cho Patient hoặc Receptionist)
        [HttpPatch("{id}/pay")]
        [Authorize(Roles = "Patient,Receptionist")]
        public async Task<IActionResult> PayInvoice(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var success = await _invoiceService.PayInvoiceAsync(id, userId, userRole);
            if (!success) return NotFound();

            return Ok("Invoice paid successfully");
        }

        // 3. Admin chỉnh sửa hóa đơn
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutInvoice(int id, [FromBody] InvoiceUpdateDto model)
        {
            var success = await _invoiceService.UpdateInvoiceAsync(id, model);
            if (!success) return NotFound();

            return Ok("Invoice updated");
        }

        // 4. Admin xóa hóa đơn
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var success = await _invoiceService.DeleteInvoiceAsync(id);
            if (!success) return NotFound();

            return Ok("Invoice deleted");
        }
    }


}

