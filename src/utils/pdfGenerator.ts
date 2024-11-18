import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Cookies from "js-cookie";

/**
 * Genera un archivo PDF con diseño profesional.
 *
 * @param data - Array de objetos con los datos de la tabla.
 * @param headers - Array de strings con los encabezados de la tabla.
 * @param options - Información adicional para el diseño del PDF (título, tipo de informe, etc.).
 * @param orientation - Orientación del PDF ('portrait' o 'landscape').
 */
export const generatePDF = (
    data: Record<string, any>[],
    headers: string[],
    options: {
        title: string;
        reportType: string;
        date: string;
        description?: string;
    },
    orientation: "portrait" | "landscape" = "portrait"
) => {
    const { title, reportType, date, description } = options;

    // Capturar información del usuario logueado desde las cookies
    const storedUser = Cookies.get("user");
    let adminName = "Usuario desconocido";

    if (storedUser) {
        const user = JSON.parse(decodeURIComponent(storedUser));
        adminName = `${user.name} ${user.lastName}`;
    }

    const doc = new jsPDF({ orientation });

    // Configuración inicial
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    // TÍTULO DEL INFORME
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(title, margin, 20);

    // DETALLES DEL INFORME
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    doc.text(`Tipo de informe: ${reportType}`, margin, 35);
    doc.text(`Fecha: ${date}`, pageWidth - 80, 35);
    doc.text(`Encargado de informe: ${adminName}`, margin, 42);

    if (description) {
        doc.text(`Descripción: ${description}`, margin, 49, {
            maxWidth: contentWidth,
        });
    }

    // Espaciado antes de la tabla
    const tableStartY = description ? 55 : 50;

    // DATOS DE LA TABLA: Preparar filas
    const tableData = data.map((row) =>
        headers.map((header) => row[header] ?? "N/A")
    );

    // TABLA
    autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: tableStartY,
        theme: "grid",
        headStyles: {
            fillColor: [41, 128, 185], // Azul oscuro para el encabezado
            textColor: [255, 255, 255], // Texto blanco
            fontSize: 10,
            fontStyle: "bold",
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [0, 0, 0],
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245], // Gris claro para filas alternas
        },
        tableWidth: "auto",
        styles: {
            overflow: "linebreak",
        },
        margin: { top: tableStartY },
    });

    // PIE DE PÁGINA
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(
            `Página ${i} de ${totalPages}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: "center" }
        );
    }

    // DESCARGAR PDF
    doc.save(`${title}.pdf`);
};
