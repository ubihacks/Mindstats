import { Navigate, createBrowserRouter } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AssessmentPage from "../pages/AssessmentPage";
import AboutPage from "../pages/AboutPage";
import PageNotFound from "../pages/PageNotFound";
import PricingPage from "../pages/PricingPage";




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
		element: <AboutPage />,
	},
	{
		path: '/pricing',
		element: <PricingPage />,
	},
	{
		path: '/404',
		element: <PageNotFound />,
	},
	{
		path: '*',
		element: <Navigate to="/404" replace />,
	},
]);

export default browserRouter;