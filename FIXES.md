# Исправления бесконечных циклов и проблем с загрузкой

## Дата: 2024

## Проблемы, которые были исправлены

### 1. Бесконечный цикл обновлений в CVCanvasContext
**Ошибка:** `Maximum update depth exceeded` в `CVCanvasContext.tsx:188`

**Причина:**
- `useEffect` в `CanvasCVEditorPage.tsx` зависел от `cvData`, который изменялся при применении шаблона
- Объект `value` в контексте пересоздавался при каждом рендере
- Функция `updateCVFromElement` пересоздавалась при каждом изменении `state.elements`

**Исправления:**

#### CVCanvasContext.tsx
1. **Добавлен `useMemo` для мемоизации объекта `value`:**
   ```typescript
   const value: CVCanvasContextType = useMemo(() => ({
     cvData,
     setCVData,
     templateId,
     setTemplateId,
     updateCVFromElement,
     applyTemplate,
     saveCV,
     loadCV,
   }), [cvData, setCVData, templateId, setTemplateId, updateCVFromElement, applyTemplate, saveCV, loadCV]);
   ```

2. **Использован `useRef` для хранения актуального `state` в `updateCVFromElement`:**
   ```typescript
   const stateRef = useRef(state);
   useEffect(() => {
     stateRef.current = state;
   }, [state]);

   const updateCVFromElement = useCallback((elementId: string, newContent: string) => {
     const element = stateRef.current.elements.find(el => el.id === elementId);
     // ... остальной код
   }, [setCVData]);
   ```

#### CanvasCVEditorPage.tsx
1. **Убраны зависимости из `useEffect` для применения шаблона:**
   - Использованы `useRef` для `applyTemplate` и `cvData`
   - Убраны `cvData` и `applyTemplate` из зависимостей `useEffect`
   - Применение шаблона происходит только при изменении `templateId`

   ```typescript
   const applyTemplateRef = useRef(applyTemplate);
   const cvDataRef = useRef(cvData);

   useEffect(() => {
     applyTemplateRef.current = applyTemplate;
   }, [applyTemplate]);

   useEffect(() => {
     cvDataRef.current = cvData;
   }, [cvData]);

   useEffect(() => {
     if (templateId && templateId !== initialTemplateIdRef.current) {
       const template = getTemplatePreset(templateId);
       if (template) {
         applyTemplateRef.current(template, cvDataRef.current);
         initialTemplateIdRef.current = templateId;
       }
     }
   }, [templateId]); // Только templateId в зависимостях
   ```

### 2. Бесконечная загрузка страницы /editor
**Проблема:** Страница `/editor` бесконечно загружалась

**Причины:**
1. Проверка `isAuthenticated` в теле компонента вызывала `navigate('/login')` на каждом рендере
2. Неправильная логика `dataLoadedRef` при `id === undefined`
3. Проверка `location.state` выполнялась на каждом рендере
4. Отсутствие проверки на наличие шаблонов

**Исправления:**

#### CanvasCVEditorPage.tsx

1. **Разделена проверка аутентификации на отдельный `useEffect`:**
   ```typescript
   // Redirect to login if not authenticated
   useEffect(() => {
     if (!isAuthenticated) {
       navigate('/login', { replace: true });
     }
   }, [isAuthenticated, navigate]);
   ```

2. **Исправлена логика `dataLoadedRef`:**
   - Использован `null` как начальное значение вместо `undefined`
   - Это позволяет корректно различать случаи, когда данные еще не загружены и когда `id` действительно `undefined`

   ```typescript
   const dataLoadedRef = useRef<string | undefined | null>(null);
   
   useEffect(() => {
     if (!isAuthenticated) {
       return;
     }
     
     if (dataLoadedRef.current === id) {
       return; // Предотвращаем повторную загрузку
     }
     // ... загрузка данных
   }, [id, isAuthenticated]);
   ```

3. **Исправлена обработка `location.state`:**
   ```typescript
   const locationStateRef = useRef<EditorLocationState | null>(null);
   
   useEffect(() => {
     if (location.state) {
       locationStateRef.current = location.state as EditorLocationState;
     }
   }, [location.state]);
   
   const state = locationStateRef.current || {};
   ```

4. **Добавлена проверка на наличие шаблонов:**
   ```typescript
   if (!templateId) {
     console.error('[CanvasCVEditorPage] No template available');
     toast.error('No template available. Please create a template first.');
     navigate('/dashboard');
     return;
   }
   ```

5. **Убран `navigate` из зависимостей основного `useEffect`:**
   - Это предотвращает повторные запуски эффекта при изменении функции `navigate`

## Измененные файлы

### CV-Maker/frontend/src/contexts/CVCanvasContext.tsx
- Добавлен импорт `useMemo`
- Добавлен `useRef` для хранения актуального `state`
- Мемоизирован объект `value` контекста
- Использован `useRef` в `updateCVFromElement` для доступа к актуальным элементам

### CV-Maker/frontend/src/pages/canvas/CanvasCVEditorPage.tsx
- Добавлены `useRef` для `applyTemplate`, `cvData`, `locationState`, `dataLoadedRef`
- Разделена логика проверки аутентификации
- Исправлена логика загрузки данных
- Добавлена проверка на наличие шаблонов
- Улучшена обработка `location.state`

## Результат

После всех исправлений:
- ✅ Устранен бесконечный цикл обновлений (`Maximum update depth exceeded`)
- ✅ Страница `/editor` корректно загружается
- ✅ Шаблоны применяются только один раз при монтировании
- ✅ Контекст не пересоздается при каждом рендере
- ✅ Предотвращены повторные загрузки данных

## Технические детали

### Использованные техники оптимизации:
1. **Мемоизация** - `useMemo` для стабильности объекта контекста
2. **Refs** - `useRef` для хранения актуальных значений без триггера ререндеров
3. **Разделение эффектов** - отдельные `useEffect` для разных задач
4. **Правильные зависимости** - минимизация зависимостей в `useEffect`

### Принципы, которые были применены:
- **Избежание лишних ререндеров** - использование refs вместо state там, где это возможно
- **Стабильность функций** - мемоизация колбэков через `useCallback` и `useMemo`
- **Правильное управление жизненным циклом** - предотвращение повторных вызовов через refs

## Рекомендации для будущего

1. Всегда проверяйте зависимости в `useEffect` - лишние зависимости могут вызвать бесконечные циклы
2. Используйте `useMemo` для объектов, передаваемых в контекст
3. Используйте `useRef` для значений, которые нужны в эффектах, но не должны триггерить ререндеры
4. Разделяйте логику на отдельные эффекты для лучшей читаемости и отладки
5. Всегда проверяйте наличие необходимых данных перед их использованием

