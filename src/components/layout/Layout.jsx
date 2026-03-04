import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

export default function Layout() {
    const location = useLocation();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div style={{
                display: 'flex',
                marginTop: '64px',
                flex: 1,
            }}>
                <Sidebar />
                <main style={{
                    flex: 1,
                    padding: '32px',
                    maxWidth: '100%',
                    overflow: 'auto',
                }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
