import React, { useState, useEffect } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';

interface DiagramRendererProps {
  diagramJson: any;
  width?: number;
  height?: number;
  viewModeEnabled?: boolean;
  className?: string;
}

export function DiagramRenderer({
  diagramJson,
  width = 600,
  height = 400,
  viewModeEnabled = true,
  className = ''
}: DiagramRendererProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [parsedElements, setParsedElements] = useState<any[]>([]);

  useEffect(() => {
    if (diagramJson) {
      try {
        const elements = typeof diagramJson === 'string'
          ? JSON.parse(diagramJson)
          : diagramJson;

        setParsedElements(Array.isArray(elements) ? elements : []);
      } catch (error) {
        console.error('Error parsing diagram JSON:', error);
        setParsedElements([]);
      }
    }
  }, [diagramJson]);

  useEffect(() => {
    if (excalidrawAPI && parsedElements.length > 0) {
      excalidrawAPI.updateScene({
        elements: parsedElements,
        appState: {
          viewBackgroundColor: '#ffffff',
          currentItemStrokeColor: '#000000',
          currentItemBackgroundColor: 'transparent',
        }
      });
    }
  }, [excalidrawAPI, parsedElements]);

  if (!diagramJson || parsedElements.length === 0) {
    return null;
  }

  return (
    <div
      className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={{
          elements: parsedElements,
          appState: {
            viewBackgroundColor: '#ffffff',
            zenModeEnabled: false,
            gridSize: null,
          },
          scrollToContent: true,
        }}
        viewModeEnabled={viewModeEnabled}
        zenModeEnabled={false}
        gridModeEnabled={false}
      />
    </div>
  );
}

export function CompactDiagramRenderer({
  diagramJson,
  width = 300,
  height = 200,
  className = ''
}: DiagramRendererProps) {
  return (
    <DiagramRenderer
      diagramJson={diagramJson}
      width={width}
      height={height}
      viewModeEnabled={true}
      className={className}
    />
  );
}
