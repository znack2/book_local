import React, { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import canvasDataImport from '../data/canvasData.json';

interface BusinessCanvasProps {
  isEditable?: boolean;
  canvasId?: string;
  buttonsOnly?: boolean;
  hideButtons?: boolean;
}

interface CanvasSection {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  items?: string[];
  keyPoints?: string[];
  placeholder?: string; // We'll generate this from subtitle
}

interface CanvasData {
  title?: string;
  description?: string;
  sections: CanvasSection[];
}

const BusinessCanvas = ({ 
  isEditable = false, 
  canvasId = "1", 
  buttonsOnly = false, 
  hideButtons = false
}: BusinessCanvasProps) => {
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Transform the new JSON structure to work with the existing canvas layout
  const processedCanvasData = useMemo(() => {
    if (!canvasDataImport) {
      console.error('Canvas data import is null or undefined');
      return null;
    }

    // Check if it has sections array
    if (!canvasDataImport.sections || !Array.isArray(canvasDataImport.sections)) {
      console.error('Invalid canvas data structure - missing sections array');
      console.error('Available properties:', Object.keys(canvasDataImport));
      return null;
    }
    
    // Validate each section has required properties
    const invalidSection = canvasDataImport.sections.find((section: any) => 
      !section.id || !section.title
    );
    
    if (invalidSection) {
      console.error('Invalid section structure - missing id or title', invalidSection);
      return null;
    }

    // Transform sections to fields format for the table layout
    const transformedFields = canvasDataImport.sections.map((section: CanvasSection) => ({
      key: section.id,
      label: section.title,
      placeholder: section.subtitle || `Enter ${section.title.toLowerCase()} information`,
      highlight: section.id === 'value-proposition' || section.id === 'propositions', // Highlight value proposition
      originalSection: section // Keep original data for reference
    }));

    return {
      ...canvasDataImport,
      fields: transformedFields
    } as CanvasData & { fields: any[] };
  }, []); // Empty dependency array since imported data never changes

  // Get current canvas fields from processed data
  const canvasFields = processedCanvasData?.fields || [];

  const handleCellInput = (fieldKey: string, content: string) => {
    if (isEditable && canvasId !== "gallery") {
      localStorage.setItem(`canvas-${canvasId}-${fieldKey}`, content);
    }
  };

const getCellContent = (fieldKey: string) => {
  if (canvasId === "gallery") {
    // For gallery view, combine content from all available canvas IDs with chapter links
    // Get all available canvas IDs dynamically from localStorage
    const allCanvasIds = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('canvas-') && key.includes(`-${fieldKey}`)) {
        const canvasIdMatch = key.match(/^canvas-(\w+)-/);
        if (canvasIdMatch && canvasIdMatch[1] !== 'gallery') {
          allCanvasIds.push(canvasIdMatch[1]);
        }
      }
    }
    // Remove duplicates and sort
    const uniqueCanvasIds = [...new Set(allCanvasIds)].sort();
    
    // If no canvas IDs found in localStorage, show just the items as placeholder
    if (uniqueCanvasIds.length === 0) {
      const field = canvasFields.find(f => f.key === fieldKey);
      if (field?.originalSection?.items && field.originalSection.items.length > 0) {
        const placeholderContent = field.originalSection.items.map(item => 
          `<div style="color: #9ca3af; font-size: 10px; margin-bottom: 4px;">• ${item}</div>`
        ).join('');
        return placeholderContent;
      }
      return 'No items available';
    }
    
    const combinedContent = uniqueCanvasIds
      .map(id => {
        // Generate different colors for each chapter
        const chapterColors = {
          '1': { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: '#dc2626' },
          '2': { border: '#f97316', bg: 'rgba(249, 115, 22, 0.1)', icon: '#ea580c' },
          '3': { border: '#eab308', bg: 'rgba(234, 179, 8, 0.1)', icon: '#ca8a04' },
          '4': { border: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', icon: '#16a34a' },
          '5': { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', icon: '#2563eb' },
          '6': { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', icon: '#7c3aed' },
          '7': { border: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)', icon: '#db2777' },
          '8': { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', icon: '#0891b2' },
          '9': { border: '#84cc16', bg: 'rgba(132, 204, 22, 0.1)', icon: '#65a30d' },
          '10': { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: '#d97706' },
          '11': { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: '#b91c1c' },
          '12': { border: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: '#059669' },
          '13': { border: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)', icon: '#4f46e5' },
          '14': { border: '#f472b6', bg: 'rgba(244, 114, 182, 0.1)', icon: '#e879f9' },
          '15': { border: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)', icon: '#0d9488' },
          '16': { border: '#fb7185', bg: 'rgba(251, 113, 133, 0.1)', icon: '#f43f5e' },
          '17': { border: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', icon: '#9333ea' },
          '18': { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', icon: '#0e7490' },
          '19': { border: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)', icon: '#991b1b' },
          '20': { border: '#059669', bg: 'rgba(5, 150, 105, 0.1)', icon: '#047857' },
          '21': { border: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)', icon: '#6d28d9' },
          '22': { border: '#db2777', bg: 'rgba(219, 39, 119, 0.1)', icon: '#be185d' },
          '23': { border: '#2563eb', bg: 'rgba(37, 99, 235, 0.1)', icon: '#1d4ed8' },
          '24': { border: '#ea580c', bg: 'rgba(234, 88, 12, 0.1)', icon: '#c2410c' },
          '25': { border: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)', icon: '#15803d' },
          '26': { border: '#9333ea', bg: 'rgba(147, 51, 234, 0.1)', icon: '#7e22ce' },
          '27': { border: '#e11d48', bg: 'rgba(225, 29, 72, 0.1)', icon: '#be123c' },
          '28': { border: '#0891b2', bg: 'rgba(8, 145, 178, 0.1)', icon: '#0e7490' },
          '29': { border: '#ca8a04', bg: 'rgba(202, 138, 4, 0.1)', icon: '#a16207' },
          '30': { border: '#4f46e5', bg: 'rgba(79, 70, 229, 0.1)', icon: '#4338ca' },
          '31': { border: '#be123c', bg: 'rgba(190, 18, 60, 0.1)', icon: '#9f1239' },
          '32': { border: '#0d9488', bg: 'rgba(13, 148, 136, 0.1)', icon: '#0f766e' },
          '33': { border: '#7e22ce', bg: 'rgba(126, 34, 206, 0.1)', icon: '#6b21a8' },
          '34': { border: '#dc2626', bg: 'rgba(220, 38, 38, 0.15)', icon: '#7f1d1d' },
          '35': { border: '#0369a1', bg: 'rgba(3, 105, 161, 0.1)', icon: '#075985' },
          '36': { border: '#b45309', bg: 'rgba(180, 83, 9, 0.1)', icon: '#92400e' },
          '37': { border: '#166534', bg: 'rgba(22, 101, 52, 0.1)', icon: '#14532d' },
          '38': { border: '#581c87', bg: 'rgba(88, 28, 135, 0.1)', icon: '#4c1d95' },
          '39': { border: '#be185d', bg: 'rgba(190, 24, 93, 0.1)', icon: '#9d174d' },
          '40': { border: '#155e75', bg: 'rgba(21, 94, 117, 0.1)', icon: '#164e63' },
          '41': { border: '#a16207', bg: 'rgba(161, 98, 7, 0.1)', icon: '#854d0e' },
          '42': { border: '#3730a3', bg: 'rgba(55, 48, 163, 0.1)', icon: '#312e81' },
          '43': { border: '#9f1239', bg: 'rgba(159, 18, 57, 0.1)', icon: '#881337' },
          '44': { border: '#0f766e', bg: 'rgba(15, 118, 110, 0.1)', icon: '#134e4a' },
          '45': { border: '#6b21a8', bg: 'rgba(107, 33, 168, 0.1)', icon: '#59338d' },
          '46': { border: '#7f1d1d', bg: 'rgba(127, 29, 29, 0.1)', icon: '#450a0a' },
          '47': { border: '#075985', bg: 'rgba(7, 89, 133, 0.1)', icon: '#0c4a6e' },
          '48': { border: '#92400e', bg: 'rgba(146, 64, 14, 0.1)', icon: '#78350f' },
        };
        
        const colors = chapterColors[id] || { border: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)', icon: '#4b5563' };
        
        const userContent = localStorage.getItem(`canvas-${id}-${fieldKey}`);
        if (userContent) {
          const isLongContent = userContent.length > 72;
          const previewContent = isLongContent ? userContent.substring(0, 72) + '...' : userContent;
          const contentId = `content-${id}-${fieldKey}`;
          
          return `<div style="margin-bottom: 6px; padding: 6px; background: ${colors.bg}; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <div style="display: flex; align-items: center; gap: 10px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${colors.icon}" stroke-width="2" style="flex-shrink: 0;">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                <path d="M8 7h8M8 11h6"/>
              </svg>
              <button onclick="navigate('/canvas?item=${id}')" style="
                background: ${colors.border}; 
                color: white; 
                border: none; 
                border-radius: 4px; 
                padding: 4px 8px; 
                cursor: pointer; 
                font-size: 10px; 
                font-weight: 500;
                transition: all 0.2s ease;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
              " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 1px 2px rgba(0,0,0,0.1)'">
                Chapter ${id}
              </button>
            
            <strong style="color: ${colors.icon}; font-size: 12px;">  
              <div style="color: #374151; font-size: 11px; line-height: 1.4;">
                <div id="${contentId}-preview" style="display: ${isLongContent ? 'block' : 'none'};">
                  ${previewContent}
                  <button onclick="
                    document.getElementById('${contentId}-preview').style.display='none'; 
                    document.getElementById('${contentId}-full').style.display='block';
                  " style="
                    background: none; 
                    border: none; 
                    color: ${colors.border}; 
                    cursor: pointer; 
                    font-size: 10px; 
                    text-decoration: underline;
                    margin-left: 5px;
                    padding: 0;
                  ">Show more</button>
                </div>
                <div id="${contentId}-full" style="display: ${isLongContent ? 'none' : 'block'};">
                  ${userContent}
                  ${isLongContent ? `<button onclick="
                    document.getElementById('${contentId}-preview').style.display='block'; 
                    document.getElementById('${contentId}-full').style.display='none';
                  " style="
                    background: none; 
                    border: none; 
                    color: ${colors.border}; 
                    cursor: pointer; 
                    font-size: 10px; 
                    text-decoration: underline;
                    margin-left: 5px;
                    margin-top: 5px;
                    padding: 0;
                    display: block;
                  ">Show less</button>` : ''}
                </div>
              </div>
            </strong>
            </div>
          </div>`;
        }
        
        // If no user content, show placeholder from items
        const field = canvasFields.find(f => f.key === fieldKey);
        if (field?.originalSection?.items && field.originalSection.items.length > 0) {
          const placeholderContent = field.originalSection.items.map(item => 
            `<div style="color: #9ca3af; font-size: 10px; margin-bottom: 4px; padding-left: 8px;">• ${item}</div>`
          ).join('');
          
          return `<div style="margin-bottom: 16px; padding: 12px; background: ${colors.bg}; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); opacity: 0.8;">
            <div style="display: flex; align-items: center; gap: 10px; ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${colors.icon}" stroke-width="2" style="flex-shrink: 0; opacity: 0.6;">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                <path d="M8 7h8M8 11h6"/>
                <circle cx="12" cy="16" r="1"/>
              </svg>
              <strong style="color: ${colors.icon}; font-size: 12px; opacity: 0.8;">Chapter ${id}</strong>
              <span style="color: #6b7280; font-size: 9px; font-style: italic;">(placeholder)</span>
              <button onclick="navigate('/canvas?item=${id}')" style="
                background: ${colors.border}; 
                color: white; 
                border: none; 
                border-radius: 4px; 
                padding: 4px 8px; 
                cursor: pointer; 
                font-size: 10px; 
                font-weight: 500;
                transition: all 0.2s ease;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                opacity: 0.8;
              " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.2)'; this.style.opacity='1'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 1px 2px rgba(0,0,0,0.1)'; this.style.opacity='0.8'">
                Edit
              </button>
            </div>
            <div style="color: #6b7280; font-size: 9px; font-style: italic; margin-bottom: 6px;">Example content:</div>
            ${placeholderContent}
          </div>`;
        }
        
        return null;
      })
      .filter(Boolean)
      .join('');
    
    return combinedContent;
  } else {
    // Check if user has entered custom content
    const userContent = localStorage.getItem(`canvas-${canvasId}-${fieldKey}`);
    if (userContent) {
      return userContent;
    }
    
    // If no user content, show the items from the JSON as placeholder content
    const field = canvasFields.find(f => f.key === fieldKey);
    if (field?.originalSection?.items && field.originalSection.items.length > 0) {
      const placeholderContent = field.originalSection.items.map(item => 
        `<div style="color: #9ca3af; font-size: 10px; margin-bottom: 4px;">• ${item}</div>`
      ).join('');
      
      return placeholderContent;
    }
    
    // Always return something to prevent fallback to field.placeholder
    return '<div style="color: #9ca3af; font-style: italic;">No items available</div>';
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

  // Error state - don't render anything if there's an error
  if (!processedCanvasData || canvasFields.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Canvas Data Error</h3>
          <p className="text-red-600 text-sm mb-3">
            Invalid or missing canvas data. Please check that the imported JSON contains valid canvas sections.
          </p>
          <p className="text-red-600 text-xs">
            Required structure: {`{ "sections": [{ "id": "...", "title": "...", "subtitle": "..." }] }`}
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  // if (loading) {
  //   return (
  //     <div className="h-full flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
  //       <span className="ml-2 text-gray-600">Loading canvas...</span>
  //     </div>
  //   );
  // }

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
    <div className="h-full flex flex-col relative" style={{
      boxShadow: '5px 5px #b8b8b8, 9px 9px #9e9e9e, 11px 11px #7f7f7f'
    }}>
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
          }}>
            {processedCanvasData?.title || 'Canvas'}
          </div>
          
          {/* Navigation buttons in browser header near search */}
          {!hideButtons && (
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
          )}
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
                  }}>
                    {field.label}
                    {field.originalSection?.subtitle && (
                      <div style={{
                        fontSize: '9px',
                        fontWeight: '400',
                        marginTop: '4px',
                        opacity: '0.8'
                      }}>
                        {field.originalSection.subtitle}
                      </div>
                    )}
                  </th>
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
                      onFocus={(e) => {
                        // Clear placeholder content when user starts typing
                        if (canvasId !== "gallery" && !localStorage.getItem(`canvas-${canvasId}-${field.key}`)) {
                          e.currentTarget.innerHTML = '';
                        }
                      }}
                      onBlur={(e) => {
                        // Restore placeholder if empty
                        if (canvasId !== "gallery" && !e.currentTarget.textContent?.trim()) {
                          const content = getCellContent(field.key);
                          e.currentTarget.innerHTML = content || `<span style="color: #a69885; font-style: italic;">${field.placeholder}</span>`;
                        }
                      }}
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