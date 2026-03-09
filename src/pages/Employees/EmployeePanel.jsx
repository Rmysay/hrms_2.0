import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Shield, Calendar, Building, Mail, Star, Award } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import employeeService from '../../services/employeeService';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } };

const ROLE_MAP = { ROLE_ADMIN: { label: 'Admin', badge: 'danger' }, ROLE_HR: { label: 'İK', badge: 'warning' }, ROLE_MANAGER: { label: 'Yönetici', badge: 'info' }, ROLE_EMPLOYEE: { label: 'Çalışan', badge: 'success' } };

export default function EmployeePanel() {
    const [employees, setEmployees] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedEmp, setSelectedEmp] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const [emps, revs, awds] = await Promise.all([
                    employeeService.getEmployees(),
                    fetch('http://localhost:8080/api/performance/reviews', { headers: { Authorization: `Bearer ${localStorage.getItem('ikds_token')}` } }).then(r => r.json()).catch(() => []),
                    fetch('http://localhost:8080/api/performance/awards', { headers: { Authorization: `Bearer ${localStorage.getItem('ikds_token')}` } }).then(r => r.json()).catch(() => []),
                ]);
                setEmployees(emps);
                setReviews(revs);
                setAwards(awds);
            } catch (e) { console.error(e); }
            setLoading(false);
        }
        load();
    }, []);

    const filtered = employees.filter(e =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        e.email?.toLowerCase().includes(search.toLowerCase()) ||
        e.department?.toLowerCase().includes(search.toLowerCase())
    );

    const getEmpReviews = (id) => reviews.filter(r => r.employeeId === id);
    const getEmpAwards = (id) => awards.filter(a => a.employeeId === id);

    const stats = [
        { label: 'Toplam Çalışan', value: employees.length, icon: Users, color: '#3b82f6' },
        { label: 'Departman', value: [...new Set(employees.map(e => e.department).filter(Boolean))].length, icon: Building, color: '#10b981' },
        { label: 'Değerlendirme', value: reviews.length, icon: Star, color: '#f59e0b' },
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <motion.div variants={itemVariants} style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>Çalışan Paneli</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Tüm çalışanların özet bilgileri</p>
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

            {/* Search */}
            <motion.div variants={itemVariants} style={{ marginBottom: '16px' }}>
                <div style={{ position: 'relative', maxWidth: '320px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Çalışan, e-posta veya departman ara..."
                        style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', background: 'rgba(148,163,184,0.04)', color: 'var(--color-text-primary)', fontSize: '0.82rem', outline: 'none' }} />
                </div>
            </motion.div>

            {/* Employee Grid */}
            {loading ? <p style={{ color: 'var(--color-text-muted)', padding: '32px', textAlign: 'center' }}>Yükleniyor...</p> :
                <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '12px' }}>
                    {filtered.map(emp => {
                        const empReviews = getEmpReviews(emp.id);
                        const empAwards = getEmpAwards(emp.id);
                        const avgScore = empReviews.length > 0 ? (empReviews.reduce((s, r) => s + r.overallScore, 0) / empReviews.length).toFixed(1) : null;
                        const roleInfo = emp.roles?.map(r => ROLE_MAP[r]).filter(Boolean) || [];
                        const isExpanded = selectedEmp === emp.id;

                        return (
                            <motion.div key={emp.id} layout>
                                <GlassCard hoverable>
                                    <div style={{ cursor: 'pointer' }} onClick={() => setSelectedEmp(isExpanded ? null : emp.id)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                            <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600, color: '#fff', flexShrink: 0 }}>
                                                {emp.firstName?.[0]}{emp.lastName?.[0]}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{emp.firstName} {emp.lastName}</h3>
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '3px' }}>
                                                    {roleInfo.map((r, i) => <Badge key={i} status={r.badge}>{r.label}</Badge>)}
                                                </div>
                                            </div>
                                            {avgScore && (
                                                <div style={{ textAlign: 'center' }}>
                                                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: Number(avgScore) >= 4 ? '#10b981' : Number(avgScore) >= 3 ? '#3b82f6' : '#f59e0b' }}>{avgScore}</div>
                                                    <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>puan</span>
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '14px', fontSize: '0.72rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={10} /> {emp.email}</span>
                                            {emp.department && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Building size={10} /> {emp.department}</span>}
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={10} /> {empReviews.length} değerlendirme</span>
                                            {empAwards.length > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Award size={10} /> {empAwards.length} ödül</span>}
                                        </div>
                                    </div>

                                    {/* Expanded detail */}
                                    {isExpanded && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--glass-border)' }}>
                                            {empReviews.length > 0 && (
                                                <div style={{ marginBottom: '10px' }}>
                                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>📋 Değerlendirmeler</h4>
                                                    {empReviews.map(r => (
                                                        <div key={r.id} style={{ padding: '6px 8px', marginBottom: '4px', borderRadius: '4px', background: 'rgba(148,163,184,0.04)', fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                                                            <span>{r.period} — {r.goals?.substring(0, 40)}...</span>
                                                            <span style={{ fontWeight: 600, color: r.overallScore >= 4 ? '#10b981' : '#3b82f6' }}>{r.overallScore}/5</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {empAwards.length > 0 && (
                                                <div>
                                                    <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>🏆 Ödüller</h4>
                                                    {empAwards.map(a => (
                                                        <div key={a.id} style={{ padding: '6px 8px', marginBottom: '4px', borderRadius: '4px', background: 'rgba(148,163,184,0.04)', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                                            {a.title} — {a.awardDate}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {empReviews.length === 0 && empAwards.length === 0 && (
                                                <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Henüz değerlendirme veya ödül yok.</p>
                                            )}
                                        </motion.div>
                                    )}
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </motion.div>}
        </motion.div>
    );
}
