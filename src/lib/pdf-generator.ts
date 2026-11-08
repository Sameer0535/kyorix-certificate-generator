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
      onclone: (clonedDoc, clonedElement) => {
        // Reset transforms and margins on target element
        clonedElement.style.transform = 'none';
        clonedElement.style.margin = '0';
        clonedElement.style.position = 'relative';
        clonedElement.style.top = '0';
        clonedElement.style.left = '0';

        // Clear transforms and overflow restrictions on all parent containers up to body
        let parent: HTMLElement | null = clonedElement.parentElement;
        while (parent && parent !== clonedDoc.body) {
          parent.style.transform = 'none';
          parent.style.overflow = 'visible';
          parent = parent.parentElement;
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
      onclone: (clonedDoc, clonedElement) => {
        // Reset transforms and margins on target element
        clonedElement.style.transform = 'none';
        clonedElement.style.margin = '0';
        clonedElement.style.position = 'relative';
        clonedElement.style.top = '0';
        clonedElement.style.left = '0';

        // Clear transforms and overflow restrictions on all parent containers up to body
        let parent: HTMLElement | null = clonedElement.parentElement;
        while (parent && parent !== clonedDoc.body) {
          parent.style.transform = 'none';
          parent.style.overflow = 'visible';
          parent = parent.parentElement;
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
