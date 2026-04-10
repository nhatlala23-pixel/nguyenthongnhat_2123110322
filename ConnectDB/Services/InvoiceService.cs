using ConnectDB.Data;
using ConnectDB.DTOs;
using ConnectDB.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectDB.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly AppDbContext _context;

        public InvoiceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Invoice?> GetInvoiceAsync(int id, int userId, string role)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Appointment)
                .ThenInclude(a => a != null ? a.Patient : null)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null) return null;

            if (role != "Admin" && role != "Receptionist" && invoice.Appointment?.Patient?.UserId != userId)
            {
                return null;
            }

            return invoice;
        }

        public async Task<IEnumerable<Invoice>> GetAllInvoicesAsync(int userId, string role)
        {
            var query = _context.Invoices.Include(i => i.Appointment).ThenInclude(a => a != null ? a.Patient : null).AsQueryable();

            if (role == "Admin" || role == "Receptionist")
            {
                return await query.ToListAsync();
            }

            return await query.Where(i => i.Appointment!.Patient!.UserId == userId).ToListAsync();
        }

        public async Task<bool> PayInvoiceAsync(int id, int userId, string role)
        {
            var invoice = await _context.Invoices.Include(i => i.Appointment).ThenInclude(a => a != null ? a.Patient : null).FirstOrDefaultAsync(i => i.Id == id);
            if (invoice == null) return false;

            if (role == "Patient" && invoice.Appointment?.Patient?.UserId != userId)
            {
                return false;
            }

            invoice.IsPaid = true;
            invoice.PaymentMethod = "Manual";
            invoice.PaymentDate = DateTime.Now;
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ProcessVnPayPaymentAsync(int invoiceId, string transactionId)
        {
            var invoice = await _context.Invoices.FindAsync(invoiceId);
            if (invoice == null || invoice.IsPaid) return false;

            invoice.IsPaid = true;
            invoice.PaymentMethod = "VNPAY";
            invoice.PaymentDate = DateTime.Now;
            invoice.TransactionId = transactionId;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RefundInvoiceAsync(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null || !invoice.IsPaid) return false;

            invoice.IsPaid = false;
            invoice.PaymentMethod = invoice.PaymentMethod + " (REFUNDED)";
            invoice.PaymentDate = null;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateInvoiceAsync(int id, InvoiceUpdateDto model)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return false;

            invoice.TotalAmount = model.TotalAmount;
            invoice.IsPaid = model.IsPaid;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteInvoiceAsync(int id)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null) return false;

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
