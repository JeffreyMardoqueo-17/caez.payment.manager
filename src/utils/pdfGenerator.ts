// utils/pdfGenerator.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Genera un archivo PDF con los datos y encabezados proporcionados.
 *
 * @param data - Array de objetos con los datos de la tabla.
 * @param headers - Array de strings con los encabezados de la tabla.
 * @param title - Título del PDF.
 */
export const generatePDF = (data: Record<string, any>[], headers: string[], title: string = 'Reporte') => {
    const doc = new jsPDF();

    // Título del documento
    doc.setFontSize(18);
    doc.text(title, 14, 20);

    // Preparar los datos para la tabla
    const tableData = data.map(row => headers.map(header => row[header] ?? ''));

    // Generar tabla
    (doc as any).autoTable({
        head: [headers],
        body: tableData,
        startY: 30,
        theme: 'striped',
        styles: {
            fontSize: 10,
        },
    });

    // Descargar el PDF
    doc.save(`${title}.pdf`);
};
