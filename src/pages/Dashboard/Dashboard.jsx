import { motion } from 'framer-motion';
import {
    Users,
    Briefcase,
    Calendar,
    FolderKanban,
    Building2,
    Target,
    Award,
    TrendingUp,
    ArrowUpRight,
    Clock,
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

/* ─── Mock Data ─── */
const stats = [
    { label: 'Toplam Çalışan', value: '248', change: '+12', icon: Users, color: '#3b82f6' },
    { label: 'Açık Pozisyon', value: '14', change: '+3', icon: Briefcase, color: '#8b5cf6' },
    { label: 'Bekleyen İzin', value: '7', change: '-2', icon: Calendar, color: '#f59e0b' },
    { label: 'Aktif Proje', value: '5', change: '+1', icon: FolderKanban, color: '#10b981' },
];

const modules = [
    {
        title: 'Organizasyon',
        description: 'Departman, şube ve hiyerarşi yönetimi. Org Chart görünümü.',
        icon: Building2,
        color: '#3b82f6',
        path: '/organization',
        status: 'Aktif',
    },
    {
        title: 'Yetenek Yönetimi',
        description: 'Projeler, testler, ağırlıklı puanlama ve 9-Box Grid sistemi.',
        icon: Target,
        color: '#8b5cf6',
        path: '/talent',
        status: 'Aktif',
    },
    {
        title: 'İşe Alma',
        description: 'İlan yönetimi, AI destekli CV tarama ve mülakat takibi.',
        icon: Briefcase,
        color: '#ec4899',
        path: '/recruitment',
        status: 'Yakında',
    },
    {
        title: 'Performans & Ödül',
        description: 'İzin talepleri, performans değerlendirme ve ödüllendirme.',
        icon: Award,
        color: '#f59e0b',
        path: '/performance',
        status: 'Aktif',
    },
    {
        title: 'Çalışan Paneli',
        description: 'Görev takibi, test çözme, izin ve terfi talepleri.',
        icon: Users,
        color: '#10b981',
        path: '/employees',
        status: 'Aktif',
    },
    {
        title: 'Raporlar & Analitik',
        description: 'Departman bazlı istatistikler ve performans trendleri.',
        icon: TrendingUp,
        color: '#06b6d4',
        path: '/reports',
        status: 'Yakında',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

/* ─── Dashboard Page ─── */
export default function Dashboard() {
    const now = new Date();
    const greeting = now.getHours() < 12 ? 'Günaydın' : now.getHours() < 18 ? 'İyi Günler' : 'İyi Akşamlar';
    const dateStr = now.toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
            {/* ─── HERO SECTION ─── */}
            <motion.section
                variants={itemVariants}
                style={{
                    position: 'relative',
                    padding: '40px 36px',
                    borderRadius: 'var(--radius-xl)',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.06) 50%, rgba(6, 182, 212, 0.04) 100%)',
                    border: '1px solid var(--color-border)',
                    marginBottom: '32px',
                    overflow: 'hidden',
                }}
            >
                {/* Background Orbs */}
                <div className="glow-orb" style={{
                    width: '300px', height: '300px',
                    background: '#3b82f6',
                    top: '-100px', right: '-50px'
                }} />
                <div className="glow-orb" style={{
                    width: '200px', height: '200px',
                    background: '#8b5cf6',
                    bottom: '-80px', left: '20%'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Clock size={14} style={{ color: 'var(--color-text-muted)' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{dateStr}</span>
                    </div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        marginBottom: '8px',
                        color: 'var(--color-text-primary)',
                    }}>
                        {greeting}, <span className="gradient-text">İK Yöneticisi</span> 👋
                    </h1>
                    <p style={{
                        fontSize: '0.95rem',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '520px',
                        lineHeight: 1.7,
                    }}>
                        İnsan Kaynakları Dijitalleştirme Sisteminize hoş geldiniz.
                        Tüm İK süreçlerinizi tek bir platformdan yönetin.
                    </p>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                        <Button variant="primary">Hızlı İşlem</Button>
                        <Button variant="secondary">Raporları Gör</Button>
                    </div>
                </div>
            </motion.section>

            {/* ─── STAT CARDS ─── */}
            <motion.div
                variants={itemVariants}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px',
                }}
            >
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <GlassCard key={stat.label} hoverable>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--color-text-muted)',
                                        marginBottom: '6px',
                                        fontWeight: 500,
                                    }}>
                                        {stat.label}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                        <span style={{
                                            fontSize: '1.8rem',
                                            fontWeight: 700,
                                            letterSpacing: '-0.03em',
                                            color: 'var(--color-text-primary)',
                                        }}>
                                            {stat.value}
                                        </span>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            color: stat.change.startsWith('+') ? '#10b981' : '#f59e0b',
                                        }}>
                                            {stat.change}
                                        </span>
                                    </div>
                                </div>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: 'var(--radius-md)',
                                    background: `${stat.color}15`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: stat.color,
                                }}>
                                    <Icon size={20} />
                                </div>
                            </div>
                        </GlassCard>
                    );
                })}
            </motion.div>

            {/* ─── MODULE SECTION HEADER ─── */}
            <motion.div variants={itemVariants} style={{ marginBottom: '20px' }}>
                <h2 style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    color: 'var(--color-text-primary)',
                    letterSpacing: '-0.01em',
                }}>
                    Modüller
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    Tüm İK süreçlerinize hızlı erişim
                </p>
            </motion.div>

            {/* ─── FEATURE CARDS (Modules) ─── */}
            <motion.div
                variants={itemVariants}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '16px',
                    marginBottom: '48px',
                }}
            >
                {modules.map((mod) => {
                    const Icon = mod.icon;
                    return (
                        <GlassCard key={mod.title} hoverable>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: 'var(--radius-md)',
                                    background: `${mod.color}12`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: mod.color,
                                }}>
                                    <Icon size={22} />
                                </div>
                                <Badge status={mod.status === 'Aktif' ? 'success' : 'warning'}>
                                    {mod.status}
                                </Badge>
                            </div>
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: 'var(--color-text-primary)',
                                marginBottom: '8px',
                            }}>
                                {mod.title}
                            </h3>
                            <p style={{
                                fontSize: '0.83rem',
                                color: 'var(--color-text-secondary)',
                                lineHeight: 1.6,
                                marginBottom: '16px',
                            }}>
                                {mod.description}
                            </p>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: 'var(--color-text-accent)',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}>
                                <span>Modüle Git</span>
                                <ArrowUpRight size={14} />
                            </div>
                        </GlassCard>
                    );
                })}
            </motion.div>
        </motion.div>
    );
}
