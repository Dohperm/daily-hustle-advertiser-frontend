import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout/Layout";
import { useEffect } from "react";
// Page imports
import ViewCampaign from "./pages/Tasks/ViewCampaign";
import AllCampaigns from "./pages/Tasks/AllCampaigns";
import AdvertiserDashboard from "./pages/Dashboard/AdvertiserDashboard";
import MyCampaigns from "./pages/Tasks/MyCampaigns";
import CampaignSubmissions from "./pages/Tasks/CampaignSubmissions";
import QuickSignup from "./pages/auth/Signup/signup";
import Login from "./pages/auth/Login/login";
import KYCForm from "./pages/auth/Kyc/kyc";
import ForgotPassword from "./pages/auth/ForgotPassword/forgotPassword";
import Onboarding from "./pages/auth/Onboarding/onboarding";
import OnboardingProtectedRoute from "./components/OnboardingProtectedRoute";
import GlobalSpinner from "./components/GlobalSpinner";
import { useLoading } from "./context/LoadingContext";
import NewCampaign from "./pages/Tasks/NewCampaign";
import CampaignTypes from "./pages/Tasks/CampaignTypes";
import Trainings from "./pages/Training/Trainings";
import AdvertiserWallet from "./pages/Wallet/AdvertiserWallet";
import AdvertiserSettings from "./pages/Settings/AdvertiserSettings";
import AdvertiserSupport from "./pages/Support/AdvertiserSupport";
import Leaderboard from "./pages/Leaderboard/Leaderboard";
import Plans from "./pages/Plans/Plans";
import AdvertiserNotifications from "./pages/Notifications/AdvertiserNotifications";
import PaymentCallback from "./pages/Wallet/PaymentCallback";
import LandingPage from "./pages/Landing/LandingPage";

// Protected Route Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
}

function HomeRoute() {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

// ✅ LOGOUT COMPONENT
function Logout() {
  useEffect(() => {
    // Clear all localStorage
    // localStorage.clear();

    // Or if you want to be specific:
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("userData");

    // Redirect to login
    window.location.href = "/login";
  }, []);

  return null; // Don't render anything
}

export default function App() {
  const { isLoading } = useLoading();

  return (
    <>
      <GlobalSpinner isLoading={isLoading} />
      <Routes>
      {/* ✅ HOME/LANDING PAGE */}
      <Route path="/" element={<HomeRoute />} />

      {/* ✅ AUTH ROUTES - NO LAYOUT */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<QuickSignup />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/kyc" element={<KYCForm />} />

      {/* ✅ LOGOUT ROUTE - CLEARS STORAGE & REDIRECTS */}
      <Route path="/logout" element={<Logout />} />

      {/* ✅ APP ROUTES - WITH LAYOUT */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<OnboardingProtectedRoute><AdvertiserDashboard /></OnboardingProtectedRoute>} />
        <Route path="/jobs/my-campaigns" element={<MyCampaigns />} />
        <Route path="/campaigns" element={<OnboardingProtectedRoute><CampaignTypes /></OnboardingProtectedRoute>} />
        <Route path="/tasks/new-campaign" element={<NewCampaign />} />
        <Route path="/jobs/new" element={<NewCampaign />} />
        <Route path="/jobs/allcampaigns" element={<AllCampaigns />} />
        <Route path="/campaign-submissions/:taskId" element={<CampaignSubmissions />} />
        <Route path="/wallet" element={<AdvertiserWallet />} />
        <Route path="/wallet/payment/callback" element={<PaymentCallback />} />
        <Route path="/viewcampaign/:param" element={<ViewCampaign />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/training" element={<Trainings />} />
        <Route path="/notifications" element={<AdvertiserNotifications />} />
        <Route path="/settings" element={<AdvertiserSettings />} />
        <Route path="/support" element={<AdvertiserSupport />} />
      </Route>
      </Routes>
    </>
  );
}
