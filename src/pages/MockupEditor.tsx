import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  MousePointer2,
  Trash2,
  Layers,
  Settings2 } from
'lucide-react';
import { useStore } from '../store/useStore';
const MOCKUP_BG =
'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80';
type ElType = 'text' | 'image' | 'shape';
interface CanvasEl {
  id: string;
  type: ElType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  content?: string;
  color?: string;
  shapeType?: 'rect' | 'circle';
  fontSize?: number;
}
export function MockupEditor() {
  const { id } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const { quotes, updateQuote } = useStore();
  const quote = quotes.find((q) => q.id === id);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<CanvasEl[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [blendBg, setBlendBg] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOff, setDragOff] = useState({
    x: 0,
    y: 0
  });
  const sel = elements.find((e) => e.id === selectedId);
  const addEl = (type: ElType, opts: Partial<CanvasEl> = {}) => {
    const el: CanvasEl = {
      id: `el_${Date.now()}`,
      type,
      x: 150,
      y: 150,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 50 : 100,
      rotation: 0,
      opacity: 100,
      ...opts
    };
    setElements([...elements, el]);
    setSelectedId(el.id);
  };
  const updateEl = (id: string, u: Partial<CanvasEl>) =>
  setElements(
    elements.map((e) =>
    e.id === id ?
    {
      ...e,
      ...u
    } :
    e
    )
  );
  const deleteEl = (id: string) => {
    setElements(elements.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const onMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedId(id);
    setIsDragging(true);
    const el = elements.find((x) => x.id === id);
    if (el && canvasRef.current) {
      const r = canvasRef.current.getBoundingClientRect();
      setDragOff({
        x: e.clientX - r.left - el.x,
        y: e.clientY - r.top - el.y
      });
    }
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedId || !canvasRef.current) return;
    const r = canvasRef.current.getBoundingClientRect();
    updateEl(selectedId, {
      x: e.clientX - r.left - dragOff.x,
      y: e.clientY - r.top - dragOff.y
    });
  };
  const onMouseUp = () => setIsDragging(false);
  const handleSave = () => {
    if (quote)
    updateQuote(quote.id, {
      notes: quote.notes?.includes('[Mockup Attached]') ?
      quote.notes :
      `${quote.notes || ''}\n\n[Mockup Attached]`
    });
    navigate(-1);
  };
  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800">
            
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-5 w-px bg-slate-800" />
          <span className="text-slate-200 font-medium text-sm">
            {quote ? `Mockup — ${quote.id}` : 'New Mockup'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 mr-3">
            <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800">
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800">
              <Redo className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-700 mx-0.5" />
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800">
              
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-slate-300 w-10 text-center">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800">
              
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-700 mx-0.5" />
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded ${showGrid ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            
            <Save className="w-3.5 h-3.5 mr-2" />
            Save
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Tools */}
        <div className="w-56 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-3 space-y-1">
            <button
              onClick={() =>
              addEl('image', {
                content:
                'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&q=80',
                width: 140,
                height: 140
              })
              }
              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white text-sm">
              
              <ImageIcon className="w-4 h-4" />
              Upload Image
            </button>
            <button
              onClick={() =>
              addEl('text', {
                content: 'Your Text',
                color: '#000000',
                fontSize: 24
              })
              }
              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white text-sm">
              
              <Type className="w-4 h-4" />
              Add Text
            </button>
            <button
              onClick={() =>
              addEl('shape', {
                shapeType: 'rect',
                color: '#3b82f6'
              })
              }
              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white text-sm">
              
              <Square className="w-4 h-4" />
              Rectangle
            </button>
            <button
              onClick={() =>
              addEl('shape', {
                shapeType: 'circle',
                color: '#3b82f6'
              })
              }
              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white text-sm">
              
              <Circle className="w-4 h-4" />
              Circle
            </button>
          </div>
          <div className="mt-auto p-3 border-t border-slate-800">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Layers className="w-3 h-3" />
              Layers
            </p>
            <div className="space-y-0.5 max-h-40 overflow-y-auto">
              {elements.length === 0 &&
              <p className="text-xs text-slate-600 italic">No layers</p>
              }
              {[...elements].reverse().map((el) =>
              <div
                key={el.id}
                onClick={() => setSelectedId(el.id)}
                className={`flex items-center justify-between p-1.5 rounded text-xs cursor-pointer ${selectedId === el.id ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:bg-slate-900'}`}>
                
                  <div className="flex items-center gap-1.5 truncate">
                    {el.type === 'text' ?
                  <Type className="w-3 h-3" /> :
                  el.type === 'image' ?
                  <ImageIcon className="w-3 h-3" /> :

                  <Square className="w-3 h-3" />
                  }
                    <span className="truncate">
                      {el.type === 'text' ? el.content : el.type}
                    </span>
                  </div>
                  <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEl(el.id);
                  }}
                  className="text-slate-600 hover:text-rose-400">
                  
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div
          className="flex-1 bg-slate-900 relative overflow-hidden flex items-center justify-center"
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClick={() => setSelectedId(null)}>
          
          {showGrid &&
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
              'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

          }
          <div
            className="relative shadow-2xl"
            style={{
              width: 480,
              height: 580,
              transform: `scale(${zoom / 100})`,
              backgroundColor: '#fff'
            }}>
            
            <img
              src={MOCKUP_BG}
              alt="Base"
              className={`w-full h-full object-cover pointer-events-none ${blendBg ? 'mix-blend-multiply' : ''}`} />
            
            <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-dashed border-slate-300/40 pointer-events-none rounded" />
            <div ref={canvasRef} className="absolute inset-0">
              {elements.map((el) =>
              <div
                key={el.id}
                onMouseDown={(e) => onMouseDown(e, el.id)}
                className={`absolute cursor-move ${selectedId === el.id ? 'ring-2 ring-indigo-500 ring-offset-1 ring-offset-transparent' : ''}`}
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  transform: `rotate(${el.rotation}deg)`,
                  opacity: el.opacity / 100,
                  zIndex: selectedId === el.id ? 10 : 1
                }}>
                
                  {el.type === 'image' &&
                <img
                  src={el.content}
                  alt=""
                  className="w-full h-full object-contain pointer-events-none" />

                }
                  {el.type === 'shape' && el.shapeType === 'rect' &&
                <div
                  className="w-full h-full"
                  style={{
                    backgroundColor: el.color
                  }} />

                }
                  {el.type === 'shape' && el.shapeType === 'circle' &&
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    backgroundColor: el.color
                  }} />

                }
                  {el.type === 'text' &&
                <div
                  className="w-full h-full flex items-center justify-center text-center font-bold"
                  style={{
                    color: el.color,
                    fontSize: `${el.fontSize}px`
                  }}>
                  
                      {el.content}
                    </div>
                }
                  {selectedId === el.id &&
                <>
                      <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full cursor-nwse-resize" />
                      <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full cursor-nesw-resize" />
                      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full cursor-nesw-resize" />
                      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full cursor-nwse-resize" />
                    </>
                }
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Props */}
        <div className="w-56 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-slate-800">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Settings2 className="w-3 h-3" />
              Properties
            </p>
          </div>
          <div className="p-3 space-y-5">
            {sel ?
            <>
                <div className="grid grid-cols-2 gap-2">
                  {(['x', 'y', 'width', 'height'] as const).map((f) =>
                <div key={f}>
                      <label className="block text-[10px] text-slate-500 mb-0.5 uppercase">
                        {f}
                      </label>
                      <input
                    type="number"
                    value={Math.round(sel[f])}
                    onChange={(e) =>
                    updateEl(sel.id, {
                      [f]: Number(e.target.value)
                    })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                  
                    </div>
                )}
                </div>
                <div>
                  <div className="flex justify-between mb-0.5">
                    <label className="text-[10px] text-slate-500 uppercase">
                      Rotation
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {sel.rotation}°
                    </span>
                  </div>
                  <input
                  type="range"
                  min="0"
                  max="360"
                  value={sel.rotation}
                  onChange={(e) =>
                  updateEl(sel.id, {
                    rotation: Number(e.target.value)
                  })
                  }
                  className="w-full accent-indigo-500" />
                
                </div>
                <div>
                  <div className="flex justify-between mb-0.5">
                    <label className="text-[10px] text-slate-500 uppercase">
                      Opacity
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {sel.opacity}%
                    </span>
                  </div>
                  <input
                  type="range"
                  min="0"
                  max="100"
                  value={sel.opacity}
                  onChange={(e) =>
                  updateEl(sel.id, {
                    opacity: Number(e.target.value)
                  })
                  }
                  className="w-full accent-indigo-500" />
                
                </div>
                {sel.type === 'text' &&
              <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5 uppercase">
                        Text
                      </label>
                      <input
                    type="text"
                    value={sel.content}
                    onChange={(e) =>
                    updateEl(sel.id, {
                      content: e.target.value
                    })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                  
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5 uppercase">
                          Size
                        </label>
                        <input
                      type="number"
                      value={sel.fontSize}
                      onChange={(e) =>
                      updateEl(sel.id, {
                        fontSize: Number(e.target.value)
                      })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                    
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5 uppercase">
                          Color
                        </label>
                        <input
                      type="color"
                      value={sel.color}
                      onChange={(e) =>
                      updateEl(sel.id, {
                        color: e.target.value
                      })
                      }
                      className="w-full h-7 bg-slate-900 border border-slate-700 rounded cursor-pointer" />
                    
                      </div>
                    </div>
                  </div>
              }
                {sel.type === 'shape' &&
              <div className="pt-3 border-t border-slate-800">
                    <label className="block text-[10px] text-slate-500 mb-0.5 uppercase">
                      Fill
                    </label>
                    <input
                  type="color"
                  value={sel.color}
                  onChange={(e) =>
                  updateEl(sel.id, {
                    color: e.target.value
                  })
                  }
                  className="w-full h-7 bg-slate-900 border border-slate-700 rounded cursor-pointer" />
                
                  </div>
              }
                <button
                onClick={() => deleteEl(sel.id)}
                className="w-full flex items-center justify-center px-3 py-2 bg-rose-500/10 text-rose-400 rounded-lg text-sm font-medium hover:bg-rose-500/20">
                
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete
                </button>
              </> :

            <div className="text-center py-6">
                <MousePointer2 className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-500">
                  Select an element to edit.
                </p>
              </div>
            }
            {!sel &&
            <div className="pt-3 border-t border-slate-800">
                <label className="flex items-center text-xs text-slate-300 cursor-pointer gap-2">
                  <input
                  type="checkbox"
                  checked={blendBg}
                  onChange={(e) => setBlendBg(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-indigo-500" />
                
                  Blend mode (multiply)
                </label>
              </div>
            }
          </div>
        </div>
      </div>
    </div>);

}