import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgotPassword";
import ProfileForm from "./pages/profile/form";
import TemplateGallery from "./pages/templates/templateGallery";
import { EditorLayout } from "./components/layout/EditorLayout";
import AppLayout from "./layout/AppLayout";
import TemplateEditor from "./pages/templates/TemplateEditor";

export const router = createBrowserRouter([
  // PUBLIC (no layout)
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/profile/form" /> },
      { path: "profile/form", element: <ProfileForm /> },
      {
        path: "/templates",
        element: (
          <TemplateEditor
            profileData={/* from state or context */}
            onSave={(data, template) => {
              // send to backend
              fetch("/api/cv/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data, template }),
              })
                .then((res) => res.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  window.open(url);
                });
            }}
          />
        ),
      },
      { path: "editor/:templateId", element: <EditorLayout /> },
    ],
  },
]);
