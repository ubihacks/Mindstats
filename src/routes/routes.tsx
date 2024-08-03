import { Navigate, createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AssessmentPage from "../pages/AssessmentPage";
import About from "../pages/About";




const browserRouter = createBrowserRouter([
	{
		path: '/',
		element: <LandingPage />,
	},
	{
		path: '/assessment',
		element: <AssessmentPage />,
	},
	{
		path: '/about',
		element: <About />,
	},
	{
		path: '*',
		element: <Navigate to="/404" replace />,
	},
]);

export default browserRouter;