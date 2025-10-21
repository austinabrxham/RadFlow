import QRCode from 'qrcode';

export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 200,
      margin: 2,
      color: {
        dark: '#0B1120',
        light: '#FFFFFF',
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return '';
  }
}
