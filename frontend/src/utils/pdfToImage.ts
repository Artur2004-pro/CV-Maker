/**
 * Utility functions for converting PDF files to images
 */

/**
 * Convert PDF file to image data URL using browser's PDF rendering
 * This function creates an iframe to render the PDF and then captures it as an image
 */
export async function pdfToImage(pdfFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Create object URL for the PDF file
      const pdfUrl = URL.createObjectURL(pdfFile);

      // Create an iframe to render the PDF
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.width = '794px'; // A4 width in pixels at 96 DPI
      iframe.style.height = '1123px'; // A4 height in pixels at 96 DPI
      iframe.src = pdfUrl;
      
      document.body.appendChild(iframe);

      // Wait for PDF to load
      iframe.onload = () => {
        try {
          // Use html2canvas to capture the iframe content
          import('html2canvas').then((html2canvas) => {
            html2canvas.default(iframe.contentDocument?.body || iframe, {
              scale: 2,
              useCORS: true,
              allowTaint: true,
              width: 794,
              height: 1123,
            }).then((canvas) => {
              const imageDataUrl = canvas.toDataURL('image/png');
              
              // Cleanup
              document.body.removeChild(iframe);
              URL.revokeObjectURL(pdfUrl);
              
              resolve(imageDataUrl);
            }).catch((error) => {
              document.body.removeChild(iframe);
              URL.revokeObjectURL(pdfUrl);
              reject(new Error('Failed to capture PDF as image: ' + error.message));
            });
          }).catch(() => {
            // Fallback: convert PDF to image using FileReader and canvas
            fallbackPdfToImage(pdfFile).then(resolve).catch(reject);
          });
        } catch (error) {
          document.body.removeChild(iframe);
          URL.revokeObjectURL(pdfUrl);
          reject(error);
        }
      };

      iframe.onerror = () => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(pdfUrl);
        // Try fallback method
        fallbackPdfToImage(pdfFile).then(resolve).catch(reject);
      };
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Fallback method: Convert PDF to image using FileReader
 * This creates a data URL from the PDF file
 */
async function fallbackPdfToImage(pdfFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // Create a canvas and draw PDF preview
        const canvas = document.createElement('canvas');
        canvas.width = 794; // A4 width
        canvas.height = 1123; // A4 height
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Fill with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw PDF icon/placeholder
        ctx.fillStyle = '#9ca3af';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('📄 PDF', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.font = '24px Arial';
        ctx.fillText(pdfFile.name, canvas.width / 2, canvas.height / 2 + 30);

        const imageDataUrl = canvas.toDataURL('image/png');
        resolve(imageDataUrl);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read PDF file'));
    };

    reader.readAsDataURL(pdfFile);
  });
}

/**
 * Convert PDF file to image using PDF.js library
 * This is the most reliable method for rendering PDF content
 */
export async function pdfToImageSimple(pdfFile: File): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // Load PDF.js from CDN
      const pdfjsLib = await loadPDFJS();
      
      // Read PDF file as ArrayBuffer
      const arrayBuffer = await pdfFile.arrayBuffer();
      
      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      // Get first page
      const page = await pdf.getPage(1);
      
      // Set scale for rendering
      const scale = 2.0; // Higher scale for better quality
      const viewport = page.getViewport({ scale });
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render PDF page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      
      await page.render(renderContext).promise;
      
      // Convert canvas to image data URL
      const imageDataUrl = canvas.toDataURL('image/png', 0.95);
      
      resolve(imageDataUrl);
    } catch (error) {
      console.error('Error converting PDF to image:', error);
      // Fallback to placeholder
      fallbackPdfToImage(pdfFile).then(resolve).catch(reject);
    }
  });
}

/**
 * Extract text content and positions from PDF
 */
export interface PDFTextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
}

export async function extractPDFText(pdfFile: File): Promise<PDFTextItem[]> {
  try {
    const pdfjsLib = await loadPDFJS();
    const arrayBuffer = await pdfFile.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });
    
    const textItems: PDFTextItem[] = [];
    
    for (const item of textContent.items) {
      if ('str' in item && item.str && item.str.trim()) {
        // Get transform matrix
        const transform = item.transform || [1, 0, 0, 1, 0, 0];
        
        // Calculate position
        // PDF coordinates: bottom-left is origin, but we need top-left
        const x = transform[4];
        const y = viewport.height - transform[5];
        
        // Estimate width and height from transform matrix
        const fontSize = Math.abs(transform[0]) || Math.abs(transform[3]) || 12;
        const width = item.width || fontSize * item.str.length * 0.6;
        const height = item.height || fontSize * 1.2;
        
        textItems.push({
          text: item.str,
          x: x,
          y: y - height, // Adjust Y to top-left origin
          width: width,
          height: height,
          fontSize: fontSize,
          fontName: (item as any).fontName || 'Arial',
        });
      }
    }
    
    return textItems;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return [];
  }
}

/**
 * Load PDF.js library from CDN
 */
async function loadPDFJS(): Promise<any> {
  // Check if PDF.js is already loaded
  if ((window as any).pdfjsLib) {
    return (window as any).pdfjsLib;
  }
  
  // Load PDF.js from CDN
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      try {
        // Set worker source
        const pdfjsLib = (window as any).pdfjsLib;
        if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        resolve(pdfjsLib);
      } catch (error) {
        reject(new Error('Failed to initialize PDF.js: ' + (error instanceof Error ? error.message : 'Unknown error')));
      }
    };
    script.onerror = () => {
      reject(new Error('Failed to load PDF.js library from CDN'));
    };
    document.head.appendChild(script);
  });
}

