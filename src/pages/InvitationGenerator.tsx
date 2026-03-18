import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AppLayout from '../layouts/AppLayout';
import InvitationCard from '../components/EditableInvitationCard';
import type { Section, TemplateType, TemplateStyle } from '../components/EditableInvitationCard';
import { TEMPLATE_STYLES } from '../components/EditableInvitationCard';
import useApi from '../hooks/useApi';
import { FaWhatsapp, FaImage, FaPlus, FaTrash, FaChevronDown, FaChevronUp, FaGripVertical, FaPrint, FaPalette, FaEdit, FaEye, FaCheck } from 'react-icons/fa';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import html2canvas from 'html2canvas';
import { CSS } from '@dnd-kit/utilities';
import { useLocation } from "react-router-dom";
interface EventData {
  id: number;
  name: string;
  date: string;
  event_type: string;
  bride_groom_name?: string;
}

const AVAILABLE_SECTIONS: { type: Section['type']; label: string; emoji: string; defaultLines: (e: EventData) => string[] }[] = [
  { type: 'header',   label: 'Header',      emoji: '🎉', defaultLines: () => ["You're Invited!"] },
  { type: 'names',    label: 'Names',       emoji: '👫', defaultLines: (e) => [e.bride_groom_name || 'Bride & Groom', 'Together with their families'] },
  { type: 'datetime', label: 'Date & Time', emoji: '📅', defaultLines: (e) => [new Date(e.date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), '11:00 AM onwards'] },
  { type: 'venue',    label: 'Venue',       emoji: '📍', defaultLines: () => ['Venue Name', 'City, State'] },
  { type: 'message',  label: 'Message',     emoji: '💬', defaultLines: () => ['Your presence will make our celebration complete'] },
  { type: 'footer',   label: 'Footer',      emoji: '❤️', defaultLines: () => ['With love and blessings'] },
];

const buildDefaultSections = (eventData: EventData): Section[] => {
  const types: Section['type'][] = eventData.event_type === 'marriage'
    ? ['header', 'names', 'datetime', 'venue', 'footer']
    : ['header', 'datetime', 'venue', 'message', 'footer'];
  return types.map(type => {
    const def = AVAILABLE_SECTIONS.find(s => s.type === type)!;
    return { id: `${type}-${Date.now()}-${Math.random()}`, type, label: def.label, emoji: def.emoji, lines: def.defaultLines(eventData) };
  });
};

// ── Sortable Section ───────────────────────────────────────────────────────
interface SortableSectionProps {
  section: Section;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  updateLabel: (id: string, label: string) => void;
  updateLine: (id: string, i: number, val: string) => void;
  addLine: (id: string) => void;
  removeLine: (id: string, i: number) => void;
  removeSection: (id: string) => void;
}

