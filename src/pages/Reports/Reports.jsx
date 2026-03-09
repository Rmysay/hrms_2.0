import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Users, Briefcase, Star, Award } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } };

function BarChartSimple({ data, title }) {
    const max = Math.max(...data.map(d => d.value), 1);
    return (
        <GlassCard>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '16px' }}>{title}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {data.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', width: '100px', flexShrink: 0, textAlign: 'right' }}>{d.label}</span>
                        <div style={{ flex: 1, height: '22px', background: 'rgba(148,163,184,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(d.value / max) * 100}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                style={{ height: '100%', background: `linear-gradient(90deg, ${d.color || '#3b82f6'}aa, ${d.color || '#3b82f6'})`, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '6px' }}
                            >
                                <span style={{ fontSize: '0.62rem', fontWeight: 600, color: '#fff' }}>{d.value}</span>
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}

function DonutChart({ segments, title, total }) {
    let cumulative = 0;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;

    return (
        <GlassCard>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '16px' }}>{title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <svg width="150" height="150" viewBox="0 0 150 150">
                    {segments.map((seg, i) => {
                        const pct = total > 0 ? seg.value / total : 0;
                        const dashLength = pct * circumference;
                        const offset = -cumulative * circumference + circumference * 0.25;
                        cumulative += pct;
                        return (
                            <motion.circle key={i} cx="75" cy="75" r={radius} fill="none" stroke={seg.color}
                                strokeWidth="16" strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                                strokeDashoffset={offset} strokeLinecap="round"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15, duration: 0.5 }}
                            />
                        );
                    })}
                    <text x="75" y="72" textAnchor="middle" style={{ fontSize: '1.4rem', fontWeight: 700, fill: 'var(--color-text-primary)' }}>{total}</text>
                    <text x="75" y="90" textAnchor="middle" style={{ fontSize: '0.6rem', fill: 'var(--color-text-muted)' }}>Toplam</text>
                </svg>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {segments.map((seg, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: seg.color }} />
                            <span style={{ color: 'var(--color-text-muted)' }}>{seg.label}</span>
                            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginLeft: 'auto' }}>{seg.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
}

export default function Reports() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const token = localStorage.getItem('ikds_token');
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const [jobs, apps, reviews, awards, skills, depts] = await Promise.all([
                    fetch('http://localhost:8080/api/recruitment/jobs', { headers }).then(r => r.json()).catch(() => []),
                    fetch('http://localhost:8080/api/recruitment/applications', { headers }).then(r => r.json()).catch(() => []),
                    fetch('http://localhost:8080/api/performance/reviews', { headers }).then(r => r.json()).catch(() => []),
                    fetch('http://localhost:8080/api/performance/awards', { headers }).then(r => r.json()).catch(() => []),
                    fetch('http://localhost:8080/api/skills', { headers }).then(r => r.json()).catch(() => []),
                    fetch('http://localhost:8080/api/departments', { headers }).then(r => r.json()).catch(() => []),
                ]);
                setData({ jobs, apps, reviews, awards, skills, depts });
            } catch (e) { console.error(e); }
            setLoading(false);
        }
        load();
    }, []);

    if (loading || !data) return <div style={{ display: 'flex', justifyContent: 'center', padding: '80px', color: 'var(--color-text-muted)' }}>Veriler yükleniyor...</div>;

    const activeJobs = data.jobs.filter(j => j.status === 'ACTIVE').length;
    const draftJobs = data.jobs.filter(j => j.status === 'DRAFT').length;
    const closedJobs = data.jobs.filter(j => j.status === 'CLOSED').length;

    const appByStatus = {};
    data.apps.forEach(a => { appByStatus[a.status] = (appByStatus[a.status] || 0) + 1; });

    const scoreDistribution = [0, 0, 0, 0, 0];
    data.reviews.forEach(r => { if (r.overallScore >= 1 && r.overallScore <= 5) scoreDistribution[r.overallScore - 1]++; });

    const skillsByCategory = {};
    data.skills.forEach(s => { skillsByCategory[s.category] = (skillsByCategory[s.category] || 0) + 1; });

    const stats = [
        { label: 'Departman', value: data.depts.length, icon: Users, color: '#3b82f6' },
        { label: 'Aktif İlan', value: activeJobs, icon: Briefcase, color: '#10b981' },
        { label: 'Başvuru', value: data.apps.length, icon: TrendingUp, color: '#8b5cf6' },
        { label: 'Ödül', value: data.awards.length, icon: Award, color: '#f59e0b' },
    ];

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <motion.div variants={itemVariants} style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>📊 Raporlar & Analitik</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>Tüm modüllerden toplanan veriler</p>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
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

            {/* Charts Grid */}
            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <DonutChart title="İlan Durumu" total={data.jobs.length} segments={[
                    { label: 'Aktif', value: activeJobs, color: '#10b981' },
                    { label: 'Taslak', value: draftJobs, color: '#f59e0b' },
                    { label: 'Kapandı', value: closedJobs, color: '#64748b' },
                ]} />

                <DonutChart title="Başvuru Pipeline" total={data.apps.length} segments={[
                    { label: 'Başvurdu', value: appByStatus['APPLIED'] || 0, color: '#64748b' },
                    { label: 'Ön Eleme', value: appByStatus['SCREENING'] || 0, color: '#3b82f6' },
                    { label: 'Mülakat', value: appByStatus['INTERVIEW'] || 0, color: '#f59e0b' },
                    { label: 'Teklif', value: appByStatus['OFFERED'] || 0, color: '#8b5cf6' },
                    { label: 'İşe Alındı', value: appByStatus['HIRED'] || 0, color: '#10b981' },
                    { label: 'Reddedildi', value: appByStatus['REJECTED'] || 0, color: '#ef4444' },
                ]} />
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
                <BarChartSimple title="Performans Puan Dağılımı" data={[
                    { label: '⭐ 1 — Yetersiz', value: scoreDistribution[0], color: '#ef4444' },
                    { label: '⭐ 2 — Gelişmeli', value: scoreDistribution[1], color: '#f59e0b' },
                    { label: '⭐ 3 — Yeterli', value: scoreDistribution[2], color: '#64748b' },
                    { label: '⭐ 4 — İyi', value: scoreDistribution[3], color: '#3b82f6' },
                    { label: '⭐ 5 — Mükemmel', value: scoreDistribution[4], color: '#10b981' },
                ]} />

                <BarChartSimple title="Yetkinlik Kategorileri" data={Object.entries(skillsByCategory).map(([k, v]) => ({
                    label: k === 'TECHNICAL' ? 'Teknik' : k === 'SOFT_SKILL' ? 'Davranışsal' : k === 'LEADERSHIP' ? 'Liderlik' : 'Alan Bilgisi',
                    value: v,
                    color: k === 'TECHNICAL' ? '#3b82f6' : k === 'SOFT_SKILL' ? '#10b981' : k === 'LEADERSHIP' ? '#8b5cf6' : '#f59e0b',
                }))} />
            </motion.div>
        </motion.div>
    );
}
