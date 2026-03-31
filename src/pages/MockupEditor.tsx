import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Type, Image as ImageIcon, Square, Circle,
  Undo, Redo, ZoomIn, ZoomOut, Grid, MousePointer2, Trash2,
  Layers, Settings2, Link as LinkIcon, ChevronDown, Palette,
} from 'lucide-react';
import { useStore, MockupElement } from '../store/useStore';

const DEFAULT_BACKGROUNDS = [
  { label: 'White Tee', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
  { label: 'Dark Hoodie', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80' },
  { label: 'Polo Shirt', url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80' },
  { label: 'Tank Top', url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80' },
  { label: 'Canvas Tote', url: 'https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?w=800&q=80' },
  { label: 'Trucker Hat', url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80' },
];

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se';

interface DragState {
  type: 'move' | 'resize';
  startX: number;
  startY: number;
  handle?: ResizeHandle;
  origEl: MockupElement;
}

export function MockupEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { quotes, updateQuote, products } = useStore();
  const quote = quotes.find((q) => q.id === id);

  const canvasRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [elements, setElements] = useState<MockupElement[]>(
    () => quote?.mockupElements ? JSON.parse(JSON.stringify(quote.mockupElements)) : []
  );
  const [history, setHistory] = useState<MockupElement[][]>([]);
  const [future, setFuture] = useState<MockupElement[][]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [blendBg, setBlendBg] = useState(false);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const initialBg = quote?.mockupBackground ||
    (quote ? products.find(p =>
      quote.items.some(i => i.description.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]))
    )?.image || DEFAULT_BACKGROUNDS[0].url : DEFAULT_BACKGROUNDS[0].url);

  const [bgUrl, setBgUrl] = useState(initialBg);

  const dragRef = useRef<DragState | null>(null);

  const sel = elements.find((e) => e.id === selectedId);

  const pushHistory = useCallback((prev: MockupElement[]) => {
    setHistory(h => [...h, JSON.parse(JSON.stringify(prev))]);
    setFuture([]);
  }, []);

  const setElementsWithHistory = useCallback((updater: (prev: MockupElement[]) => MockupElement[]) => {
    setElements(prev => {
      pushHistory(prev);
      return updater(prev);
    });
  }, [pushHistory]);

  const undo = () => {
    setHistory(h => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setFuture(f => [JSON.parse(JSON.stringify(elements)), ...f]);
      setElements(prev);
      return h.slice(0, -1);
    });
  };

  const redo = () => {
    setFuture(f => {
      if (f.length === 0) return f;
      const next = f[0];
      setHistory(h => [...h, JSON.parse(JSON.stringify(elements))]);
      setElements(next);
      return f.slice(1);
    });
  };

  const addEl = (type: MockupElement['type'], opts: Partial<MockupElement> = {}) => {
    const el: MockupElement = {
      id: `el_${Date.now()}`,
      type,
      x: 140,
      y: 140,
      width: type === 'text' ? 180 : 100,
      height: type === 'text' ? 50 : 100,
      rotation: 0,
      opacity: 100,
      ...opts,
    };
    setElementsWithHistory(prev => [...prev, el]);
    setSelectedId(el.id);
  };

  const updateEl = useCallback((id: string, u: Partial<MockupElement>, addToHistory = false) => {
    if (addToHistory) {
      setElementsWithHistory(prev => prev.map(e => e.id === id ? { ...e, ...u } : e));
    } else {
      setElements(prev => prev.map(e => e.id === id ? { ...e, ...u } : e));
    }
  }, [setElementsWithHistory]);

  const deleteEl = (id: string) => {
    setElementsWithHistory(prev => prev.filter((e) => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const getCanvasCoords = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const r = canvasRef.current.getBoundingClientRect();
    const scale = zoom / 100;
    return {
      x: (clientX - r.left) / scale,
      y: (clientY - r.top) / scale,
    };
  };

  const onElMouseDown = (e: React.MouseEvent, elId: string) => {
    e.stopPropagation();
    if (editingTextId) return;
    setSelectedId(elId);
    const el = elements.find(x => x.id === elId);
    if (!el) return;
    const coords = getCanvasCoords(e.clientX, e.clientY);
    dragRef.current = {
      type: 'move',
      startX: coords.x - el.x,
      startY: coords.y - el.y,
      origEl: { ...el },
    };
    pushHistory(elements);
  };

  const onResizeMouseDown = (e: React.MouseEvent, elId: string, handle: ResizeHandle) => {
    e.stopPropagation();
    e.preventDefault();
    const el = elements.find(x => x.id === elId);
    if (!el) return;
    const coords = getCanvasCoords(e.clientX, e.clientY);
    dragRef.current = {
      type: 'resize',
      startX: coords.x,
      startY: coords.y,
      handle,
      origEl: { ...el },
    };
    pushHistory(elements);
  };

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const coords = getCanvasCoords(e.clientX, e.clientY);
    const d = dragRef.current;

    if (d.type === 'move') {
      setElements(prev => prev.map(el =>
        el.id === selectedId ? { ...el, x: coords.x - d.startX, y: coords.y - d.startY } : el
      ));
    } else if (d.type === 'resize' && d.handle) {
      const dx = coords.x - d.startX;
      const dy = coords.y - d.startY;
      const orig = d.origEl;

      let newX = orig.x;
      let newY = orig.y;
      let newW = orig.width;
      let newH = orig.height;

      switch (d.handle) {
        case 'se':
          newW = Math.max(20, orig.width + dx);
          newH = Math.max(20, orig.height + dy);
          break;
        case 'sw':
          newW = Math.max(20, orig.width - dx);
          newH = Math.max(20, orig.height + dy);
          newX = orig.x + orig.width - newW;
          break;
        case 'ne':
          newW = Math.max(20, orig.width + dx);
          newH = Math.max(20, orig.height - dy);
          newY = orig.y + orig.height - newH;
          break;
        case 'nw':
          newW = Math.max(20, orig.width - dx);
          newH = Math.max(20, orig.height - dy);
          newX = orig.x + orig.width - newW;
          newY = orig.y + orig.height - newH;
          break;
      }

      setElements(prev => prev.map(el =>
        el.id === selectedId ? { ...el, x: newX, y: newY, width: newW, height: newH } : el
      ));
    }
  }, [selectedId]);

  const onMouseUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const handleDoubleClick = (e: React.MouseEvent, el: MockupElement) => {
    if (el.type === 'text') {
      e.stopPropagation();
      setEditingTextId(el.id);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleSave = () => {
    if (quote) {
      updateQuote(quote.id, {
        mockupElements: elements,
        mockupBackground: bgUrl,
        notes: quote.notes?.includes('[Mockup Attached]')
          ? quote.notes
          : `${quote.notes || ''}\n\n[Mockup Attached]`.trim(),
      });
    }
    navigate(-1);
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    addEl('image', { content: imageUrlInput.trim(), width: 140, height: 140 });
    setImageUrlInput('');
    setShowImageDialog(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingTextId) return;
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo(); else undo();
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !editingTextId) {
        deleteEl(selectedId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, editingTextId, elements, history, future]);

  const CANVAS_W = 480;
  const CANVAS_H = 580;

  const resizeCursors: Record<ResizeHandle, string> = {
    nw: 'nwse-resize', ne: 'nesw-resize', sw: 'nesw-resize', se: 'nwse-resize',
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="h-5 w-px bg-slate-800" />
          <span className="text-slate-200 font-medium text-sm">
            {quote ? `Mockup — ${quote.id}` : 'New Mockup'}
          </span>
          {quote?.mockupElements && quote.mockupElements.length > 0 && (
            <span className="text-[10px] bg-indigo-600/20 text-indigo-400 px-2 py-0.5 rounded-full">Saved</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 mr-3">
            <button
              onClick={undo}
              disabled={history.length === 0}
              title="Undo (Ctrl+Z)"
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">
              <Undo className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={future.length === 0}
              title="Redo (Ctrl+Shift+Z)"
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed">
              <Redo className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-700 mx-0.5" />
            <button onClick={() => setZoom(z => Math.max(40, z - 10))} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-slate-300 w-10 text-center">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-slate-700 mx-0.5" />
            <button
              onClick={() => setShowGrid(g => !g)}
              className={`p-1.5 rounded ${showGrid ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">
            <Save className="w-3.5 h-3.5 mr-2" />
            Save Mockup
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-56 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Add Elements</p>
            <div className="space-y-1">
              <button
                onClick={() => setShowImageDialog(true)}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white text-sm">
                <ImageIcon className="w-4 h-4" />
                Add Image (URL)
              </button>
              <button
                onClick={() => addEl('text', { content: 'Your Text', color: '#ffffff', fontSize: 24 })}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white text-sm">
                <Type className="w-4 h-4" />
                Add Text
              </button>
              <button
                onClick={() => addEl('shape', { shapeType: 'rect', color: '#3b82f6' })}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white text-sm">
                <Square className="w-4 h-4" />
                Rectangle
              </button>
              <button
                onClick={() => addEl('shape', { shapeType: 'circle', color: '#3b82f6' })}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg text-slate-300 hover:bg-slate-900 hover:text-white text-sm">
                <Circle className="w-4 h-4" />
                Circle
              </button>
            </div>
          </div>

          {/* Background Picker */}
          <div className="p-3 border-b border-slate-800">
            <button
              onClick={() => setShowBgPicker(b => !b)}
              className="w-full flex items-center justify-between text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1 hover:text-slate-300">
              <span className="flex items-center gap-1.5"><Palette className="w-3 h-3" /> Background</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showBgPicker ? 'rotate-180' : ''}`} />
            </button>
            {showBgPicker && (
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {DEFAULT_BACKGROUNDS.map(bg => (
                  <button
                    key={bg.url}
                    onClick={() => setBgUrl(bg.url)}
                    className={`relative rounded overflow-hidden aspect-square border-2 transition-all ${bgUrl === bg.url ? 'border-indigo-500' : 'border-transparent hover:border-slate-600'}`}>
                    <img src={bg.url} alt={bg.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 left-0 right-0 bg-slate-900/80 text-[9px] text-slate-300 text-center py-0.5 truncate px-1">{bg.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Layers */}
          <div className="mt-auto p-3 border-t border-slate-800">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Layers className="w-3 h-3" /> Layers
            </p>
            <div className="space-y-0.5 max-h-44 overflow-y-auto">
              {elements.length === 0 && <p className="text-xs text-slate-600 italic">No layers</p>}
              {[...elements].reverse().map(el => (
                <div
                  key={el.id}
                  onClick={() => setSelectedId(el.id)}
                  className={`flex items-center justify-between p-1.5 rounded text-xs cursor-pointer ${selectedId === el.id ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:bg-slate-900'}`}>
                  <div className="flex items-center gap-1.5 truncate">
                    {el.type === 'text' ? <Type className="w-3 h-3 shrink-0" /> : el.type === 'image' ? <ImageIcon className="w-3 h-3 shrink-0" /> : <Square className="w-3 h-3 shrink-0" />}
                    <span className="truncate">{el.type === 'text' ? el.content : `${el.type}${el.shapeType ? ` (${el.shapeType})` : ''}`}</span>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteEl(el.id); }} className="text-slate-600 hover:text-rose-400 shrink-0">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div
          className="flex-1 bg-slate-900 relative overflow-hidden flex items-center justify-center select-none"
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onClick={() => { setSelectedId(null); setEditingTextId(null); }}>

          {showGrid && (
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{
              backgroundImage: 'linear-gradient(to right, #475569 1px, transparent 1px), linear-gradient(to bottom, #475569 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
          )}

          <div
            className="relative shadow-2xl"
            style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${zoom / 100})`, transformOrigin: 'center center', backgroundColor: '#fff' }}>

            <img
              src={bgUrl}
              alt="Base garment"
              className={`w-full h-full object-cover pointer-events-none ${blendBg ? 'mix-blend-multiply' : ''}`} />

            <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-dashed border-slate-300/30 pointer-events-none rounded" />

            <div ref={canvasRef} className="absolute inset-0">
              {elements.map(el => {
                const isSelected = selectedId === el.id;
                const isEditingThis = editingTextId === el.id;

                return (
                  <div
                    key={el.id}
                    onMouseDown={e => onElMouseDown(e, el.id)}
                    onDoubleClick={e => handleDoubleClick(e, el)}
                    className={`absolute ${isEditingThis ? 'cursor-text' : 'cursor-move'}`}
                    style={{
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      height: el.height,
                      transform: `rotate(${el.rotation}deg)`,
                      opacity: el.opacity / 100,
                      zIndex: isSelected ? 10 : 1,
                      outline: isSelected ? '2px solid #6366f1' : 'none',
                      outlineOffset: '1px',
                    }}>

                    {el.type === 'image' && (
                      <img src={el.content} alt="" className="w-full h-full object-contain pointer-events-none" />
                    )}
                    {el.type === 'shape' && el.shapeType === 'rect' && (
                      <div className="w-full h-full" style={{ backgroundColor: el.color }} />
                    )}
                    {el.type === 'shape' && el.shapeType === 'circle' && (
                      <div className="w-full h-full rounded-full" style={{ backgroundColor: el.color }} />
                    )}
                    {el.type === 'text' && (
                      isEditingThis ? (
                        <textarea
                          ref={inputRef as any}
                          value={el.content}
                          onChange={e => updateEl(el.id, { content: e.target.value })}
                          onBlur={() => { setEditingTextId(null); pushHistory(elements); }}
                          onClick={e => e.stopPropagation()}
                          className="w-full h-full bg-transparent border-none outline-none resize-none text-center font-bold p-0"
                          style={{ color: el.color, fontSize: `${el.fontSize}px`, lineHeight: 1.1 }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-center font-bold break-words"
                          style={{ color: el.color, fontSize: `${el.fontSize}px`, lineHeight: 1.1 }}>
                          {el.content}
                        </div>
                      )
                    )}

                    {isSelected && !isEditingThis && (
                      <>
                        {(['nw', 'ne', 'sw', 'se'] as ResizeHandle[]).map(handle => (
                          <div
                            key={handle}
                            onMouseDown={e => onResizeMouseDown(e, el.id, handle)}
                            className="absolute w-3 h-3 bg-white border-2 border-indigo-500 rounded-full"
                            style={{
                              cursor: resizeCursors[handle],
                              top: handle.startsWith('n') ? -6 : undefined,
                              bottom: handle.startsWith('s') ? -6 : undefined,
                              left: handle.endsWith('w') ? -6 : undefined,
                              right: handle.endsWith('e') ? -6 : undefined,
                            }}
                          />
                        ))}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="w-60 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-slate-800">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Settings2 className="w-3 h-3" /> Properties
            </p>
          </div>
          <div className="p-3 space-y-4">
            {sel ? (
              <>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase mb-2">Position & Size</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['x', 'y', 'width', 'height'] as const).map(f => (
                      <div key={f}>
                        <label className="block text-[10px] text-slate-500 mb-0.5 uppercase">{f}</label>
                        <input
                          type="number"
                          value={Math.round(sel[f])}
                          onChange={e => updateEl(sel.id, { [f]: Number(e.target.value) }, true)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-0.5">
                    <label className="text-[10px] text-slate-500 uppercase">Rotation</label>
                    <span className="text-[10px] text-slate-400">{sel.rotation}°</span>
                  </div>
                  <input
                    type="range" min="0" max="360" value={sel.rotation}
                    onChange={e => updateEl(sel.id, { rotation: Number(e.target.value) })}
                    onMouseUp={() => pushHistory(elements)}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-0.5">
                    <label className="text-[10px] text-slate-500 uppercase">Opacity</label>
                    <span className="text-[10px] text-slate-400">{sel.opacity}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" value={sel.opacity}
                    onChange={e => updateEl(sel.id, { opacity: Number(e.target.value) })}
                    onMouseUp={() => pushHistory(elements)}
                    className="w-full accent-indigo-500"
                  />
                </div>

                {sel.type === 'text' && (
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5 uppercase">Text Content</label>
                      <input
                        type="text"
                        value={sel.content}
                        onChange={e => updateEl(sel.id, { content: e.target.value })}
                        onBlur={() => pushHistory(elements)}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5 uppercase">Font Size</label>
                        <input
                          type="number"
                          value={sel.fontSize}
                          onChange={e => updateEl(sel.id, { fontSize: Number(e.target.value) }, true)}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5 uppercase">Color</label>
                        <input
                          type="color"
                          value={sel.color}
                          onChange={e => updateEl(sel.id, { color: e.target.value })}
                          onBlur={() => pushHistory(elements)}
                          className="w-full h-8 bg-slate-900 border border-slate-700 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-600 italic">Double-click element on canvas to edit inline</p>
                  </div>
                )}

                {sel.type === 'image' && (
                  <div className="pt-3 border-t border-slate-800 space-y-2">
                    <label className="block text-[10px] text-slate-500 uppercase">Image URL</label>
                    <input
                      type="text"
                      value={sel.content || ''}
                      onChange={e => updateEl(sel.id, { content: e.target.value })}
                      onBlur={() => pushHistory(elements)}
                      placeholder="https://..."
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                    <img src={sel.content} alt="" className="w-full h-20 object-contain bg-slate-800 rounded border border-slate-700" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}

                {sel.type === 'shape' && (
                  <div className="pt-3 border-t border-slate-800">
                    <label className="block text-[10px] text-slate-500 mb-1 uppercase">Fill Color</label>
                    <input
                      type="color"
                      value={sel.color}
                      onChange={e => updateEl(sel.id, { color: e.target.value })}
                      onBlur={() => pushHistory(elements)}
                      className="w-full h-8 bg-slate-900 border border-slate-700 rounded cursor-pointer"
                    />
                  </div>
                )}

                <button
                  onClick={() => deleteEl(sel.id)}
                  className="w-full flex items-center justify-center px-3 py-2 bg-rose-500/10 text-rose-400 rounded-lg text-sm font-medium hover:bg-rose-500/20">
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete Element
                </button>
              </>
            ) : (
              <>
                <div className="text-center py-6">
                  <MousePointer2 className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Select an element to edit its properties.</p>
                </div>
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Canvas Options</p>
                  <label className="flex items-center text-xs text-slate-300 cursor-pointer gap-2">
                    <input
                      type="checkbox"
                      checked={blendBg}
                      onChange={e => setBlendBg(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-500"
                    />
                    Multiply blend mode
                  </label>
                </div>
                <div className="pt-3 border-t border-slate-800">
                  <p className="text-[10px] text-slate-500 mb-2 uppercase font-semibold">Keyboard Shortcuts</p>
                  <div className="space-y-1 text-[10px] text-slate-600">
                    <div className="flex justify-between"><span>Undo</span><span className="font-mono bg-slate-900 px-1 rounded">Ctrl+Z</span></div>
                    <div className="flex justify-between"><span>Redo</span><span className="font-mono bg-slate-900 px-1 rounded">Ctrl+Shift+Z</span></div>
                    <div className="flex justify-between"><span>Delete</span><span className="font-mono bg-slate-900 px-1 rounded">Del / ⌫</span></div>
                    <div className="flex justify-between"><span>Edit text</span><span className="font-mono bg-slate-900 px-1 rounded">Dbl-click</span></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Image URL Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm" onClick={() => setShowImageDialog(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-96 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-white mb-1">Add Image from URL</h3>
            <p className="text-xs text-slate-400 mb-4">Paste a public image URL (Unsplash, PNG, JPG, etc.)</p>
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 mb-4">
              <LinkIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="https://images.unsplash.com/..."
                value={imageUrlInput}
                onChange={e => setImageUrlInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddImage()}
                className="flex-1 bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-600"
              />
            </div>
            {imageUrlInput && (
              <img src={imageUrlInput} alt="" className="w-full h-24 object-contain bg-slate-800 rounded-lg mb-4 border border-slate-700" onError={e => (e.currentTarget.style.opacity = '0.3')} />
            )}
            <div className="flex gap-2">
              <button onClick={() => setShowImageDialog(false)} className="flex-1 py-2 text-sm text-slate-400 rounded-lg border border-slate-700 hover:bg-slate-800">Cancel</button>
              <button onClick={handleAddImage} className="flex-1 py-2 text-sm bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Add Image</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
