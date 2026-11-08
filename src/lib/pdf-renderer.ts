export interface PdfRenderResult {
  imageDataUrl: string;
  width: number;
  height: number;
  orientation: 'landscape' | 'portrait';
  aspectRatio: number; // width / height
}

export async function renderPdfToImage(
  pdfDataUrlOrBuffer: string | ArrayBuffer
): Promise<PdfRenderResult> {
  if (typeof window === 'undefined') {
    throw new Error('PDF rendering can only be performed in browser environment.');
  }

  // Dynamic import to prevent SSR bundling issues
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  let pdfData: Uint8Array;
  if (typeof pdfDataUrlOrBuffer === 'string') {
    // If base64 data url, convert to binary
    const base64Index = pdfDataUrlOrBuffer.indexOf(';base64,');
    if (base64Index >= 0) {
      const base64String = pdfDataUrlOrBuffer.substring(base64Index + 8);
      const binaryString = atob(base64String);
      const len = binaryString.length;
      pdfData = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        pdfData[i] = binaryString.charCodeAt(i);
      }
    } else {
      // Fetch or decode
      const res = await fetch(pdfDataUrlOrBuffer);
      const buf = await res.arrayBuffer();
      pdfData = new Uint8Array(buf);
    }
  } else {
    pdfData = new Uint8Array(pdfDataUrlOrBuffer);
  }

  const loadingTask = pdfjsLib.getDocument({
    data: pdfData,
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@6.5.438/cmaps/',
    cMapPacked: true,
  });

  const pdfDoc = await loadingTask.promise;
  const page = await pdfDoc.getPage(1);

  // Compute viewport
  const unscaledViewport = page.getViewport({ scale: 1.0 });
  const isLandscape = unscaledViewport.width >= unscaledViewport.height;
  const orientation: 'landscape' | 'portrait' = isLandscape ? 'landscape' : 'portrait';

  // Render at high DPI for crisp template quality (target width ~1800-2400px)
  const targetWidth = isLandscape ? 2100 : 1500;
  const renderScale = targetWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale: renderScale });

  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  const context = canvas.getContext('2d', { alpha: false });
  if (!context) {
    throw new Error('Could not get 2D rendering context for PDF canvas');
  }

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Render page
  // @ts-expect-error canvasContext typing in pdfjs-dist
  await page.render({ canvasContext: context, viewport }).promise;

  const imageDataUrl = canvas.toDataURL('image/png', 0.95);

  return {
    imageDataUrl,
    width: canvas.width,
    height: canvas.height,
    orientation,
    aspectRatio: unscaledViewport.width / unscaledViewport.height,
  };
}
