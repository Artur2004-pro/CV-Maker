import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { EditorProvider } from "./editor/EditorContext";
import { AppLayout } from "./layout/AppLayout";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ForgotPasswordPage from "./pages/auth/forgotPassword";
import { TemplateGallery } from "./pages/templates/templateGallery";
import TemplateEditor from "./pages/templates/TemplateEditor";
import ProfileForm from "./pages/profile/form";

export default function App() {
  return (
    <Router>
      <EditorProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route
            path="/profile/form"
            element={
              <AppLayout>
                <ProfileForm />
              </AppLayout>
            }
          />

          <Route
            path="/templates"
            element={
              <AppLayout>
                <TemplateGallery />
              </AppLayout>
            }
          />

          <Route
            path="/editor/:templateId"
            element={
              <AppLayout>
                <TemplateEditor />
              </AppLayout>
            }
          />
        </Routes>
      </EditorProvider>
    </Router>
  );
}
