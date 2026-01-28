import { decryptData } from "@/utils/crypto";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
	const encryptedUser = localStorage.getItem("user");

	const user = encryptedUser ? decryptData(encryptedUser) : null;

	if (!user) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
