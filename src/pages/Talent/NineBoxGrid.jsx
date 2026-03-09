import { motion } from 'framer-motion';

const GRID_LABELS = {
    potential: ['Düşük', 'Orta', 'Yüksek'],
    performance: ['Düşük', 'Orta', 'Yüksek'],
};

const CELL_CONFIG = [
    // Row 3 (Potential=High, top)
    [{ label: 'Potansiyel Yıldız', bg: '#f59e0b20', border: '#f59e0b40', emoji: '💡', perf: [1, 2], pot: [4, 5] },
    { label: 'Yükselen Yıldız', bg: '#10b98120', border: '#10b98140', emoji: '📈', perf: [3], pot: [4, 5] },
    { label: 'Süperstar', bg: '#3b82f620', border: '#3b82f640', emoji: '⭐', perf: [4, 5], pot: [4, 5] }],
    // Row 2 (Potential=Mid, middle)
    [{ label: 'Düşük Performans', bg: '#ef444420', border: '#ef444440', emoji: '⚠️', perf: [1, 2], pot: [3] },
    { label: 'Temel Oyuncu', bg: '#64748b20', border: '#64748b40', emoji: '🎯', perf: [3], pot: [3] },
    { label: 'Yüksek Performans', bg: '#8b5cf620', border: '#8b5cf640', emoji: '🏆', perf: [4, 5], pot: [3] }],
    // Row 1 (Potential=Low, bottom)
    [{ label: 'Risk', bg: '#ef444430', border: '#ef444450', emoji: '🔴', perf: [1, 2], pot: [1, 2] },
    { label: 'Orta Oyuncu', bg: '#f59e0b15', border: '#f59e0b30', emoji: '📊', perf: [3], pot: [1, 2] },
    { label: 'Uzman', bg: '#06b6d420', border: '#06b6d440', emoji: '🔧', perf: [4, 5], pot: [1, 2] }],
];

function getCell(perf, pot) {
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            const cell = CELL_CONFIG[r][c];
            if (cell.perf.includes(perf) && cell.pot.includes(pot)) return { row: r, col: c };
        }
    }
    return { row: 1, col: 1 };
}

export default function NineBoxGrid({ data, loading }) {
    if (loading) return <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '40px' }}>Yükleniyor...</p>;

    // Group employees into cells
    const cells = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => []));
    (data || []).forEach(emp => {
        const { row, col } = getCell(emp.performanceScore, emp.potentialScore);
        cells[row][col].push(emp);
    });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '8px 0' }}>
            {/* Grid Container */}
            <div style={{ display: 'flex', gap: '0' }}>
                {/* Y-axis label */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingRight: '8px', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-accent)', letterSpacing: '0.1em' }}>POTANSİYEL →</span>
                </div>

                <div style={{ flex: 1 }}>
                    {/* Y-axis tick labels */}
                    <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: '0' }}>
                        <div />
                        {/* X-axis labels */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '4px' }}>
                            {GRID_LABELS.performance.map(l => (
                                <span key={l} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>{l}</span>
                            ))}
                        </div>
                    </div>

                    {/* Grid rows */}
                    {[0, 1, 2].map(row => (
                        <div key={row} style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: '0', marginBottom: '4px' }}>
                            {/* Y tick */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>
                                    {GRID_LABELS.potential[2 - row]}
                                </span>
                            </div>
                            {/* Cells */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                                {[0, 1, 2].map(col => {
                                    const config = CELL_CONFIG[row][col];
                                    const employees = cells[row][col];
                                    return (
                                        <motion.div
                                            key={`${row}-${col}`}
                                            whileHover={{ scale: 1.01 }}
                                            style={{
                                                padding: '14px 12px',
                                                borderRadius: 'var(--radius-sm)',
                                                background: config.bg,
                                                border: `1px solid ${config.border}`,
                                                minHeight: '110px',
                                                transition: 'all var(--transition-fast)',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                                                <span style={{ fontSize: '0.85rem' }}>{config.emoji}</span>
                                                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                                                    {config.label}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {employees.map(emp => (
                                                    <motion.div
                                                        key={emp.employeeId}
                                                        whileHover={{ scale: 1.15 }}
                                                        title={`${emp.firstName} ${emp.lastName}\n${emp.department || ''} · ${emp.title || ''}\nPerformans: ${emp.performanceScore}/5 · Potansiyel: ${emp.potentialScore}/5`}
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: 'var(--radius-full)',
                                                            background: 'linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary))',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.65rem',
                                                            fontWeight: 600,
                                                            color: '#fff',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        {emp.firstName?.[0]}{emp.lastName?.[0]}
                                                    </motion.div>
                                                ))}
                                                {employees.length === 0 && (
                                                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>—</span>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* X-axis label */}
                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-accent)', letterSpacing: '0.1em' }}>PERFORMANS →</span>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                {CELL_CONFIG.flat().map(c => (
                    <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                        <span>{c.emoji}</span>
                        <span>{c.label}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
