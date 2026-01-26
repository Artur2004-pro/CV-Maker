import { useNavigate, useLocation } from "react-router-dom";
import { templates } from "./index";

export function TemplateGallery() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const profile = state?.profile;

  return (
    <div className="p-10 grid grid-cols-2 gap-4">
      {Object.entries(templates).map(([id, Template]: any) => (
        <div key={id} className="border p-4 rounded hover:shadow-md">
          <h3 className="font-semibold">{id}</h3>
          <button
            className="mt-2 w-full border py-1 rounded hover:bg-zinc-100"
            onClick={() =>
              navigate(`/editor/${id}`, { state: { profile, templateId: id } })
            }
          >
            Choose
          </button>
        </div>
      ))}
    </div>
  );
}
