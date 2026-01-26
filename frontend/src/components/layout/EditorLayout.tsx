import { useLocation } from "react-router-dom";
import { Canvas } from "../canvas/Canvas";
import { templates } from "../../pages/templates";
import { useState } from "react";
import { type UserProfile } from "../../types";
import { Button } from "../../components/ui/button";

export function EditorLayout() {
  const { state } = useLocation();
  const { profile: initialProfile, templateId } = state;
  const Template = templates[templateId];
  const [profile, setProfile] = useState<UserProfile>(initialProfile);

  return (
    <div className="p-6">
      <Canvas>
        <Template data={profile} editable={true} onChange={setProfile} />
      </Canvas>
      <div className="mt-4 flex justify-end">
        <Button
          onClick={() => alert("Here you can call backend to save/export")}
        >
          Save / Export PDF
        </Button>
      </div>
    </div>
  );
}

export default EditorLayout;
