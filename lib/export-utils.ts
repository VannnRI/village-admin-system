import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType } from "docx"

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export async function exportCitizensToExcel(citizens: any[], villageName: string) {
  const excelData = citizens.map((citizen, index) => ({
    No: index + 1,
    NIK: citizen.nik,
    "No KK": citizen.no_kk,
    Nama: citizen.nama,
    "Tanggal Lahir": new Date(citizen.tanggal_lahir).toLocaleDateString("id-ID"),
    Alamat: citizen.alamat,
    "No Telepon": citizen.no_telepon || "-",
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(excelData)

  const colWidths = [
    { wch: 5 }, // No
    { wch: 18 }, // NIK
    { wch: 18 }, // No KK
    { wch: 25 }, // Nama
    { wch: 15 }, // Tanggal Lahir
    { wch: 40 }, // Alamat
    { wch: 15 }, // No Telepon
  ]
  ws["!cols"] = colWidths

  XLSX.utils.book_append_sheet(wb, ws, "Data Warga")

  const currentDate = new Date().toISOString().split("T")[0]
  const filename = `Data-Warga-${villageName}-${currentDate}.xlsx`

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })

  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

export async function exportCitizensToPDF(citizens: any[], villageName: string) {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(16)
  doc.text("DATA WARGA DESA", 105, 20, { align: "center" })
  doc.setFontSize(12)
  doc.text(`Desa: ${villageName}`, 105, 30, { align: "center" })
  doc.text(`Total: ${citizens.length} warga`, 105, 40, { align: "center" })
  doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID")}`, 105, 50, { align: "center" })

  // Prepare table data
  const tableData = citizens.map((citizen, index) => [
    index + 1,
    citizen.nik,
    citizen.nama,
    new Date(citizen.tanggal_lahir).toLocaleDateString("id-ID"),
    citizen.alamat,
    citizen.no_telepon || "-",
  ])

  // Add table
  doc.autoTable({
    head: [["No", "NIK", "Nama", "Tanggal Lahir", "Alamat", "No Telepon"]],
    body: tableData,
    startY: 60,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 15 }, // No
      1: { cellWidth: 35 }, // NIK
      2: { cellWidth: 40 }, // Nama
      3: { cellWidth: 25 }, // Tanggal Lahir
      4: { cellWidth: 50 }, // Alamat
      5: { cellWidth: 25 }, // No Telepon
    },
  })

  const currentDate = new Date().toISOString().split("T")[0]
  const filename = `Data-Warga-${villageName}-${currentDate}.pdf`
  doc.save(filename)
}

export async function exportCitizensToWord(citizens: any[], villageName: string) {
  // Create table rows
  const tableRows = [
    // Header row
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ text: "No", alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: "NIK", alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: "Nama", alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: "Tanggal Lahir", alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: "Alamat", alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: "No Telepon", alignment: AlignmentType.CENTER })] }),
      ],
    }),
    // Data rows
    ...citizens.map(
      (citizen, index) =>
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })],
            }),
            new TableCell({ children: [new Paragraph({ text: citizen.nik })] }),
            new TableCell({ children: [new Paragraph({ text: citizen.nama })] }),
            new TableCell({
              children: [new Paragraph({ text: new Date(citizen.tanggal_lahir).toLocaleDateString("id-ID") })],
            }),
            new TableCell({ children: [new Paragraph({ text: citizen.alamat })] }),
            new TableCell({ children: [new Paragraph({ text: citizen.no_telepon || "-" })] }),
          ],
        }),
    ),
  ]

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "DATA WARGA DESA",
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `Desa: ${villageName}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Total: ${citizens.length} warga`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Tanggal: ${new Date().toLocaleDateString("id-ID")}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: tableRows,
          }),
        ],
      },
    ],
  })

  const buffer = await Packer.toBlob(doc)
  const currentDate = new Date().toISOString().split("T")[0]
  const filename = `Data-Warga-${villageName}-${currentDate}.docx`

  const url = window.URL.createObjectURL(buffer)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}
