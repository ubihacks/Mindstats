import { Navigate, createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";




const browserRouter = createBrowserRouter([
	{
		path: '/',
		element: <LandingPage />,
	},
	{
		path: '*',
		element: <Navigate to="/404" replace />,
	},
]);

export default browserRouter;