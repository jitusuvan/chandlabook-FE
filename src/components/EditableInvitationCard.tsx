import React, { useState, useRef, forwardRef } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface TextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: string;
  isEditing: boolean;
}

interface EditableInvitationCardProps {
  eventData: {
    name: string;
    date: string;
    event_type: string;
    bride_groom_name?: string;
  };
  hostName?: string;
}

const EditableInvitationCard = forwardRef<HTMLDivElement, EditableInvitationCardProps>(({ 
  eventData, 
  hostName = "Your Family" 
}, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: '1',
      text: '🎉 You\'re Invited! 🎉',
      x: 200,
      y: 80,
      fontSize: 24,
      color: '#ffffff',
      fontWeight: 'bold',
      isEditing: false
    },
    {
      id: '2',
      text: `${hostName} cordially invites you to`,
      x: 200,
      y: 120,
      fontSize: 14,
      color: '#ffffff',
      fontWeight: 'normal',
      isEditing: false
    },
    {
      id: '3',
      text: eventData.event_type === 'marriage' ? '💒 Wedding Ceremony' : '🎊 Chandlo Celebration',
      x: 200,
      y: 180,
      fontSize: 28,
      color: '#ffffff',
      fontWeight: 'bold',
      isEditing: false
    },
    {
      id: '4',
      text: eventData.name,
      x: 200,
      y: 220,
      fontSize: 20,
      color: '#ffffff',
      fontWeight: 'bold',
      isEditing: false
    },
    {
      id: '5',
      text: '📅 Date & Time',
      x: 200,
      y: 300,
      fontSize: 16,
      color: '#ffffff',
      fontWeight: 'normal',
      isEditing: false
    },
    {
      id: '6',
      text: new Date(eventData.date).toLocaleDateString('en-IN'),
      x: 200,
      y: 330,
      fontSize: 18,
      color: '#ffffff',
      fontWeight: 'bold',
      isEditing: false
    },
    {
      id: '7',
      text: 'Time: 11:00 AM onwards',
      x: 200,
      y: 360,
      fontSize: 16,
      color: '#ffffff',
      fontWeight: 'normal',
      isEditing: false
    },
    {
      id: '8',
      text: 'Your presence will make our celebration complete',
      x: 200,
      y: 480,
      fontSize: 14,
      color: '#ffffff',
      fontWeight: 'normal',
      isEditing: false
    },
    {
      id: '9',
      text: 'With love and blessings ❤️',
      x: 200,
      y: 510,
      fontSize: 12,
      color: '#ffffff',
      fontWeight: 'normal',
      isEditing: false
    }
  ]);

  const handleTouchStart = (e: React.TouchEvent, elementId: string) => {
    const touch = e.touches[0];
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const element = textElements.find(el => el.id === elementId);
    if (!element) return;

    setDraggedElement(elementId);
    setDragOffset({
      x: touch.clientX - rect.left - element.x,
      y: touch.clientY - rect.top - element.y
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedElement || !cardRef.current) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const newX = touch.clientX - rect.left - dragOffset.x;
    const newY = touch.clientY - rect.top - dragOffset.y;

    setTextElements(prev => prev.map(el => 
      el.id === draggedElement 
        ? { ...el, x: Math.max(0, Math.min(380, newX)), y: Math.max(0, Math.min(580, newY)) }
        : el
    ));
  };

  const handleTouchEnd = () => {
    setDraggedElement(null);
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    if (e.detail === 2) { // Double click to edit
      setTextElements(prev => prev.map(el => 
        el.id === elementId ? { ...el, isEditing: true } : { ...el, isEditing: false }
      ));
      return;
    }

    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const element = textElements.find(el => el.id === elementId);
    if (!element) return;

    setDraggedElement(elementId);
    setDragOffset({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedElement || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    setTextElements(prev => prev.map(el => 
      el.id === draggedElement 
        ? { ...el, x: Math.max(0, Math.min(380, newX)), y: Math.max(0, Math.min(580, newY)) }
        : el
    ));
  };

  const handleMouseUp = () => {
    setDraggedElement(null);
  };



  const updateStyle = (id: string, property: string, value: string | number) => {
    setTextElements(prev => prev.map(el => 
      el.id === id ? { ...el, [property]: value } : el
    ));
  };

  const deleteElement = (id: string) => {
    setTextElements(prev => prev.filter(el => el.id !== id));
  };

  const addNewElement = () => {
    const newElement: TextElement = {
      id: Date.now().toString(),
      text: 'New Text',
      x: 200,
      y: 250,
      fontSize: 16,
      color: '#ffffff',
      fontWeight: 'normal',
      isEditing: true
    };
    setTextElements(prev => [...prev, newElement]);
  };

  return (
    <div className="d-flex flex-column align-items-center">
      {/* Controls */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <button className="btn btn-sm btn-primary" onClick={addNewElement}>
          <FaPlus className="me-1" /> Add Text
        </button>
      </div>

      {/* Invitation Card */}
      <div 
        ref={ref || cardRef}
        className="position-relative"
        style={{
          width: '400px',
          height: '600px',
          background: 'linear-gradient(135deg, #ff6b6b, #ffd93d)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          cursor: draggedElement ? 'grabbing' : 'default'
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Decorative Border */}
        <div style={{
          position: 'absolute',
          top: '15px',
          left: '15px',
          right: '15px',
          bottom: '15px',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: '15px',
          pointerEvents: 'none'
        }} />

        {/* Text Elements */}
        {textElements.map(element => (
          <div key={element.id}>
            {element.isEditing ? (
              <input
                type="text"
                value={element.text}
                onChange={(e) => setTextElements(prev => prev.map(el => 
                  el.id === element.id ? { ...el, text: e.target.value } : el
                ))}
                onBlur={() => setTextElements(prev => prev.map(el => 
                  el.id === element.id ? { ...el, isEditing: false } : el
                ))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    setTextElements(prev => prev.map(el => 
                      el.id === element.id ? { ...el, isEditing: false } : el
                    ));
                  }
                }}
                style={{
                  position: 'absolute',
                  left: element.x - 100,
                  top: element.y - 15,
                  fontSize: `${element.fontSize}px`,
                  color: '#000',
                  background: 'white',
                  border: '2px solid #007bff',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  textAlign: 'center',
                  width: '200px',
                  zIndex: 1000
                }}
                autoFocus
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  left: element.x,
                  top: element.y,
                  fontSize: `${element.fontSize}px`,
                  color: element.color,
                  fontWeight: element.fontWeight,
                  fontFamily: 'serif',
                  textAlign: 'center',
                  transform: 'translateX(-50%)',
                  cursor: 'grab',
                  userSelect: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'background 0.2s'
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
                onTouchStart={(e) => handleTouchStart(e, element.id)}
                className="text-element"
              >
                {element.text}
                
                {/* Edit Controls */}
                <div 
                  className="position-absolute d-none"
                  style={{ top: '-30px', left: '50%', transform: 'translateX(-50%)' }}
                >
                  <div className="btn-group btn-group-sm">
                    <button 
                      className="btn btn-light btn-sm"
                      onClick={() => setTextElements(prev => prev.map(el => 
                        el.id === element.id ? { ...el, isEditing: true } : el
                      ))}
                    >
                      <FaEdit size={10} />
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteElement(element.id)}
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Style Controls */}
      <div className="mt-3 w-100" style={{ maxWidth: '400px' }}>
        {textElements.find(el => el.isEditing) && (
          <div className="card">
            <div className="card-body p-2">
              <h6 className="card-title mb-2">Text Style</h6>
              {(() => {
                const editingElement = textElements.find(el => el.isEditing);
                if (!editingElement) return null;
                
                return (
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small">Font Size</label>
                      <input
                        type="range"
                        className="form-range"
                        min="10"
                        max="40"
                        value={editingElement.fontSize}
                        onChange={(e) => updateStyle(editingElement.id, 'fontSize', parseInt(e.target.value))}
                      />
                      <small>{editingElement.fontSize}px</small>
                    </div>
                    <div className="col-6">
                      <label className="form-label small">Color</label>
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={editingElement.color}
                        onChange={(e) => updateStyle(editingElement.id, 'color', e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={editingElement.fontWeight === 'bold'}
                          onChange={(e) => updateStyle(editingElement.id, 'fontWeight', e.target.checked ? 'bold' : 'normal')}
                        />
                        <label className="form-check-label small">Bold</label>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

    </div>
  );
});

EditableInvitationCard.displayName = 'EditableInvitationCard';

export default EditableInvitationCard;