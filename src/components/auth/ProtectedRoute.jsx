import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { token, user } = useSelector((state) => state.auth);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
