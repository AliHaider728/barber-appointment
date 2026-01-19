import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Mail,
  Plus,
  Trash2,
  Save,
  Eye,
  GripVertical,
  Type,
  Square,
  Minus,
  Calendar,
  Scissors,
  AlignLeft,
  MousePointer,
  Download,
  Image,
  X
} from 'lucide-react';

const EmailTemplateBuilder = () => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const availableComponents = [
    { type: 'header', icon: Type, label: 'Header', color: 'bg-purple-500' },
    { type: 'text', icon: AlignLeft, label: 'Text Block', color: 'bg-blue-500' },
    { type: 'button', icon: MousePointer, label: 'Button', color: 'bg-green-500' },
    { type: 'image', icon: Image, label: 'Image', color: 'bg-pink-500' },
    { type: 'divider', icon: Minus, label: 'Divider', color: 'bg-gray-500' },
    { type: 'spacer', icon: Square, label: 'Spacer', color: 'bg-yellow-500' },
    { type: 'bookingInfo', icon: Calendar, label: 'Booking Info', color: 'bg-indigo-500' },
    { type: 'services', icon: Scissors, label: 'Services List', color: 'bg-red-500' }
  ];

  const addComponent = (type) => {
    const newComponent = {
      id: `${type}_${Date.now()}`,
      type,
      content: getDefaultContent(type),
      style: getDefaultStyle(type)
    };
    setComponents([...components, newComponent]);
  };

  const getDefaultContent = (type) => {
    const defaults = {
      header: 'Booking Confirmed!',
      text: 'Dear {{customerName}}, your appointment has been confirmed.',
      button: 'View Booking',
      bookingInfo: 'Booking Details',
      services: 'Your Services',
      image: 'https://via.placeholder.com/600x200/D4AF37/000000?text=Email+Banner',
      divider: '',
      spacer: ''
    };
    return defaults[type] || '';
  };

  const getDefaultStyle = (type) => {
    const defaults = {
      header: {
        backgroundColor: '#D4AF37',
        color: '#000000',
        fontSize: '28px',
        padding: '30px',
        textAlign: 'center'
      },
      text: {
        fontSize: '16px',
        color: '#333333',
        padding: '20px',
        lineHeight: '1.6'
      },
      button: {
        backgroundColor: '#000000',
        color: '#D4AF37',
        padding: '15px 40px',
        borderRadius: '8px',
        textAlign: 'center'
      },
      image: {
        width: '100%',
        height: 'auto'
      },
      divider: {
        borderTop: '1px solid #eee',
        margin: '20px 0'
      },
      spacer: {
        height: '40px'
      }
    };
    return defaults[type] || {};
  };

  const updateComponent = (id, updates) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, ...updates } : comp
    ));
  };

  const deleteComponent = (id) => {
    setComponents(components.filter(comp => comp.id !== id));
    if (selectedComponent?.id === id) {
      setSelectedComponent(null);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const saveTemplate = () => {
    const template = {
      name: templateName || 'Untitled Template',
      components,
      createdAt: new Date().toISOString()
    };
    
    console.log('Saving template:', template);
    setSaveMessage('✅ Template saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const exportTemplate = () => {
    const template = { name: templateName, components };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${templateName || 'template'}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Email Template Builder</h1>
              <p className="text-xs sm:text-sm text-gray-600">Drag & drop to create templates</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'} Preview</span>
              <span className="sm:hidden">Preview</span>
            </button>
            <button
              onClick={exportTemplate}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={saveTemplate}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-yellow-600 text-white text-sm font-bold rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save Template</span>
              <span className="sm:hidden">Save</span>
            </button>
          </div>
        </div>

        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Template Name (e.g., Booking Confirmation)"
          className="w-full px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
        />

        {saveMessage && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm font-semibold">
            {saveMessage}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Component Library */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            Add Components
          </h2>
          <div className="space-y-2">
            {availableComponents.map(({ type, icon: Icon, label, color }) => (
              <button
                key={type}
                onClick={() => addComponent(type)}
                className="w-full flex items-center gap-3 p-2 sm:p-3 rounded-lg border-2 border-gray-200 hover:border-yellow-600 hover:bg-gray-50 transition-all group"
              >
                <div className={`p-1.5 sm:p-2 ${color} rounded-lg`}>
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="text-sm sm:text-base font-semibold text-gray-700 group-hover:text-yellow-600">
                  {label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-800 font-semibold mb-2">💡 Dynamic Variables:</p>
            <div className="space-y-1 text-xs text-blue-700">
              <code className="block bg-white px-2 py-1 rounded">{'{{customerName}}'}</code>
              <code className="block bg-white px-2 py-1 rounded">{'{{bookingRef}}'}</code>
              <code className="block bg-white px-2 py-1 rounded">{'{{date}}'}</code>
              <code className="block bg-white px-2 py-1 rounded">{'{{time}}'}</code>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
              <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              Email Canvas {components.length > 0 && `(${components.length})`}
            </h2>

            {components.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center">
                <Mail className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-sm sm:text-base text-gray-500 font-semibold">Start building your email template</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">Add components from the left panel</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={components.map(c => c.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3">
                    {components.map((component) => (
                      <SortableComponent
                        key={component.id}
                        component={component}
                        selectedComponent={selectedComponent}
                        setSelectedComponent={setSelectedComponent}
                        deleteComponent={deleteComponent}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        {/* Style Editor */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold mb-4">Style Editor</h2>
          {selectedComponent ? (
            <StyleEditor
              component={selectedComponent}
              updateComponent={updateComponent}
            />
          ) : (
            <div className="text-center py-8 sm:py-12">
              <MousePointer className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 text-xs sm:text-sm">Select a component to edit its style</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          components={components}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

// Sortable Component
const SortableComponent = ({ component, selectedComponent, setSelectedComponent, deleteComponent }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const isSelected = selectedComponent?.id === component.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border-2 rounded-lg p-2 sm:p-3 ${
        isSelected ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none">
          <GripVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
        </button>
        
        <div className="flex-1 cursor-pointer min-w-0" onClick={() => setSelectedComponent(component)}>
          <ComponentPreview component={component} />
        </div>

        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setSelectedComponent(component)}
            className="p-1.5 sm:p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          >
            <Type className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => deleteComponent(component.id)}
            className="p-1.5 sm:p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Component Preview
const ComponentPreview = ({ component }) => {
  const renderPreview = () => {
    switch (component.type) {
      case 'header':
        return (
          <div style={component.style} className="rounded text-sm sm:text-base">
            <strong>{component.content}</strong>
          </div>
        );
      case 'text':
        return <div style={component.style} className="text-sm sm:text-base">{component.content}</div>;
      case 'button':
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'inline-block', ...component.style }} className="text-sm sm:text-base">
              {component.content}
            </div>
          </div>
        );
      case 'image':
        return <img src={component.content} alt="Email" style={component.style} className="rounded" />;
      case 'divider':
        return <div style={component.style}></div>;
      case 'spacer':
        return <div style={component.style}></div>;
      default:
        return <div className="text-gray-400 text-xs sm:text-sm">Component: {component.type}</div>;
    }
  };

  return renderPreview();
};

// Style Editor
const StyleEditor = ({ component, updateComponent }) => {
  return (
    <div className="space-y-4">
      {/* Content */}
      {!['divider', 'spacer', 'image'].includes(component.type) && (
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2">Content:</label>
          <textarea
            value={component.content}
            onChange={(e) => updateComponent(component.id, { content: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
            rows="3"
          />
        </div>
      )}

      {/* Image URL */}
      {component.type === 'image' && (
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2">Image URL:</label>
          <input
            type="text"
            value={component.content}
            onChange={(e) => updateComponent(component.id, { content: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}

      {/* Background Color */}
      {['header', 'button'].includes(component.type) && (
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2">Background:</label>
          <input
            type="color"
            value={component.style.backgroundColor}
            onChange={(e) =>
              updateComponent(component.id, {
                style: { ...component.style, backgroundColor: e.target.value }
              })
            }
            className="w-full h-10 rounded-lg cursor-pointer"
          />
        </div>
      )}

      {/* Text Color */}
      {!['divider', 'spacer', 'image'].includes(component.type) && (
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2">Text Color:</label>
          <input
            type="color"
            value={component.style.color}
            onChange={(e) =>
              updateComponent(component.id, {
                style: { ...component.style, color: e.target.value }
              })
            }
            className="w-full h-10 rounded-lg cursor-pointer"
          />
        </div>
      )}

      {/* Font Size */}
      {['header', 'text'].includes(component.type) && (
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2">Font Size:</label>
          <input
            type="number"
            value={parseInt(component.style.fontSize)}
            onChange={(e) =>
              updateComponent(component.id, {
                style: { ...component.style, fontSize: `${e.target.value}px` }
              })
            }
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
            min="12"
            max="48"
          />
        </div>
      )}

      {/* Padding */}
      {!['divider', 'spacer'].includes(component.type) && (
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2">Padding:</label>
          <input
            type="text"
            value={component.style.padding}
            onChange={(e) =>
              updateComponent(component.id, {
                style: { ...component.style, padding: e.target.value }
              })
            }
            placeholder="e.g., 20px"
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
          />
        </div>
      )}

      {/* Spacer Height */}
      {component.type === 'spacer' && (
        <div>
          <label className="block text-xs sm:text-sm font-semibold mb-2">Height:</label>
          <input
            type="number"
            value={parseInt(component.style.height)}
            onChange={(e) =>
              updateComponent(component.id, {
                style: { ...component.style, height: `${e.target.value}px` }
              })
            }
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
            min="10"
            max="200"
          />
        </div>
      )}
    </div>
  );
};

// Preview Modal
const PreviewModal = ({ components, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b p-3 sm:p-4 flex justify-between items-center">
          <h3 className="text-lg sm:text-xl font-bold">Email Preview</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4">
          {components.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No components added yet</p>
            </div>
          ) : (
            components.map((component) => (
              <ComponentPreview key={component.id} component={component} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateBuilder;