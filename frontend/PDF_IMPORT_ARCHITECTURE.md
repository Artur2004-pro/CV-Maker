# Архитектура импорта PDF в редактируемые блоки

## Обзор

Система импорта PDF преобразует PDF файлы в редактируемые блоки (текст и изображения) с сохранением их позиций и стилей. Это позволяет пользователям импортировать существующие CV и редактировать их в визуальном редакторе.

## Архитектура решения

### 1. PDF Parser Service (`pdfParserService.ts`)

**Назначение:** Извлечение текста и изображений из PDF с сохранением позиций и стилей.

**Основные компоненты:**

#### `parsePDF(file: File): Promise<PDFParseResult>`
- Загружает PDF.js библиотеку из CDN
- Парсит все страницы PDF
- Извлекает текстовые блоки с позициями и стилями
- Извлекает изображения с позициями
- Возвращает структурированный результат

#### `extractTextBlocks(textContent, viewport, pageNumber)`
- Группирует текстовые элементы по строкам (Y координата)
- Объединяет элементы в логические блоки
- Определяет размер шрифта, стиль, цвет
- Определяет, является ли блок заголовком (по размеру шрифта)

#### `extractImages(page, viewport, pageNumber)`
- Анализирует операторный список страницы
- Находит операции рисования изображений (Do)
- Извлекает изображения из XObject ресурсов
- Конвертирует в data URL для использования в редакторе

#### `convertToCanvasElements(parseResult, canvasWidth, canvasHeight)`
- Конвертирует извлеченные блоки в `CanvasElement` объекты
- Определяет тип элемента (heading/text для текста, image для изображений)
- Устанавливает правильные позиции и размеры
- Применяет стили (шрифт, цвет, выравнивание)

### 2. Интеграция с Canvas Editor

**Файл:** `CanvasSaveLoad.tsx`

**Процесс импорта:**

1. **Пользователь выбирает PDF файл**
   ```typescript
   handleImport(event) → file selected
   ```

2. **Парсинг PDF в визуальные блоки**
   ```typescript
   pdfParserService.parsePDF(file)
   → PDFParseResult {
     textBlocks: PDFTextBlock[],
     imageBlocks: PDFImageBlock[],
     pageCount, pageWidth, pageHeight
   }
   ```

3. **Конвертация в Canvas элементы**
   ```typescript
   pdfParserService.convertToCanvasElements(parseResult)
   → CanvasElement[] (TextElement | HeadingElement | ImageElement)
   ```

4. **Добавление в состояние редактора**
   ```typescript
   dispatch({ type: 'LOAD_PROJECT', project })
   → Canvas state updated
   → UI re-renders with editable blocks
   ```

5. **Fallback механизм**
   - Если визуальный парсинг не удался → использует структурированный импорт
   - Если есть CVCanvasContext → применяет шаблон
   - Если нет шаблона → создает элементы вручную из CVData

## Типы данных

### PDFTextBlock
```typescript
{
  text: string;           // Текст блока
  x: number;             // X позиция
  y: number;             // Y позиция (top-left origin)
  width: number;          // Ширина блока
  height: number;         // Высота блока
  fontSize: number;       // Размер шрифта
  fontName: string;       // Название шрифта
  fontWeight?: string;    // Жирность (bold/normal)
  color?: string;         // Цвет текста
  pageNumber: number;     // Номер страницы
}
```

### PDFImageBlock
```typescript
{
  dataUrl: string;        // Data URL изображения
  x: number;             // X позиция
  y: number;             // Y позиция
  width: number;          // Ширина
  height: number;         // Высота
  pageNumber: number;     // Номер страницы
}
```

### CanvasElement (результат)
- `TextElement` - для обычного текста
- `HeadingElement` - для заголовков (fontSize >= 16 или bold)
- `ImageElement` - для изображений

## Особенности реализации

### Группировка текста
- Текст группируется по строкам (округляется Y координата)
- Элементы на одной строке объединяются в блоки
- Если элементы слишком далеко друг от друга (>50px), создается новый блок

### Определение заголовков
- Заголовки определяются по размеру шрифта (>= 16px) или жирности
- Уровень заголовка зависит от размера:
  - fontSize >= 20 → h1
  - fontSize >= 16 → h2
  - Иначе → h3

### Обработка координат
- PDF использует bottom-left origin
- Конвертируем в top-left origin для Canvas:
  ```typescript
  y = viewport.height - pdfY
  ```

### Извлечение изображений
- Анализирует операторный список страницы
- Ищет операции Do (Draw Object)
- Извлекает XObject с subtype === 'Image'
- Конвертирует в data URL через Canvas API

## Обработка ошибок

1. **Ошибка загрузки PDF.js**
   - Fallback на структурированный импорт
   - Показывает сообщение об ошибке пользователю

2. **Ошибка парсинга PDF**
   - Fallback на структурированный импорт через `fileUploadService`
   - Пытается извлечь CVData и создать элементы вручную

3. **Пустой PDF**
   - Проверяет количество извлеченных блоков
   - Показывает ошибку, если блоков нет

4. **Ошибка извлечения изображений**
   - Логирует предупреждение
   - Продолжает обработку текста
   - Изображения просто не добавляются

## Производительность

- PDF.js загружается асинхронно из CDN
- Парсинг выполняется для всех страниц последовательно
- Изображения обрабатываются асинхронно
- Большие PDF могут обрабатываться долго - можно добавить прогресс-бар

## Будущие улучшения

1. **Улучшение извлечения изображений**
   - Более точное определение позиций изображений через матрицу преобразования
   - Поддержка векторной графики

2. **Оптимизация группировки текста**
   - Умная группировка по семантике (параграфы, списки)
   - Определение колонок и таблиц

3. **Поддержка многостраничных PDF**
   - Размещение страниц вертикально
   - Навигация между страницами

4. **Прогресс-бар**
   - Показ прогресса парсинга больших PDF
   - Индикация обработки каждой страницы

5. **Кэширование**
   - Кэширование результатов парсинга
   - Сохранение в localStorage для быстрого доступа

## Использование

```typescript
import { pdfParserService } from '../services/pdfParserService';

// Парсинг PDF
const parseResult = await pdfParserService.parsePDF(pdfFile);

// Конвертация в элементы редактора
const elements = pdfParserService.convertToCanvasElements(
  parseResult,
  canvasWidth,
  canvasHeight
);

// Добавление в редактор
dispatch({ type: 'RESET_AND_ADD_ELEMENTS', elements });
```

## Зависимости

- **PDF.js** (загружается из CDN): `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js`
- **PDF.js Worker**: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

## Тестирование

Для тестирования:
1. Импортируйте PDF файл через кнопку "Import" в Canvas Editor
2. Проверьте, что текст и изображения появились в редакторе
3. Убедитесь, что элементы редактируемы (можно перемещать, изменять размер, редактировать текст)
4. Проверьте сохранение и загрузку проекта с импортированным PDF

