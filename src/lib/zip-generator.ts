import JSZip from 'jszip';

export interface ZipFileItem {
  fileName: string;
  blob: Blob;
}

/**
 * Packages multiple PDF Blobs into a single compressed ZIP file and triggers download
 */
export async function downloadCertificatesAsZip(
  files: ZipFileItem[],
  zipFileName: string = 'Kyorix_Certificates_Batch.zip'
): Promise<void> {
  if (files.length === 0) {
    throw new Error('No certificates available to package into ZIP.');
  }

  const zip = new JSZip();
  const folder = zip.folder('Certificates') || zip;

  for (const file of files) {
    folder.file(file.fileName, file.blob);
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6,
    },
  });

  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = zipFileName.endsWith('.zip') ? zipFileName : `${zipFileName}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
