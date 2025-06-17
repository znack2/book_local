
import React, { useState } from 'react';
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BusinessCanvasProps {
  isEditable?: boolean;
  canvasId?: string;
  buttonsOnly?: boolean;
  hideButtons?: boolean;
}

const BusinessCanvas = ({ 
  isEditable = false, 
  canvasId = "1", 
  buttonsOnly = false, 
  hideButtons = false 
}: BusinessCanvasProps) => {
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const navigate = useNavigate();

  const canvasFields = [
    { key: 'partners', label: 'Key Partners', placeholder: 'Strategic alliances, suppliers, joint ventures' },
    { key: 'activities', label: 'Key Activities', placeholder: 'Production, problem solving, platform maintenance' },
    { key: 'resources', label: 'Key Resources', placeholder: 'Physical, intellectual, human, financial assets' },
    { key: 'propositions', label: 'Value Propositions', placeholder: 'Unique value delivered to customers', highlight: true },
    { key: 'relationships', label: 'Customer Relationships', placeholder: 'Personal assistance, self-service, communities' },
    { key: 'channels', label: 'Channels', placeholder: 'Web, mobile, retail, partners, direct sales' },
    { key: 'segments', label: 'Customer Segments', placeholder: 'Mass market, niche, segmented, multi-sided' },
    { key: 'costs', label: 'Cost Structure', placeholder: 'Fixed costs, variable costs, economies of scale' },
    { key: 'revenue', label: 'Revenue Streams', placeholder: 'Asset sale, usage fee, subscription, licensing' }
  ];

  const handleCellInput = (fieldKey: string, content: string) => {
    if (isEditable && canvasId !== "gallery") {
      localStorage.setItem(`canvas-${canvasId}-${fieldKey}`, content);
    }
  };

  const getCellContent = (fieldKey: string) => {
    if (canvasId === "gallery") {
      // For gallery view, combine content from all available canvas IDs with chapter links
      const allCanvasIds = ['1', '2', '3', '4', '5', '6'];
      const combinedContent = allCanvasIds
        .map(id => {
          const content = localStorage.getItem(`canvas-${id}-${fieldKey}`);
          return content ? `<div style="margin-bottom: 10px; padding: 8px; border-left: 3px solid #d97706; background: rgba(217, 119, 6, 0.1);"><div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;"><strong>Chapter ${id}:</strong> <button onclick="window.location.href='/canvas?item=${id}'" style="color: #3b82f6; background: none; border: none; cursor: pointer; padding: 2px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 17 10-10M17 7H7v10"/></svg></button></div>${content}</div>` : null;
        })
        .filter(Boolean)
        .join('');
      
      return combinedContent || '';
    } else {
      return localStorage.getItem(`canvas-${canvasId}-${fieldKey}`) || '';
    }
  };

  const navigateToField = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      setCurrentFieldIndex(prev => prev > 0 ? prev - 1 : canvasFields.length - 1);
    } else {
      setCurrentFieldIndex(prev => prev < canvasFields.length - 1 ? prev + 1 : 0);
    }
    
    // Scroll to the highlighted field
    setTimeout(() => {
      const fieldElement = document.getElementById(`field-${canvasFields[currentFieldIndex].key}`);
      if (fieldElement) {
        fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleChapterLinkClick = (chapterId: string) => {
    navigate(`/canvas?item=${chapterId}`);
  };

  // If buttonsOnly is true, only render the navigation buttons
  if (buttonsOnly) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => navigateToField('up')}
          className="bg-white/90 hover:bg-white border border-amber-200 rounded-full p-2 shadow-md transition-all duration-200 hover:shadow-lg"
        >
          <ArrowUp size={16} className="text-amber-700" />
        </button>
        <button
          onClick={() => navigateToField('down')}
          className="bg-white/90 hover:bg-white border border-amber-200 rounded-full p-2 shadow-md transition-all duration-200 hover:shadow-lg"
        >
          <ArrowDown size={16} className="text-amber-700" />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      <div className="browser-window h-full flex flex-col" style={{
        background: '#ffffff',
        borderRadius: '0',
        boxShadow: 'none',
        overflow: 'hidden',
        margin: '0'
      }}>
        <div className="browser-header" style={{
          background: '#f5f5f5',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid #e0e0e0',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', gap: '5px', marginRight: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f57' }}></div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }}></div>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#28ca42' }}></div>
          </div>
          <div style={{
            background: '#ffffff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            color: '#666',
            flex: 1,
            border: '1px solid #e0e0e0',
            marginRight: '10px'
          }}>canvas.studio/business-model</div>
          
          {/* Navigation buttons in browser header near search */}
          <div className="flex gap-2">
            <button
              onClick={() => navigateToField('up')}
              className="bg-white/90 hover:bg-white border border-amber-200 rounded-full p-1 shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <ArrowUp size={12} className="text-amber-700" />
            </button>
            <button
              onClick={() => navigateToField('down')}
              className="bg-white/90 hover:bg-white border border-amber-200 rounded-full p-1 shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <ArrowDown size={12} className="text-amber-700" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto" style={{ background: '#ffffff' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#ffffff',
            fontSize: '12px'
          }}>
            <tbody>
              {canvasFields.map((field, index) => (
                <tr key={field.key} id={`field-${field.key}`}>
                  <th style={{
                    background: currentFieldIndex === index 
                      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                      : 'linear-gradient(135deg, #d4c4a8 0%, #c4b59b 100%)',
                    color: currentFieldIndex === index ? '#ffffff' : '#5a4f3f',
                    padding: '12px 15px',
                    fontWeight: '600',
                    fontSize: '11px',
                    textAlign: 'left',
                    border: '1px solid #c4b59b',
                    width: '30%',
                    verticalAlign: 'top',
                    transition: 'all 0.3s ease'
                  }}>{field.label}</th>
                  <td style={{ 
                    border: '1px solid #e0e0e0', 
                    padding: '12px 15px', 
                    verticalAlign: 'top', 
                    height: '120px',
                    background: field.highlight ? 'rgba(212, 196, 168, 0.1)' : 'transparent'
                  }}>
                    <div 
                      contentEditable={isEditable && canvasId !== "gallery"}
                      suppressContentEditableWarning={true}
                      onInput={(e) => handleCellInput(field.key, e.currentTarget.textContent || '')}
                      style={{
                        fontSize: '11px',
                        lineHeight: '1.4',
                        color: '#5a4f3f',
                        outline: 'none',
                        cursor: (isEditable && canvasId !== "gallery") ? 'text' : 'default',
                        height: '96px',
                        width: '100%',
                        overflowY: 'auto',
                        padding: '4px',
                        border: '1px solid transparent',
                        borderRadius: '4px'
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: getCellContent(field.key) || `<span style="color: #a69885; font-style: italic;">${field.placeholder}</span>`
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusinessCanvas;
