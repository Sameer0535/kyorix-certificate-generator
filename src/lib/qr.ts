import QRCode from 'qrcode';

export async function generateQrCodeDataUrl(
  text: string,
  options?: {
    color?: { dark: string; light: string };
    width?: number;
  }
): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: options?.width || 120,
      color: {
        dark: options?.color?.dark || '#0A1128',
        light: options?.color?.light || '#FFFFFF00', // transparent background
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}
