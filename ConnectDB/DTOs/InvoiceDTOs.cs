namespace ConnectDB.DTOs
{
    public class InvoiceUpdateDto
    {
        public decimal TotalAmount { get; set; }
        public bool IsPaid { get; set; }
    }
}
