import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportPdfOptions {
  fileName?: string;
  quality?: number;
  scale?: number;
  orientation?: 'landscape' | 'portrait';
}

export async function exportCertificateToPdf(
  element: HTMLElement,
  options: ExportPdfOptions = {}
): Promise<boolean> {
  const {
    fileName = 'Kyorix_Certificate.pdf',
    quality = 0.98,
    scale = 2.5,
    orientation = 'landscape',
  } = options;

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (_clonedDoc, clonedElement) => {
        clonedElement.style.transform = 'none';
        clonedElement.style.margin = '0';
        if (clonedElement.parentElement) {
          clonedElement.parentElement.style.transform = 'none';
        }
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', quality);

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
    return true;
  } catch (error) {
    console.error('Failed to generate PDF certificate:', error);
    throw error;
  }
}

/**
 * Generates an in-memory PDF Blob for bulk / batch zip packaging
 */
export async function generateCertificatePdfBlob(
  element: HTMLElement,
  options: ExportPdfOptions = {}
): Promise<Blob> {
  const {
    quality = 0.95,
    scale = 2.0, // optimal resolution and memory performance for batch generation
    orientation = 'landscape',
  } = options;

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (_clonedDoc, clonedElement) => {
        clonedElement.style.transform = 'none';
        clonedElement.style.margin = '0';
        if (clonedElement.parentElement) {
          clonedElement.parentElement.style.transform = 'none';
        }
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', quality);

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

    return pdf.output('blob');
  } catch (error) {
    console.error('Failed to generate certificate blob:', error);
    throw error;
  }
}
