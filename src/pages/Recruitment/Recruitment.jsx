import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Briefcase, Users, FileText, Plus, X, Search, List, Columns } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import ApplicationPipeline from './ApplicationPipeline';
import { fetchJobs, fetchApplications, createJob, updateAppStatus } from '../../store/recruitmentSlice';

const STATUS_MAP = { DRAFT: { label: 'Taslak', badge: 'warning' }, ACTIVE: { label: 'Aktif', badge: 'success' }, CLOSED: { label: 'Kapandı', badge: 'danger' } };

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } };

export default function Recruitment() {
    const dispatch = useDispatch();
    const { jobs, applications, loading } = useSelector(s => s.recruitment);
    const { departments } = useSelector(s => s.organization);
    const [tab, setTab] = useState('jobs');
    const [showModal, setShowModal] = useState(false);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({ title: '', departmentId: '', description: '', requirements: '', status: 'DRAFT', closingDate: '' });

    useEffect(() => {
        dispatch(fetchJobs());
        dispatch(fetchApplications());
        // Also load departments for the form selector
        if (departments.length === 0) {
            import('../../store/organizationSlice').then(m => dispatch(m.fetchDepartments()));
        }
    }, [dispatch]);

    const filtered = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || (j.departmentName && j.departmentName.toLowerCase().includes(search.toLowerCase())));

    const handleCreate = (e) => {
        e.preventDefault();
        dispatch(createJob({ ...form, departmentId: Number(form.departmentId), closingDate: form.closingDate || null })).then(() => {
            setShowModal(false);
            setForm({ title: '', departmentId: '', description: '', requirements: '', status: 'DRAFT', closingDate: '' });
        });
    };

    const handleStatusUpdate = (appId, status) => {
        dispatch(updateAppStatus({ id: appId, status })).then(() => dispatch(fetchApplications()));
    };

    const stats = [
        { label: 'Toplam İlan', value: jobs.length, icon: Briefcase, color: '#3b82f6' },
        { label: 'Aktif İlan', value: jobs.filter(j => j.status === 'ACTIVE').length, icon: FileText, color: '#10b981' },
        { label: 'Toplam Başvuru', value: applications.length, icon: Users, color: '#8b5cf6' },
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>İşe Alım</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>İlan yönetimi ve başvuru takibi</p>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} className="btn-primary" style={{ gap: '6px' }}>
                    <Plus size={16} /> Yeni İlan
                </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {stats.map(s => {
                    const Icon = s.icon; return (
                        <GlassCard key={s.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: '4px' }}>{s.label}</p>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{s.value}</span>
                                </div>
                                <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}><Icon size={18} /></div>
                            </div>
                        </GlassCard>
                    );
                })}
            </motion.div>

            {/* Tabs */}
            <motion.div variants={itemVariants} style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'var(--glass-bg)', borderRadius: 'var(--radius-sm)', padding: '4px', border: '1px solid var(--glass-border)', width: 'fit-content' }}>
                {[{ id: 'jobs', label: 'İlanlar', icon: List }, { id: 'pipeline', label: 'Başvuru Pipeline', icon: Columns }].map(t => {
                    const Icon = t.icon;
                    return <button key={t.id} onClick={() => setTab(t.id)} style={{
                        display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', border: 'none',
                        background: tab === t.id ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                        color: tab === t.id ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                        fontSize: '0.82rem', fontWeight: tab === t.id ? 500 : 400, cursor: 'pointer',
                    }}><Icon size={14} />{t.label}</button>;
                })}
            </motion.div>

            {/* Content */}
            {tab === 'jobs' ? (
                <>
                    <motion.div variants={itemVariants} style={{ marginBottom: '16px' }}>
                        <div style={{ position: 'relative', maxWidth: '320px' }}>
                            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="İlan ara..."
                                style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.82rem', outline: 'none' }} />
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {loading ? <p style={{ color: 'var(--color-text-muted)', padding: '32px', textAlign: 'center' }}>Yükleniyor...</p> :
                            filtered.map(job => (
                                <GlassCard key={job.id} hoverable>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{job.title}</h3>
                                                <Badge status={STATUS_MAP[job.status]?.badge || 'info'}>{STATUS_MAP[job.status]?.label}</Badge>
                                            </div>
                                            {job.description && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>{job.description}</p>}
                                            <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                                                {job.departmentName && <span>🏢 {job.departmentName}</span>}
                                                <span>📋 {job.applicationCount} başvuru</span>
                                                {job.closingDate && <span>📅 {job.closingDate}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                    </motion.div>
                </>
            ) : (
                <ApplicationPipeline applications={applications} loading={loading} onStatusUpdate={handleStatusUpdate} />
            )}

            {/* Create Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowModal(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()}
                        className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '28px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>Yeni İş İlanı</h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>İlan Başlığı *</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }} />
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Departman *</label>
                                <select value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })} required
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }}>
                                    <option value="">Seçin</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Açıklama</label>
                                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }} />
                            </div>
                            <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Gereksinimler</label>
                                <textarea value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} rows={3}
                                    style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Durum</label>
                                    <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }}>
                                        <option value="DRAFT">Taslak</option>
                                        <option value="ACTIVE">Aktif</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: '5px' }}>Kapanış Tarihi</label>
                                    <input type="date" value={form.closingDate} onChange={e => setForm({ ...form, closingDate: e.target.value })}
                                        style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.85rem', outline: 'none' }} />
                                </div>
                            </div>
                            <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="btn-primary" style={{ width: '100%', padding: '11px' }}>
                                <Plus size={16} /> İlan Oluştur
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
