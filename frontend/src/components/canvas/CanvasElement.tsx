import React, { useRef, useEffect, useCallback } from 'react';
import { CanvasElement } from '../../types/canvas';
import { useCanvas } from '../../contexts/CanvasContext';
import { ProfessionalIcons } from '../ui/IconSystem';

interface CanvasElementComponentProps {
  element: CanvasElement;
  isSelected: boolean;
  snapToGrid: (value: number) => number;
}

const CanvasElementComponent: React.FC<CanvasElementComponentProps> = ({
  element,
  isSelected,
  snapToGrid,
}) => {
  const {
    dispatch,
    dragState,
    resizeState,
    setDragState,
    setResizeState,
  } = useCanvas();

  const elementRef = useRef<HTMLDivElement>(null);
  const resizeHandlesRef = useRef<HTMLDivElement>(null);

  // Handle element selection
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Handle multi-select with Ctrl/Cmd
    if (e.ctrlKey || e.metaKey) {
      const currentSelection = dragState.elementId ? [dragState.elementId] : [];
      const newSelection = isSelected
        ? currentSelection.filter(id => id !== element.id)
        : [...currentSelection, element.id];
      dispatch({ type: 'SELECT_ELEMENTS', ids: newSelection });
    } else {
      dispatch({ type: 'SELECT_ELEMENTS', ids: [element.id] });
    }

    // Start dragging
    const rect = elementRef.current?.getBoundingClientRect();
    if (rect) {
      setDragState({
        isDragging: true,
        elementId: element.id,
        startX: e.clientX,
        startY: e.clientY,
        originalX: element.x,
        originalY: element.y,
      });
    }
  }, [element.id, element.x, element.y, isSelected, dragState.elementId, dispatch, setDragState]);

  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    setResizeState({
      isResizing: true,
      elementId: element.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      originalWidth: element.width,
      originalHeight: element.height,
      originalX: element.x,
      originalY: element.y,
    });
  }, [element.id, element.width, element.height, element.x, element.y, setResizeState]);

  // Render element content based on type
  const renderElementContent = () => {
    const baseStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      backgroundColor: element.style.backgroundColor,
      color: element.style.color,
      fontSize: element.style.fontSize,
      fontWeight: element.style.fontWeight,
      fontFamily: element.style.fontFamily,
      textAlign: element.style.textAlign,
      border: element.style.border,
      borderRadius: element.style.borderRadius,
      opacity: element.style.opacity,
      padding: element.style.padding,
      margin: element.style.margin,
      pointerEvents: element.locked ? 'none' : 'auto',
      cursor: element.locked ? 'not-allowed' : 'move',
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            style={baseStyle}
            contentEditable={!element.locked}
            suppressContentEditableWarning
            onBlur={(e) => {
              dispatch({
                type: 'UPDATE_ELEMENT',
                id: element.id,
                updates: { content: e.currentTarget.textContent || '' },
              });
            }}
          >
            {element.content || element.placeholder || 'Click to edit text'}
          </div>
        );

      case 'heading':
        const HeadingTag = `h${element.level}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            style={baseStyle}
            contentEditable={!element.locked}
            suppressContentEditableWarning
            onBlur={(e) => {
              dispatch({
                type: 'UPDATE_ELEMENT',
                id: element.id,
                updates: { content: e.currentTarget.textContent || '' },
              });
            }}
          >
            {element.content || `Heading ${element.level}`}
          </HeadingTag>
        );

      case 'section':
        return (
          <div style={baseStyle}>
            <h3 style={{ margin: 0, marginBottom: element.style.padding || 8 }}>
              {element.title || 'Section Title'}
            </h3>
            <div style={{ marginTop: 8 }}>
              {/* Render section elements here */}
              <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                Section elements will be rendered here
              </span>
            </div>
          </div>
        );

      case 'icon':
        const IconComponent = (ProfessionalIcons as any)[`${element.iconName}Icon`];
        return (
          <div
            style={{
              ...baseStyle,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {IconComponent ? (
              <IconComponent size={element.size} color={element.color} />
            ) : (
              <div
                style={{
                  width: element.size,
                  height: element.size,
                  backgroundColor: element.color,
                  borderRadius: '50%',
                }}
              />
            )}
          </div>
        );

      case 'shape':
        const shapeStyle = {
          width: '100%',
          height: '100%',
          backgroundColor: element.fill,
          border: element.stroke ? `${element.strokeWidth}px solid ${element.stroke}` : undefined,
        };

        switch (element.shapeType) {
          case 'circle':
            return <div style={{ ...shapeStyle, borderRadius: '50%' }} />;
          case 'triangle':
            return (
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: `${element.width / 2}px solid transparent`,
                  borderRight: `${element.width / 2}px solid transparent`,
                  borderBottom: `${element.height}px solid ${element.fill}`,
                }}
              />
            );
          case 'line':
            return (
              <div
                style={{
                  width: '100%',
                  height: element.strokeWidth || 2,
                  backgroundColor: element.stroke,
                }}
              />
            );
          default:
            return <div style={shapeStyle} />;
        }

      default:
        return <div style={baseStyle}>Unknown element type</div>;
    }
  };

  // Render resize handles
  const renderResizeHandles = () => {
    if (!isSelected || element.locked) return null;

    const handles = [
      { position: 'top-left', cursor: 'nw-resize' },
      { position: 'top-right', cursor: 'ne-resize' },
      { position: 'bottom-left', cursor: 'sw-resize' },
      { position: 'bottom-right', cursor: 'se-resize' },
      { position: 'top', cursor: 'n-resize' },
      { position: 'right', cursor: 'e-resize' },
      { position: 'bottom', cursor: 's-resize' },
      { position: 'left', cursor: 'w-resize' },
    ];

    return (
      <div
        ref={resizeHandlesRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          border: isSelected ? '2px solid #3b82f6' : 'none',
        }}
      >
        {handles.map(({ position, cursor }) => (
          <div
            key={position}
            className="absolute w-3 h-3 bg-white border-2 border-blue-500 pointer-events-auto"
            style={{
              cursor,
              ...(position === 'top-left' && { top: -6, left: -6 }),
              ...(position === 'top-right' && { top: -6, right: -6 }),
              ...(position === 'bottom-left' && { bottom: -6, left: -6 }),
              ...(position === 'bottom-right' && { bottom: -6, right: -6 }),
              ...(position === 'top' && { top: -6, left: '50%', transform: 'translateX(-50%)' }),
              ...(position === 'right' && { right: -6, top: '50%', transform: 'translateY(-50%)' }),
              ...(position === 'bottom' && { bottom: -6, left: '50%', transform: 'translateX(-50%)' }),
              ...(position === 'left' && { left: -6, top: '50%', transform: 'translateY(-50%)' }),
            }}
            onMouseDown={(e) => handleResizeStart(e, position)}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      ref={elementRef}
      className={`absolute ${isSelected ? 'z-10' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
        transformOrigin: 'center',
        visibility: element.visible ? 'visible' : 'hidden',
      }}
      onMouseDown={handleMouseDown}
    >
      {renderElementContent()}
      {renderResizeHandles()}
    </div>
  );
};

export default CanvasElementComponent;
