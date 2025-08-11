import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthContext";
import "./assets/theme/App.scss";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import PublicRoutes from "./routes/PublicRoutes";

function App() {
	return (
		<>
			<AuthProvider>
				<PublicRoutes />
				<Toaster position="top-center" />
			</AuthProvider>
		</>
	);
}

export default App;