const SortableSection = ({ section, expandedId, setExpandedId, updateLabel, updateLine, addLine, removeLine, removeSection }: SortableSectionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const isExpanded = expandedId === section.id;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, border: '1px solid #f0f0f0', background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderRadius: 16, overflow: 'hidden' }}
    >
      <div
        className="d-flex align-items-center justify-content-between px-3 py-2"
        style={{ cursor: 'pointer', background: isExpanded ? '#fff8f8' : 'white', borderBottom: isExpanded ? '1px solid #fee2e2' : 'none' }}
        onClick={() => setExpandedId(isExpanded ? null : section.id)}
      >
        <div className="d-flex align-items-center gap-2">
          <span {...attributes} {...listeners} onClick={e => e.stopPropagation()} style={{ cursor: 'grab', color: '#ccc', touchAction: 'none' }}>
            <FaGripVertical size={13} />
          </span>
          <span style={{ fontSize: 16 }}>{section.emoji}</span>
          {isExpanded ? (
            <input
              className="form-control form-control-sm border-0 bg-transparent fw-semibold p-0"
              style={{ width: 140, fontSize: 13, outline: 'none', boxShadow: 'none' }}
              value={section.label}
              onClick={e => e.stopPropagation()}
              onChange={e => updateLabel(section.id, e.target.value)}
            />
          ) : (
            <span className="fw-semibold" style={{ fontSize: 13 }}>{section.label}</span>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn p-0 d-flex align-items-center justify-content-center"
            style={{ width: 26, height: 26, borderRadius: '50%', background: '#fee2e2', border: 'none', color: '#dc2626' }}
            onClick={e => { e.stopPropagation(); removeSection(section.id); }}
          >
            <FaTrash size={9} />
          </button>
          <span style={{ color: '#aaa' }}>{isExpanded ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 pt-2" style={{ background: '#fff8f8' }}>
          <div className="d-flex flex-column gap-2">
            {section.lines.map((line, i) => (
              <div key={i} className="d-flex gap-2 align-items-center">
                <input
                  className="form-control form-control-sm rounded-3"
                  style={{ fontSize: 13 }}
                  value={line}
                  onChange={e => updateLine(section.id, i, e.target.value)}
                  placeholder={`Line ${i + 1}`}
                />
                {section.lines.length > 1 && (
                  <button
                    className="btn p-0 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 26, height: 26, borderRadius: '50%', background: '#fee2e2', border: 'none', color: '#dc2626' }}
                    onClick={() => removeLine(section.id, i)}
                  >
                    <FaTrash size={9} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            className="btn btn-sm rounded-pill mt-2 d-flex align-items-center gap-1"
            style={{ fontSize: 12, background: '#f3f4f6', border: 'none', color: '#555' }}
            onClick={() => addLine(section.id)}
          >
            <FaPlus size={9} /> Add Line
          </button>
        </div>
      )}
    </div>
  );
};

// ── Color Dot ──────────────────────────────────────────────────────────────
const ColorDot = ({ bg, selected, onClick, isInput, onInputChange }: { bg: string; selected: boolean; onClick?: () => void; isInput?: boolean; onInputChange?: (v: string) => void }) => (
  <div
    onClick={onClick}
    style={{
      width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', flexShrink: 0,
      background: bg, position: 'relative', overflow: isInput ? 'hidden' : 'visible',
      boxShadow: selected ? '0 0 0 3px white, 0 0 0 5px #dc2626' : '0 1px 4px rgba(0,0,0,0.15)',
      transition: 'box-shadow 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
  >
    {selected && !isInput && <FaCheck size={10} color="white" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />}
    {isInput && <input type="color" style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', width: '100%', height: '100%' }} onChange={e => onInputChange?.(e.target.value)} />}
  </div>
);

// ── Main Page ──────────────────────────────────────────────────────────────
const InvitationGenerator = () => {
  // const { eventId } = useParams();
  const navigate = useNavigate();
  const { Get } = useApi();
  const cardRef = useRef<HTMLDivElement>(null);

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hostName, setHostName] = useState('Your Family');
  const [template, setTemplate] = useState<TemplateType>('chandlo');
  const [templateStyle, setTemplateStyle] = useState<TemplateStyle>('festive');
  const [sections, setSections] = useState<Section[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState('');
  const [textColor, setTextColor] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'style'>('preview');
const location = useLocation();
const eventId = location.state?.eventId;
 useEffect(() => {
  if (!eventId) {
    navigate("/events");
    return;
  }
  fetchEventData();
}, [eventId]);

  const fetchEventData = async () => {
    try {
      const response = await Get('events', eventId);
      setEventData(response);
      const tmpl: TemplateType = response.event_type === 'marriage' ? 'marriage' : 'chandlo';
      setTemplate(tmpl);
      setTemplateStyle(tmpl === 'marriage' ? 'floral' : 'festive');
      setBgColor('');
      setTextColor('');
      setSections(buildDefaultSections(response));
    } catch {
      toast.error('Failed to load event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const updateLabel   = (id: string, label: string) => setSections(p => p.map(s => s.id === id ? { ...s, label } : s));
  const updateLine    = (id: string, i: number, v: string) => setSections(p => p.map(s => s.id === id ? { ...s, lines: s.lines.map((l, idx) => idx === i ? v : l) } : s));
  const addLine       = (id: string) => setSections(p => p.map(s => s.id === id ? { ...s, lines: [...s.lines, ''] } : s));
  const removeLine    = (id: string, i: number) => setSections(p => p.map(s => s.id === id ? { ...s, lines: s.lines.filter((_, idx) => idx !== i) } : s));
  const removeSection = (id: string) => { setSections(p => p.filter(s => s.id !== id)); if (expandedId === id) setExpandedId(null); };

  const addSection = (type: Section['type']) => {
    if (!eventData) return;
    const def = AVAILABLE_SECTIONS.find(s => s.type === type)!;
    const newId = `${type}-${Date.now()}`;
    setSections(p => [...p, { id: newId, type, label: def.label, emoji: def.emoji, lines: def.defaultLines(eventData) }]);
    setExpandedId(newId);
    setActiveTab('edit');
  };

  const addCustomSection = () => {
    const newId = `custom-${Date.now()}`;
    setSections(p => [...p, { id: newId, type: 'message', label: 'New Section', emoji: '✏️', lines: ['Write something here...'] }]);
    setExpandedId(newId);
    setActiveTab('edit');
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (over && active.id !== over.id)
      setSections(p => arrayMove(p, p.findIndex(s => s.id === active.id), p.findIndex(s => s.id === over.id)));
  };

  const downloadAsImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 2 });
      const link = document.createElement('a');
      link.download = `${eventData?.name || 'invitation'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Image downloaded!');
    } catch { toast.error('Failed to download image'); }
  };

  const shareToWhatsApp = () => {
    if (!eventData) return;
    const text = sections.map(s => `${s.emoji} *${s.label}*\n${s.lines.join('\n')}`).join('\n\n');
    window.open(`https://wa.me/?text=${encodeURIComponent(`*${hostName}* cordially invites you\n\n${text}`)}`, '_blank');
  };

  if (loading) return <AppLayout title="Invitation" showBack><div className="text-center py-5"><div className="spinner-border text-danger" role="status" /></div></AppLayout>;
  if (!eventData) return <AppLayout title="Invitation" showBack><div className="text-center py-5"><p>Event not found</p></div></AppLayout>;

  const BG_COLORS = [
    { label: 'Default', color: '' },
    { label: 'Crimson', color: 'linear-gradient(145deg,#991b1b,#dc2626,#f87171)' },
    { label: 'Royal',   color: 'linear-gradient(145deg,#1e3a8a,#2563eb,#60a5fa)' },
    { label: 'Forest',  color: 'linear-gradient(145deg,#14532d,#16a34a,#4ade80)' },
    { label: 'Violet',  color: 'linear-gradient(145deg,#4c1d95,#7c3aed,#a78bfa)' },
    { label: 'Slate',   color: 'linear-gradient(145deg,#0f172a,#1e293b,#475569)' },
    { label: 'Amber',   color: 'linear-gradient(145deg,#78350f,#d97706,#fbbf24)' },
  ];

  const TEXT_COLORS = [
    { label: 'White',  color: 'white' },
    { label: 'Cream',  color: '#fef9c3' },
    { label: 'Gold',   color: '#fbbf24' },
    { label: 'Silver', color: '#e2e8f0' },
    { label: 'Black',  color: '#1a1a1a' },
  ];

  const tabStyle = (tab: string): React.CSSProperties => ({
    flex: 1, padding: '10px 0', border: 'none', borderRadius: 12,
    background: activeTab === tab ? '#dc2626' : 'transparent',
    color: activeTab === tab ? 'white' : '#666',
    fontWeight: activeTab === tab ? '600' : '400',
    fontSize: 13, cursor: 'pointer', transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  });

  const currentTs = TEMPLATE_STYLES[templateStyle];

  return (
    <AppLayout title="Invitation Generator" showBack>
      <div className="pb-5" style={{ maxWidth: 480, margin: '0 auto' }}>

        {/* Template Type Toggle */}
        <div className="d-flex gap-2 mb-3 px-2">
          {(['chandlo', 'marriage'] as TemplateType[]).map(t => (
            <button key={t} onClick={() => { setTemplate(t); setTemplateStyle(t === 'marriage' ? 'floral' : 'festive'); setBgColor(''); setTextColor(''); }}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: template === t ? (t === 'chandlo' ? 'linear-gradient(135deg,#f97316,#fbbf24)' : 'linear-gradient(135deg,#be185d,#f472b6)') : '#f3f4f6',
                color: template === t ? 'white' : '#555', fontWeight: template === t ? '700' : '500',
                fontSize: 14, boxShadow: template === t ? '0 4px 12px rgba(0,0,0,0.2)' : 'none', transition: 'all 0.25s',
              }}
            >
              {t === 'chandlo' ? '🪔 Chandlo' : '💒 Marriage'}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="mx-2 mb-3 p-1 rounded-4 d-flex" style={{ background: '#f3f4f6' }}>
          <button style={tabStyle('preview')} onClick={() => setActiveTab('preview')}><FaEye size={12} /> Preview</button>
          <button style={tabStyle('edit')} onClick={() => setActiveTab('edit')}><FaEdit size={12} /> Edit</button>
          <button style={tabStyle('style')} onClick={() => setActiveTab('style')}><FaPalette size={12} /> Style</button>
        </div>

        {/* ── PREVIEW TAB ── */}
        {activeTab === 'preview' && (
          <div className="d-flex flex-column align-items-center px-2">
            <div className="print-area">
              <InvitationCard ref={cardRef} hostName={hostName} template={template} templateStyle={templateStyle} sections={sections} bgColor={bgColor || undefined} textColor={textColor || undefined} />
            </div>
            <p className="text-muted small mt-3 text-center" style={{ fontSize: 12 }}>
              ✏️ Edit tab to modify content &nbsp;•&nbsp; 🎨 Style tab to change design
            </p>
          </div>
        )}

        {/* ── EDIT TAB ── */}
        {activeTab === 'edit' && (
          <div className="px-2">
            <div className="mb-3">
              <label className="form-label small fw-semibold text-muted" style={{ letterSpacing: 0.5 }}>HOST / FAMILY NAME</label>
              <input type="text" className="form-control rounded-4" value={hostName} onChange={e => setHostName(e.target.value)} placeholder="e.g. The Sharma Family" />
            </div>

            <label className="form-label small fw-semibold text-muted mb-2" style={{ letterSpacing: 0.5 }}>
              SECTIONS <span className="fw-normal">(drag ⠿ to reorder)</span>
            </label>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div className="d-flex flex-column gap-2 mb-3">
                  {sections.map(section => (
                    <SortableSection key={section.id} section={section} expandedId={expandedId} setExpandedId={setExpandedId} updateLabel={updateLabel} updateLine={updateLine} addLine={addLine} removeLine={removeLine} removeSection={removeSection} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <div className="rounded-4 p-3 mb-3" style={{ background: '#f9fafb', border: '1px dashed #e5e7eb' }}>
              <p className="small fw-semibold text-muted mb-2" style={{ letterSpacing: 0.5 }}>➕ ADD SECTION</p>
              <div className="d-flex flex-wrap gap-2">
                {AVAILABLE_SECTIONS.map(s => (
                  <button key={s.type} onClick={() => addSection(s.type)}
                    style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid #e5e7eb', background: 'white', fontSize: 12, cursor: 'pointer', color: '#444' }}>
                    {s.emoji} {s.label}
                  </button>
                ))}
                <button onClick={addCustomSection}
                  style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid #bfdbfe', background: '#eff6ff', fontSize: 12, cursor: 'pointer', color: '#2563eb' }}>
                  ✏️ Custom
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STYLE TAB ── */}
        {activeTab === 'style' && (
          <div className="px-2">

            {/* Mini card preview */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, height: 200, overflow: 'hidden' }}>
              <div style={{ transform: 'scale(0.38)', transformOrigin: 'top center' }}>
                <InvitationCard hostName={hostName} template={template} templateStyle={templateStyle} sections={sections} bgColor={bgColor || undefined} textColor={textColor || undefined} />
              </div>
            </div>

            {/* Template Style Selector */}
            <div className="rounded-4 p-3 mb-3" style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p className="small fw-semibold text-muted mb-3" style={{ letterSpacing: 0.5 }}>🖼️ TEMPLATE STYLE</p>
              <div className="d-flex flex-wrap gap-2">
                {(Object.entries(TEMPLATE_STYLES) as [TemplateStyle, typeof TEMPLATE_STYLES[TemplateStyle]][]).map(([key, ts]) => (
                  <button
                    key={key}
                    onClick={() => { setTemplateStyle(key); setBgColor(''); setTextColor(''); }}
                    style={{
                      padding: '8px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12,
                      background: templateStyle === key ? currentTs.bg : '#f3f4f6',
                      color: templateStyle === key ? (currentTs.textColor === 'white' ? 'white' : currentTs.textColor) : '#444',
                      fontWeight: templateStyle === key ? '600' : '400',
                      boxShadow: templateStyle === key ? '0 3px 10px rgba(0,0,0,0.2)' : 'none',
                      transition: 'all 0.2s',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    {templateStyle === key && <FaCheck size={9} />}
                    {ts.name}
                  </button>
                ))}
              </div>
            </div>

            {/* BG Color */}
            <div className="rounded-4 p-3 mb-3" style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p className="small fw-semibold text-muted mb-3" style={{ letterSpacing: 0.5 }}>🎨 CUSTOM BACKGROUND</p>
              <div className="d-flex flex-wrap gap-3">
                {BG_COLORS.map(opt => (
                  <ColorDot key={opt.label} bg={opt.color || currentTs.bg} selected={bgColor === opt.color} onClick={() => setBgColor(opt.color)} />
                ))}
                <ColorDot bg="conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" selected={false} isInput onInputChange={setBgColor} />
              </div>
            </div>

            {/* Text Color */}
            <div className="rounded-4 p-3" style={{ background: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <p className="small fw-semibold text-muted mb-3" style={{ letterSpacing: 0.5 }}>🔤 CUSTOM TEXT COLOR</p>
              <div className="d-flex flex-wrap gap-3">
                {TEXT_COLORS.map(opt => (
                  <ColorDot key={opt.label} bg={opt.color} selected={textColor === opt.color} onClick={() => setTextColor(opt.color)} />
                ))}
                <ColorDot bg="conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" selected={false} isInput onInputChange={setTextColor} />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="px-2 mt-4">
          <div className="d-flex gap-2">
            <button onClick={downloadAsImage}
              style={{ flex: 1, padding: '13px 0', borderRadius: 14, border: '1.5px solid #e5e7eb', background: 'white', color: '#444', fontWeight: '600', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <FaImage size={13} /> Image
            </button>
            <button onClick={shareToWhatsApp}
              style={{ flex: 1, padding: '13px 0', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#25d366,#128c7e)', color: 'white', fontWeight: '600', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <FaWhatsapp size={13} /> WhatsApp
            </button>
            <button onClick={() => window.print()}
              style={{ flex: 1, padding: '13px 0', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#dc2626,#b91c1c)', color: 'white', fontWeight: '600', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <FaPrint size={13} /> Print
            </button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default InvitationGenerator;
