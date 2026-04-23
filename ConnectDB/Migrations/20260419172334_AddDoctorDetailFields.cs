using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConnectDB.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorDetailFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Biography",
                table: "doctors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ClinicAddress",
                table: "doctors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "ConsultationPrice",
                table: "doctors",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Introduction",
                table: "doctors",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Position",
                table: "doctors",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Biography",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "ClinicAddress",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "ConsultationPrice",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "Introduction",
                table: "doctors");

            migrationBuilder.DropColumn(
                name: "Position",
                table: "doctors");
        }
    }
}
