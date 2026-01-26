import { useLocation } from "react-router-dom";
import { useEditor } from "../../editor/EditorContext";
import { templates } from "./index";
import { Canvas } from "../../components/canvas/Canvas";
import { Button } from "../../components/ui/button";

export default function TemplateEditor() {
  const { state } = useLocation();
  const { profile: initialProfile, templateId } = state as {
    profile: any;
    templateId: keyof typeof templates;
  };
  const { profile, setProfile } = useEditor();
  const Template = templates[templateId];

  const exportPDF = () => alert("Call backend to generate PDF");

  return (
    <div className="p-6">
      <Canvas />
      <Template
        data={profile || initialProfile}
        editable={true}
        onChange={setProfile}
      />
      <div className="mt-4 flex justify-end">
        <Button onClick={exportPDF}>Save / Export PDF</Button>
      </div>
    </div>
  );
}
