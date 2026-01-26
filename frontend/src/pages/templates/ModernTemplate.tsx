import { type UserProfile } from "../../types";

export default function ModernTemplate({
  data,
  editable = false,
  onChange,
}: {
  data: UserProfile;
  editable?: boolean;
  onChange?: (newData: UserProfile) => void;
}) {
  const updateField = (key: keyof UserProfile, value: any) => {
    if (onChange) onChange({ ...data, [key]: value });
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg font-sans text-gray-800">
      <header className="border-b pb-4 mb-4">
        {editable ? (
          <>
            <input
              className="text-3xl font-bold w-full border-b"
              value={data.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="First Name"
            />
            <input
              className="text-3xl font-bold w-full border-b mt-1"
              value={data.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Last Name"
            />
          </>
        ) : (
          <h1 className="text-3xl font-bold">
            {data.firstName} {data.lastName}
          </h1>
        )}
        <p className="text-sm mt-1">
          {data.email} | {data.phone}
        </p>
      </header>

      <section className="mb-4">
        <h2 className="font-semibold mb-1">Summary</h2>
        {editable ? (
          <textarea
            value={data.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            className="w-full border p-2 rounded"
          />
        ) : (
          <p>{data.summary}</p>
        )}
      </section>

      <section className="mb-4">
        <h2 className="font-semibold mb-1">Skills</h2>
        {editable ? (
          <div className="flex flex-col gap-2">
            {data.skills.map((skill, idx) => (
              <input
                key={idx}
                value={skill}
                onChange={(e) => {
                  const newSkills = [...data.skills];
                  newSkills[idx] = e.target.value;
                  updateField("skills", newSkills);
                }}
                className="border p-1 rounded"
                placeholder={`Skill ${idx + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={() => updateField("skills", [...data.skills, ""])}
              className="mt-2 text-sm text-blue-500"
            >
              + Add Skill
            </button>
          </div>
        ) : (
          <ul className="list-disc ml-5">
            {data.skills.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        )}
      </section>

      {data.education && (
        <section>
          <h2 className="font-semibold mb-1">Education</h2>
          <p>{data.education}</p>
        </section>
      )}
    </div>
  );
}
