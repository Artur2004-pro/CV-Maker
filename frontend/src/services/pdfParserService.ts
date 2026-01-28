/**
 * PDF Parser Service
 * 
 * Использует pdf.js для извлечения текста и изображений из PDF файлов
 * с сохранением их позиций для создания редактируемых блоков в редакторе.
 */

import { CanvasElement, TextElement, HeadingElement, ImageElement } from '../types/canvas';

/**
 * Интерфейс для текстового элемента из PDF
 */
export interface PDFTextBlock {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  fontWeight?: string;
  color?: string;
  pageNumber: number;
}

/**
 * Интерфейс для изображения из PDF
 */
export interface PDFImageBlock {
  dataUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
}

/**
 * Результат парсинга PDF
 */
export interface PDFParseResult {
  textBlocks: PDFTextBlock[];
  imageBlocks: PDFImageBlock[];
  pageCount: number;
  pageWidth: number;
  pageHeight: number;
}

/**
 * Сервис для парсинга PDF файлов
 */
class PDFParserService {
  private pdfjsLib: any = null;

  /**
   * Загружает PDF.js библиотеку
   */
  private async loadPDFJS(): Promise<any> {
    if (this.pdfjsLib) {
      return this.pdfjsLib;
    }

    // Проверяем, загружена ли библиотека глобально
    if ((window as any).pdfjsLib) {
      this.pdfjsLib = (window as any).pdfjsLib;
      return this.pdfjsLib;
    }

    // Загружаем из CDN
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        try {
          const pdfjsLib = (window as any).pdfjsLib;
          if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          }
          this.pdfjsLib = pdfjsLib;
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

  /**
   * Парсит PDF файл и извлекает текстовые блоки и изображения
   */
  async parsePDF(file: File): Promise<PDFParseResult> {
    try {
      console.log('[PDFParserService] Starting PDF parsing for file:', file.name);
      
      const pdfjsLib = await this.loadPDFJS();
      const arrayBuffer = await file.arrayBuffer();
      
      // Загружаем PDF документ
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      const pageCount = pdf.numPages;
      console.log('[PDFParserService] PDF has', pageCount, 'pages');

      const textBlocks: PDFTextBlock[] = [];
      const imageBlocks: PDFImageBlock[] = [];
      
      let pageWidth = 794; // A4 по умолчанию
      let pageHeight = 1123; // A4 по умолчанию

      // Обрабатываем все страницы
      for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.0 });
        
        // Сохраняем размеры первой страницы
        if (pageNum === 1) {
          pageWidth = viewport.width;
          pageHeight = viewport.height;
        }

        // Извлекаем текст
        const textContent = await page.getTextContent();
        const pageTextBlocks = this.extractTextBlocks(textContent, viewport, pageNum);
        textBlocks.push(...pageTextBlocks);

        // Извлекаем изображения
        const pageImages = await this.extractImages(page, viewport, pageNum);
        imageBlocks.push(...pageImages);
      }

      console.log('[PDFParserService] Extracted', textBlocks.length, 'text blocks and', imageBlocks.length, 'image blocks');

