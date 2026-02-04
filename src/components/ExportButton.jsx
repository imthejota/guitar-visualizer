import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const ExportButton = ({ targetRef, fileName = 'guitar-visualization' }) => {
    const handleExport = async () => {
        if (!targetRef.current) return;

        try {
            const element = targetRef.current;

            // Create canvas from the element
            const canvas = await html2canvas(element, {
                scale: 2, // High resolution
                backgroundColor: '#121212', // Preserve dark theme background
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');

            // Initialize PDF (Landscape A4)
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Maintain aspect ratio
            const ratio = imgProps.width / imgProps.height;

            // Calculate dimensions to fit within margins
            const margin = 10;
            const availableWidth = pdfWidth - (margin * 2);
            const availableHeight = pdfHeight - (margin * 2);

            let finalWidth = availableWidth;
            let finalHeight = finalWidth / ratio;

            if (finalHeight > availableHeight) {
                finalHeight = availableHeight;
                finalWidth = finalHeight * ratio;
            }

            // Center image
            const x = (pdfWidth - finalWidth) / 2;
            const y = (pdfHeight - finalHeight) / 2;

            pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
            pdf.save(`${fileName}.pdf`);

        } catch (err) {
            console.error('Export failed:', err);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    return (
        <button
            onClick={handleExport}
            style={{
                padding: '0.6em 1.2em',
                fontSize: '1em',
                fontWeight: 'bold',
                backgroundColor: 'var(--primary-color)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '1rem',
                marginBottom: '1rem'
            }}
        >
            Export to PDF 📄
        </button>
    );
};
