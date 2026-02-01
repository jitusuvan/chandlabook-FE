import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const captureInvitationCard = async (elementRef: React.RefObject<HTMLDivElement>) => {
  if (!elementRef.current) return null;

  try {
    const canvas = await html2canvas(elementRef.current, {
      backgroundColor: null,
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    return canvas;
  } catch (error) {
    console.error('Failed to capture invitation:', error);
    return null;
  }
};

export const downloadAsPDF = async (elementRef: React.RefObject<HTMLDivElement>, filename: string) => {
  const canvas = await captureInvitationCard(elementRef);
  if (!canvas) return false;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(`${filename}.pdf`);
  
  return true;
};

export const downloadAsImage = async (elementRef: React.RefObject<HTMLDivElement>, filename: string) => {
  const canvas = await captureInvitationCard(elementRef);
  if (!canvas) return false;

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
  
  return true;
};