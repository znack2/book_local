import React, { useState, useEffect } from 'react';
import { X, Save, Check } from 'lucide-react';

interface TextSelectionModalProps {
  canvasId: string;
  canvasFields: Array<{
    key: string;
    label: string;
    placeholder?: string;
    originalSection?: {
      subtitle?: string;
    };
  }>;
  onCanvasUpdate?: () => void;
  onFirstSave?: () => void; // New prop to handle first save
}

const TextSelectionModal: React.FC<TextSelectionModalProps> = ({ 
  canvasId, 
  canvasFields, 
  onCanvasUpdate,
  onFirstSave 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [selectedColumn, setSelectedColumn] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Auto-demo functionality - trigger on every page load
  useEffect(() => {
    // Always show demo on page load (removed localStorage check)
    // Wait for page to load and find first text content
    const timer = setTimeout(() => {
      const firstTextElement = findFirstTextElement();
      if (firstTextElement) {
        selectFirstTwoWords(firstTextElement);
      }
    }, 1500); // Wait 1.5 seconds for page to fully load

    return () => clearTimeout(timer);
  }, []);

  const findFirstTextElement = (): Element | null => {
    // Look for text in email content first, then other content
    const selectors = [
      '.text-sm.text-gray-800 p', // Email content
      '.text-black-800', // Other text content
      'p', // Any paragraph
      '.leading-relaxed', // Formatted text
      'div[style*="color"]' // Styled text divs
    ];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent?.trim();
        if (text && text.length > 20 && !element.closest('.text-selection-modal')) {
          return element;
        }
      }
    }
    
    return null;
  };

  const selectFirstTwoWords = (element: Element) => {
    const text = element.textContent || '';
    const words = text.trim().split(/\s+/);
    
    if (words.length >= 2) {
      const firstTwoWords = words.slice(0, 2).join(' ');
      
      // Create a range to select the first two words
      const range = document.createRange();
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let textNode = walker.nextNode();
      if (textNode) {
        const nodeText = textNode.textContent || '';
        const endIndex = nodeText.indexOf(words[1]) + words[1].length;
        
        if (endIndex > 0) {
          range.setStart(textNode, 0);
          range.setEnd(textNode, endIndex);
          
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
          
          // Show modal with demo mode
          const rect = range.getBoundingClientRect();
          const modalX = Math.min(Math.max(rect.left + window.scrollX, 10), window.innerWidth - 350);
          const modalY = Math.min(rect.bottom + window.scrollY + 10, window.innerHeight - 200);
          
          setSelectedText(firstTwoWords);
          setModalPosition({ x: modalX, y: modalY });
          setIsVisible(true);
          setIsDemoMode(true);
          setSelectedColumn(''); // Reset column selection
          setSaveSuccess(false);
          
          // Removed localStorage demo tracking since we want it every time
        }
      }
    }
  };

  useEffect(() => {
    let selectionTimeout: NodeJS.Timeout;

    const handleTextSelection = () => {
      // Skip if we're in demo mode
      if (isDemoMode) return;
      
      // Clear any existing timeout
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
      }

      // Delay to ensure selection is complete
      selectionTimeout = setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
          const text = selection.toString().trim();
          
          // Only show modal for text longer than 3 characters to avoid accidental selections
          if (text.length > 3) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            // Position modal near the selection but ensure it's visible
            const modalX = Math.min(Math.max(rect.left + window.scrollX, 10), window.innerWidth - 350);
            const modalY = Math.min(rect.bottom + window.scrollY + 10, window.innerHeight - 200);
            
            setSelectedText(text);
            setModalPosition({ x: modalX, y: modalY });
            setIsVisible(true);
            setIsDemoMode(false);
            setSelectedColumn(''); // Reset column selection
            setSaveSuccess(false);
          }
        }
      }, 100);
    };

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Element;
      // Don't close if clicking inside the modal
      if (!target.closest('.text-selection-modal')) {
        setIsVisible(false);
        setIsDemoMode(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
        setIsDemoMode(false);
      }
    };

    // Use mouseup for text selection detection
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
      }
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDemoMode]);

  const handleSave = async () => {
    if (!selectedColumn || !selectedText.trim()) return;

    setIsSaving(true);
    
    try {
      // Get existing content for the selected column
      const existingContent = localStorage.getItem(`canvas-${canvasId}-${selectedColumn}`) || '';
      
      // Append new text to existing content
      const newContent = existingContent 
        ? `${existingContent}\n• ${selectedText}`
        : `• ${selectedText}`;
      
      // Save to localStorage
      localStorage.setItem(`canvas-${canvasId}-${selectedColumn}`, newContent);
      
      // Trigger canvas update if callback provided
      if (onCanvasUpdate) {
        onCanvasUpdate();
      }

      // Always trigger onFirstSave to show canvas after any save
      if (onFirstSave) {
        onFirstSave();
      }
      
      // Also dispatch a custom event for components that might be listening
      window.dispatchEvent(new CustomEvent('canvasDataUpdated', {
        detail: { canvasId, fieldKey: selectedColumn, newContent }
      }));
      
      // Show success state
      setSaveSuccess(true);
      
      // Close modal after short delay
      setTimeout(() => {
        setIsVisible(false);
        setIsSaving(false);
        setSaveSuccess(false);
        setIsDemoMode(false);
        
        // Clear text selection
        window.getSelection()?.removeAllRanges();
      }, 1500);
      
    } catch (error) {
      console.error('Error saving text:', error);
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setIsDemoMode(false);
    window.getSelection()?.removeAllRanges();
  };

  if (!isVisible) return null;

  return (
    <div 
      className="text-selection-modal"
      style={{
        position: 'fixed',
        left: `${modalPosition.x}px`,
        top: `${modalPosition.y}px`,
        zIndex: 999999,
        maxWidth: '340px',
        minWidth: '300px'
      }}
    >
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
        border: isDemoMode ? '2px solid #10b981' : '1px solid #e5e7eb',
        overflow: 'hidden',
        animation: isDemoMode ? 'pulse 2s ease-in-out infinite' : 'none'
      }}>
        {/* Header */}
        <div style={{
          background: isDemoMode 
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
            {isDemoMode ? '✨ Try saving text to canvas!' : 'Save to Canvas'}
          </h3>
          <div
            onMouseDown={handleClose}
            style={{
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={16} />
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Demo instruction */}
          {isDemoMode && (
            <div style={{
              background: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: '6px',
              padding: '10px',
              marginBottom: '12px',
              fontSize: '11px',
              color: '#065f46'
            }}>
              <strong>👋 Welcome!</strong> We've selected some text for you. 
              Choose a canvas section below and click save to see how it works!
            </div>
          )}

          {/* Selected Text Preview */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '12px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '6px' 
            }}>
              Selected Text:
            </label>
            <div style={{
              background: isDemoMode ? '#ecfdf5' : '#fef3c7',
              border: `1px solid ${isDemoMode ? '#10b981' : '#f59e0b'}`,
              borderRadius: '6px',
              padding: '10px',
              maxHeight: '80px',
              overflowY: 'auto',
              fontSize: '12px',
              lineHeight: '1.4',
              color: isDemoMode ? '#065f46' : '#92400e'
            }}>
              "{selectedText}"
            </div>
          </div>

          {/* Column Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '12px', 
              fontWeight: '500', 
              color: '#374151', 
              marginBottom: '6px' 
            }}>
              Save to Canvas Column:
            </label>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              style={{
                width: '100%',
                fontSize: '12px',
                border: `1px solid ${isDemoMode ? '#10b981' : '#d1d5db'}`,
                borderRadius: '6px',
                padding: '8px 10px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = isDemoMode ? '#10b981' : '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = isDemoMode ? '#10b981' : '#d1d5db'}
            >
              <option value="">Choose a section...</option>
              {canvasFields.map((field) => (
                <option key={field.key} value={field.key}>
                  {field.label}
                  {field.originalSection?.subtitle && ` - ${field.originalSection.subtitle}`}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div
              onMouseDown={handleClose}
              style={{
                flex: 1,
                fontSize: '12px',
                padding: '10px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                color: '#374151',
                backgroundColor: 'white',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'background-color 0.2s',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Cancel
            </div>
            <div
              onMouseDown={handleSave}
              style={{
                flex: 1,
                fontSize: '12px',
                padding: '10px 16px',
                borderRadius: '6px',
                textAlign: 'center',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                userSelect: 'none',
                cursor: selectedColumn && selectedText.trim() && !isSaving ? 'pointer' : 'not-allowed',
                ...(saveSuccess ? {
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: '1px solid #10b981'
                } : selectedColumn && selectedText.trim() && !isSaving ? {
                  backgroundColor: isDemoMode ? '#10b981' : '#f59e0b',
                  color: 'white',
                  border: `1px solid ${isDemoMode ? '#10b981' : '#f59e0b'}`
                } : {
                  backgroundColor: '#f3f4f6',
                  color: '#9ca3af',
                  border: '1px solid #d1d5db'
                })
              }}
            >
              {isSaving ? (
                <>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <Check size={12} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={12} />
                  {isDemoMode ? 'Try it!' : 'Save'}
                </>
              )}
            </div>
          </div>

          {/* Helper Text */}
          <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #f3f4f6',
            fontSize: '11px',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            {isDemoMode 
              ? '🎯 This will show your canvas when you save!'
              : '💡 Text will be added as a bullet point to your canvas'
            }
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
};

export default TextSelectionModal;