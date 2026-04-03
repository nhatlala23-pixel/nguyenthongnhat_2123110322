using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using System.Security.Claims;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InvoicesController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Xem hóa đơn
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetInvoice(int id)
        {
            var invoice = await _context.Invoices.Include(i => i.Appointment).FirstOrDefaultAsync(i => i.Id == id);
            if (invoice == null) return NotFound();
            
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole != "Admin" && userRole != "Receptionist" && invoice.Appointment?.Patient?.UserId != userId)
            {
                return Forbid();
            }

            return Ok(invoice);
        }

        // 1b. Xem danh sách hóa đơn
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetInvoices()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole == "Admin" || userRole == "Receptionist")
            {
                return Ok(await _context.Invoices.Include(i => i.Appointment).ToListAsync());
            }

            // Bệnh nhân xem hóa đơn của mình
            return Ok(await _context.Invoices
                .Include(i => i.Appointment)
                .Where(i => i.Appointment!.Patient!.UserId == userId)
                .ToListAsync());
        }

        // 2. Thanh toán hóa đơn (Dành cho Patient hoặc Receptionist)
        [HttpPatch("{id}/pay")]
        [Authorize(Roles = "Patient,Receptionist")]
        public async Task<IActionResult> PayInvoice(int id)
        {
            var invoice = await _context.Invoices.Include(i => i.Appointment).FirstOrDefaultAsync(i => i.Id == id);
            if (invoice == null) return NotFound();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole == "Patient" && invoice.Appointment?.Patient?.UserId != userId)
            {
                return Forbid();
            }

            invoice.IsPaid = true;
            await _context.SaveChangesAsync();

            return Ok("Invoice paid successfully");
        }

        // 3. Admin chỉnh sửa hóa đơn (Ví dụ giảm giá hoặc sửa tiền)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutInvoice(int id, [FromBody] InvoiceUpdateDto model)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();

            invoice.TotalAmount = model.TotalAmount;
            invoice.IsPaid = model.IsPaid;

            await _context.SaveChangesAsync();
            return Ok("Invoice updated");
        }

        // 4. Admin xóa hóa đơn
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();
            return Ok("Invoice deleted");
        }
    }

    public class InvoiceUpdateDto
    {
        public decimal TotalAmount { get; set; }
        public bool IsPaid { get; set; }
    }
}

