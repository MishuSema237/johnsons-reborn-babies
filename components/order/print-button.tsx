"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPrint, FaDownload } from "react-icons/fa";

export function PrintButton() {
    const [isGenerating, setIsGenerating] = useState(false);

    const isMobile = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const handlePrint = async () => {
        if (isMobile()) {
            // Generate PDF for mobile
            setIsGenerating(true);
            try {
                const html2canvas = (await import("html2canvas")).default;
                const jsPDF = (await import("jspdf")).default;

                const element = document.querySelector('.max-w-3xl') as HTMLElement;
                if (!element) return;

                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff', // Force white background
                    onclone: (clonedDoc) => {
                        // Remove elements that might cause issues or aren't needed for print
                        const elementsToRemove = clonedDoc.querySelectorAll('.print\\:hidden');
                        elementsToRemove.forEach(el => el.remove());
                    }
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                });

                const imgWidth = 210; // A4 width in mm
                const pageHeight = 297; // A4 height in mm
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }

                pdf.save('order-receipt.pdf');
            } catch (error) {
                console.error('Error generating PDF:', error);
                // Fallback to regular print if PDF generation fails
                window.print();
            } finally {
                setIsGenerating(false);
            }
        } else {
            // Use browser print for desktop
            window.print();
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handlePrint}
            disabled={isGenerating}
            className="flex items-center gap-2 print:hidden"
        >
            {isGenerating ? (
                <>
                    <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                    Generating PDF...
                </>
            ) : (
                <>
                    {isMobile() ? <FaDownload /> : <FaPrint />}
                    {isMobile() ? 'Download Receipt' : 'Print Receipt'}
                </>
            )}
        </Button>
    );
}