      return {
        textBlocks,
        imageBlocks,
        pageCount,
        pageWidth,
        pageHeight,
      };
    } catch (error) {
      console.error('[PDFParserService] Error parsing PDF:', error);
      throw new Error('Failed to parse PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  /**
   * Извлекает текстовые блоки из страницы PDF
   */
  private extractTextBlocks(textContent: any, viewport: any, pageNumber: number): PDFTextBlock[] {
    const blocks: PDFTextBlock[] = [];
    const items = textContent.items || [];

    // Группируем элементы по строкам (по Y координате)
    const lineMap = new Map<number, any[]>();
    
    for (const item of items) {
      if ('str' in item && item.str && item.str.trim()) {
        const transform = item.transform || [1, 0, 0, 1, 0, 0];
        const x = transform[4];
        const y = viewport.height - transform[5]; // Конвертируем в top-left координаты
        
        // Округляем Y для группировки по строкам
        const lineY = Math.round(y / 5) * 5;
        
        if (!lineMap.has(lineY)) {
          lineMap.set(lineY, []);
        }
        lineMap.get(lineY)!.push({ ...item, x, y, transform });
      }
    }

    // Создаем блоки из сгруппированных элементов
    let blockId = 0;
    for (const [lineY, lineItems] of lineMap.entries()) {
      if (lineItems.length === 0) continue;

      // Сортируем элементы по X координате
      lineItems.sort((a, b) => a.x - b.x);

      // Объединяем элементы в строки
      const lines: any[] = [];
      let currentLine: any[] = [];
      let lastX = -Infinity;

      for (const item of lineItems) {
        const spacing = item.x - lastX;
        
        // Если элементы слишком далеко друг от друга, начинаем новую строку
        if (spacing > 50 && currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = [];
        }
        
        currentLine.push(item);
        lastX = item.x + (item.width || 0);
      }
      
      if (currentLine.length > 0) {
        lines.push(currentLine);
      }

      // Создаем блоки из строк
      for (const line of lines) {
        if (line.length === 0) continue;

        const firstItem = line[0];
        const lastItem = line[line.length - 1];
        
        const text = line.map((item: any) => item.str).join(' ').trim();
        if (!text) continue;

        const x = firstItem.x;
        const y = firstItem.y;
        const width = (lastItem.x + (lastItem.width || 0)) - firstItem.x;
        
        // Определяем размер шрифта
        const fontSize = Math.abs(firstItem.transform[0]) || Math.abs(firstItem.transform[3]) || 12;
        const height = fontSize * 1.2;

        // Определяем, является ли это заголовком (большой шрифт или жирный)
        const isHeading = fontSize >= 16 || (firstItem as any).fontName?.includes('Bold');

        blocks.push({
          text,
          x,
          y: y - height, // Корректируем Y для top-left origin
          width: Math.max(width, 100), // Минимальная ширина
          height,
          fontSize,
          fontName: (firstItem as any).fontName || 'Arial',
          fontWeight: isHeading ? 'bold' : 'normal',
          pageNumber,
        });
      }
    }

    return blocks;
  }

  /**
   * Извлекает изображения из страницы PDF
   * Использует более простой подход: рендерит страницу и ищет изображения в операциях
   */
  private async extractImages(page: any, viewport: any, pageNumber: number): Promise<PDFImageBlock[]> {
    const images: PDFImageBlock[] = [];
    
    try {
      // Получаем операторный список страницы
      const ops = await page.getOperatorList();
      
      if (!ops || !ops.fnArray || !ops.argsArray) {
        return images;
      }

      // Ищем операции Do (Draw Object) которые могут содержать изображения
      for (let i = 0; i < ops.fnArray.length; i++) {
        const op = ops.fnArray[i];
        const args = ops.argsArray[i];
        
        // Операция Do (79) рисует XObject, который может быть изображением
        if (op === 79 && args && args.length > 0) {
          try {
            const xObjectName = args[0];
            
            // Получаем XObject из ресурсов страницы
            const xObject = await page.objs.get(xObjectName);
            
            if (xObject && xObject.subtype === 'Image') {
              // Это изображение
              const imgWidth = xObject.width || 100;
              const imgHeight = xObject.height || 100;
              
              // Получаем трансформацию из текущей матрицы преобразования
              // Для упрощения используем размеры изображения
              const width = imgWidth;
              const height = imgHeight;
              
              // Пытаемся получить данные изображения
              let dataUrl: string | null = null;
              
              try {
                // Создаем canvas для рендеринга изображения
                const canvas = document.createElement('canvas');
                canvas.width = imgWidth;
                canvas.height = imgHeight;
                const ctx = canvas.getContext('2d');
                
                if (ctx && xObject.data) {
                  // Конвертируем данные изображения
                  const imgData = ctx.createImageData(imgWidth, imgHeight);
                  
                  // Копируем данные (может быть в разных форматах)
                  if (xObject.data instanceof Uint8ClampedArray) {
                    imgData.data.set(xObject.data);
                  } else if (xObject.data instanceof Uint8Array) {
                    // Конвертируем в RGBA
                    for (let j = 0; j < xObject.data.length && j < imgData.data.length; j++) {
                      imgData.data[j] = xObject.data[j];
                    }
                  }
                  
                  ctx.putImageData(imgData, 0, 0);
                  dataUrl = canvas.toDataURL('image/png');
                }
              } catch (imgError) {
                console.warn('[PDFParserService] Failed to convert image to data URL:', imgError);
              }
              
              // Если удалось создать data URL, добавляем изображение
              // Для позиции используем приблизительные значения
              // В реальном PDF позиция определяется через матрицу преобразования
              if (dataUrl) {
                images.push({
                  dataUrl,
                  x: 50, // Приблизительная позиция - можно улучшить, анализируя матрицу преобразования
                  y: images.length * (height + 20), // Размещаем изображения вертикально
                  width,
                  height,
                  pageNumber,
                });
              }
            }
          } catch (error) {
            console.warn('[PDFParserService] Failed to process image operation:', error);
            // Продолжаем обработку других операций
          }
        }
      }
    } catch (error) {
      console.warn('[PDFParserService] Failed to extract images from page:', error);
      // Возвращаем пустой массив, если не удалось извлечь изображения
    }

    return images;
  }

  /**
   * Конвертирует результат парсинга PDF в CanvasElement блоки
   */
  convertToCanvasElements(
    parseResult: PDFParseResult,
    canvasWidth: number = 794,
    canvasHeight: number = 1123
  ): CanvasElement[] {
    const elements: CanvasElement[] = [];
    let zIndex = 0;

    // Конвертируем текстовые блоки
    for (const textBlock of parseResult.textBlocks) {
      // Пропускаем блоки вне видимой области
      if (textBlock.y < 0 || textBlock.y > canvasHeight) continue;

      // Определяем тип элемента (heading или text)
      const isHeading = textBlock.fontSize >= 16 || textBlock.fontWeight === 'bold';
      
      if (isHeading) {
        const headingElement: HeadingElement = {
          id: `pdf-heading-${Date.now()}-${zIndex}`,
          type: 'heading',
          content: textBlock.text,
          level: textBlock.fontSize >= 20 ? 1 : textBlock.fontSize >= 16 ? 2 : 3,
          x: Math.max(0, Math.min(textBlock.x, canvasWidth - textBlock.width)),
          y: Math.max(0, textBlock.y),
          width: Math.min(textBlock.width, canvasWidth),
          height: Math.max(textBlock.height, 20),
          rotation: 0,
          zIndex: zIndex++,
          locked: false,
          visible: true,
          style: {
            fontSize: textBlock.fontSize,
            fontWeight: textBlock.fontWeight || 'bold',
            fontFamily: textBlock.fontName || 'Arial',
            color: textBlock.color || '#1f2937',
            textAlign: 'left',
            padding: 4,
          },
        };
        elements.push(headingElement);
      } else {
        const textElement: TextElement = {
          id: `pdf-text-${Date.now()}-${zIndex}`,
          type: 'text',
          content: textBlock.text,
          multiline: textBlock.text.includes('\n') || textBlock.width > 400,
          x: Math.max(0, Math.min(textBlock.x, canvasWidth - textBlock.width)),
          y: Math.max(0, textBlock.y),
          width: Math.min(textBlock.width, canvasWidth),
          height: Math.max(textBlock.height, 20),
          rotation: 0,
          zIndex: zIndex++,
          locked: false,
          visible: true,
          style: {
            fontSize: textBlock.fontSize,
            fontWeight: textBlock.fontWeight || 'normal',
            fontFamily: textBlock.fontName || 'Arial',
            color: textBlock.color || '#374151',
            textAlign: 'left',
            padding: 4,
          },
        };
        elements.push(textElement);
      }
    }

    // Конвертируем изображения
    for (const imageBlock of parseResult.imageBlocks) {
      // Пропускаем изображения вне видимой области
      if (imageBlock.y < 0 || imageBlock.y > canvasHeight) continue;

      const imageElement: ImageElement = {
        id: `pdf-image-${Date.now()}-${zIndex}`,
        type: 'image',
        src: imageBlock.dataUrl,
        alt: 'Imported from PDF',
        objectFit: 'contain',
        x: Math.max(0, Math.min(imageBlock.x, canvasWidth - imageBlock.width)),
        y: Math.max(0, imageBlock.y),
        width: Math.min(imageBlock.width, canvasWidth),
        height: Math.min(imageBlock.height, canvasHeight),
        rotation: 0,
        zIndex: zIndex++,
        locked: false,
        visible: true,
        style: {
          padding: 0,
          margin: 0,
        },
      };
      elements.push(imageElement);
    }

    console.log('[PDFParserService] Converted to', elements.length, 'canvas elements');
    return elements;
  }
}

// Создаем singleton экземпляр
export const pdfParserService = new PDFParserService();

