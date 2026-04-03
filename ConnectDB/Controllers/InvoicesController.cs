using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;

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
            return Ok(invoice);
        }

        // 2. Thanh toán hóa đơn (Dành cho Patient hoặc Receptionist)
        [HttpPatch("{id}/pay")]
        [Authorize(Roles = "Patient,Receptionist")]
        public async Task<IActionResult> PayInvoice(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return NotFound();

            invoice.IsPaid = true;
            await _context.SaveChangesAsync();

            return Ok("Invoice paid successfully");
        }
    }
}

