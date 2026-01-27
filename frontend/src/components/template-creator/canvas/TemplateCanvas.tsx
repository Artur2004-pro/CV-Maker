import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { TemplateCanvas as CanvasType, TemplateElement, CanvasEvent } from '../../../types/template-creator';

interface TemplateCanvasProps {
  canvas: CanvasType;
  selectedElements: string[];
  zoom: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  snapToGrid: boolean;
  onElementSelect: (elementIds: string[]) => void;
  onElementUpdate: (element: TemplateElement) => void;
  onCanvasUpdate: (canvas: Partial<CanvasType>) => void;
  onEvent: (event: CanvasEvent) => void;
}

export const TemplateCanvasComponent: React.FC<TemplateCanvasProps> = ({
  canvas: canvasData,
  selectedElements,
  zoom,
  panX,
  panY,
  showGrid,
  snapToGrid,
  onElementSelect,
  onElementUpdate,
  onCanvasUpdate,
  onEvent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    
    const x = (screenX - rect.left - panX) / zoom;
    const y = (screenY - rect.top - panY) / zoom;
    
    return { x, y };
  }, [zoom, panX, panY]);

  // Snap to grid if enabled
  const snapToGridPoint = useCallback((x: number, y: number) => {
    if (!snapToGrid || !canvasData.gridSize) return { x, y };
    
    return {
      x: Math.round(x / canvasData.gridSize) * canvasData.gridSize,
      y: Math.round(y / canvasData.gridSize) * canvasData.gridSize,
    };
  }, [snapToGrid, canvasData.gridSize]);

  // Draw grid
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showGrid || !canvasData.gridSize) return;
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;
    
    const startX = -panX / zoom;
    const startY = -panY / zoom;
    const endX = (canvasData.width - panX) / zoom;
    const endY = (canvasData.height - panY) / zoom;
    
    for (let x = Math.floor(startX / canvasData.gridSize) * canvasData.gridSize; x <= endX; x += canvasData.gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, endY);
      ctx.stroke();
    }
    
    for (let y = Math.floor(startY / canvasData.gridSize) * canvasData.gridSize; y <= endY; y += canvasData.gridSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.stroke();
    }
  }, [showGrid, canvasData.gridSize, canvasData.width, canvasData.height, panX, panY, zoom]);

  // Draw element
  const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: TemplateElement) => {
    if (!element.visible) return;
    
    ctx.save();
    
    // Apply transformations
    ctx.translate(element.x + element.width / 2, element.y + element.height / 2);
    ctx.rotate((element.rotation * Math.PI) / 180);
    ctx.translate(-(element.x + element.width / 2), -(element.y + element.height / 2));
    
    // Apply styles
    ctx.globalAlpha = element.style.opacity || 1;
    
    if (element.style.backgroundColor) {
      ctx.fillStyle = element.style.backgroundColor;
      ctx.fillRect(element.x, element.y, element.width, element.height);
    }
    
    if (element.style.borderColor) {
      ctx.strokeStyle = element.style.borderColor;
      ctx.lineWidth = element.style.borderWidth || 1;
      ctx.strokeRect(element.x, element.y, element.width, element.height);
    }
    
    // Draw based on element type
    switch (element.type) {
      case 'text':
        drawTextElement(ctx, element);
        break;
      case 'rectangle':
        drawRectangleElement(ctx, element);
        break;
      case 'circle':
        drawCircleElement(ctx, element);
        break;
      case 'line':
        drawLineElement(ctx, element);
        break;
      case 'cv-field':
        drawCVFieldElement(ctx, element);
        break;
      case 'image':
        drawImageElement(ctx, element);
        break;
    }
    
    // Draw selection border if selected
    if (selectedElements.includes(element.id)) {
      drawSelectionBorder(ctx, element);
    }
    
    ctx.restore();
  }, [selectedElements]);

  // Draw text element
  const drawTextElement = (ctx: CanvasRenderingContext2D, element: TemplateElement) => {
    const { text, fontSize = 16, fontFamily = 'Arial', fontWeight = 'normal', textAlign = 'left' } = element.data;
    
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = '#000000';
    ctx.textAlign = textAlign as CanvasTextAlign;
    ctx.textBaseline = 'top';
    
    const lines = (text || '').split('\n');
    const lineHeight = fontSize * 1.2;
    
    lines.forEach((line, index) => {
      let x = element.x;
      if (textAlign === 'center') x += element.width / 2;
      if (textAlign === 'right') x += element.width;
      
      ctx.fillText(line, x, element.y + (index * lineHeight));
    });
  };

  // Draw rectangle element
  const drawRectangleElement = (ctx: CanvasRenderingContext2D, element: TemplateElement) => {
    const { fillColor, strokeColor, strokeWidth } = element.data;
    
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fillRect(element.x, element.y, element.width, element.height);
    }
    
    if (strokeColor && strokeWidth) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.strokeRect(element.x, element.y, element.width, element.height);
    }
  };

  // Draw circle element
  const drawCircleElement = (ctx: CanvasRenderingContext2D, element: TemplateElement) => {
    const { fillColor, strokeColor, strokeWidth } = element.data;
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    const radius = Math.min(element.width, element.height) / 2;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    
    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }
    
    if (strokeColor && strokeWidth) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
    }
  };

  // Draw line element
  const drawLineElement = (ctx: CanvasRenderingContext2D, element: TemplateElement) => {
    const { strokeColor = '#000000', strokeWidth = 1, x2, y2 } = element.data;
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.moveTo(element.x, element.y);
    ctx.lineTo(x2 || element.x + element.width, y2 || element.y);
    ctx.stroke();
  };

  // Draw CV field element
  const drawCVFieldElement = (ctx: CanvasRenderingContext2D, element: TemplateElement) => {
    const { fieldType, fieldKey, placeholder } = element.data;
    
    // Draw field background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(element.x, element.y, element.width, element.height);
    
    // Draw field border
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(element.x, element.y, element.width, element.height);
    ctx.setLineDash([]);
    
    // Draw field label
    ctx.font = '12px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const label = placeholder || fieldKey || fieldType || 'CV Field';
    ctx.fillText(label, element.x + 8, element.y + 8);
    
    // Draw field icon
    ctx.font = '16px Arial';
    ctx.fillText('📄', element.x + 8, element.y + 25);
  };

  // Draw image element
  const drawImageElement = (ctx: CanvasRenderingContext2D, element: TemplateElement) => {
    const { src } = element.data;
    
    if (src) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, element.x, element.y, element.width, element.height);
      };
      img.src = src;
    } else {
      // Draw placeholder
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(element.x, element.y, element.width, element.height);
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 1;
      ctx.strokeRect(element.x, element.y, element.width, element.height);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Image', element.x + element.width / 2, element.y + element.height / 2);
    }
  };

  // Draw selection border
  const drawSelectionBorder = (ctx: CanvasRenderingContext2D, element: TemplateElement) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4);
    ctx.setLineDash([]);
    
    // Draw resize handles
    const handleSize = 8;
    const handles = [
      { x: element.x - handleSize / 2, y: element.y - handleSize / 2 }, // top-left
      { x: element.x + element.width - handleSize / 2, y: element.y - handleSize / 2 }, // top-right
      { x: element.x - handleSize / 2, y: element.y + element.height - handleSize / 2 }, // bottom-left
      { x: element.x + element.width - handleSize / 2, y: element.y + element.height - handleSize / 2 }, // bottom-right
    ];
    
    ctx.fillStyle = '#3b82f6';
    handles.forEach(handle => {
      ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
    });
  };

  // Main render function
  const render = useCallback(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    
    // Draw background
    ctx.fillStyle = canvasData.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
    
    // Apply zoom and pan
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(panX, panY);
    
    // Draw grid
    drawGrid(ctx);
    
    // Draw elements in z-order
    const sortedElements = [...canvasData.elements].sort((a, b) => a.zIndex - b.zIndex);
    sortedElements.forEach(element => {
      drawElement(ctx, element);
    });
    
    ctx.restore();
  }, [canvasData, zoom, panX, panY, drawGrid, drawElement]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const { x, y } = screenToCanvas(e.clientX, e.clientY);
    const snapped = snapToGridPoint(x, y);
    
    // Check if clicking on an element
    const clickedElement = canvasData.elements.find(element => 
      x >= element.x && x <= element.x + element.width &&
      y >= element.y && y <= element.y + element.height
    );
    
    if (clickedElement) {
      if (e.shiftKey) {
        // Multi-select
        const newSelection = selectedElements.includes(clickedElement.id)
          ? selectedElements.filter(id => id !== clickedElement.id)
          : [...selectedElements, clickedElement.id];
        onElementSelect(newSelection);
      } else {
        // Single select
        onElementSelect([clickedElement.id]);
      }
      
      setIsDragging(true);
      setDragStart(snapped);
    } else {
      // Start panning
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      onElementSelect([]);
    }
    
    onEvent({
      type: 'mousedown',
      x: snapped.x,
      y: snapped.y,
      target: clickedElement?.id,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
      },
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = screenToCanvas(e.clientX, e.clientY);
    const snapped = snapToGridPoint(x, y);
    
    if (isDragging && selectedElements.length > 0) {
      // Move selected elements
      const deltaX = snapped.x - dragStart.x;
      const deltaY = snapped.y - dragStart.y;
      
      selectedElements.forEach(elementId => {
        const element = canvasData.elements.find(el => el.id === elementId);
        if (element && !element.locked) {
          const updatedElement = {
            ...element,
            x: element.x + deltaX,
            y: element.y + deltaY,
          };
          onElementUpdate(updatedElement);
        }
      });
      
      setDragStart(snapped);
    } else if (isPanning) {
      // Pan the canvas
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      
      onCanvasUpdate({});
      setPanStart({ x: e.clientX, y: e.clientY });
    }
    
    onEvent({
      type: 'mousemove',
      x: snapped.x,
      y: snapped.y,
      modifiers: {
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
      },
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };

  // Render canvas on changes
  useEffect(() => {
    render();
  }, [render]);

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden bg-gray-100 border border-gray-300"
      style={{ cursor: isPanning ? 'grabbing' : isDragging ? 'move' : 'default' }}
    >
      <canvas
        ref={canvasRef}
        width={canvasData.width}
        height={canvasData.height}
        className="absolute top-0 left-0"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {/* Canvas info overlay */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
        {canvasData.width} × {canvasData.height} • Zoom: {Math.round(zoom * 100)}%
      </div>
    </div>
  );
};

// Export as TemplateCanvas to match the expected interface
export const TemplateCanvas = TemplateCanvasComponent;
