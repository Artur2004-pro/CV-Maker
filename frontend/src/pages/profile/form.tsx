import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import type { UserProfile } from "../../types";
import { useEditor } from "../../editor/EditorContext";

export default function ProfileForm() {
  const navigate = useNavigate();
  const { setProfile } = useEditor();
  const [profileInfo, setProfileInfo] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    skills: [""],
    languages: [{ name: "", level: "" }],
    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        school: "",
        degree: "",
        startDate: "",
        endDate: "",
      },
    ],
  });
  const onSubmit = (data: UserProfile) => {
    setProfile(data);
    navigate("/templates", { state: { profile: data } });
  };
  return (
    <div className="bg-zinc-50 p-6">
      <Card className="max-w-4xl mx-auto p-6 space-y-8">
        {/* PERSONAL */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Personal Info</h2>
          <Input placeholder="First name" />
          <Input placeholder="Last name" />
          <Input placeholder="Email" />
          <Input placeholder="Phone" />
          <Input placeholder="Location (City, Country)" />
          <Textarea placeholder="Professional summary" rows={4} />
        </section>

        {/* SKILLS */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          {profileInfo.skills.map((_, i) => (
            <Input key={i} placeholder={`Skill ${i + 1}`} />
          ))}
          <Button
            className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            onClick={() =>
              setProfileInfo({
                ...profileInfo,
                skills: [...profileInfo.skills, ""],
              })
            }
          >
            {" "}
            + Add skill
          </Button>
        </section>

        {/* SKILLS */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          {profileInfo.skills.map((_, i) => (
            <Input key={i} placeholder={`Skill ${i + 1}`} />
          ))}
          <Button
            className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            onClick={() =>
              setProfileInfo({
                ...profileInfo,
                skills: [...profileInfo.skills, ""],
              })
            }
          >
            + Add skill
          </Button>
        </section>

        {/* EXPERIENCE */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Experience</h2>

          {profileInfo.experience.map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Input placeholder="Company" />
              <Input placeholder="Position" />
              <div className="flex gap-2">
                <Input type="month" />
                <Input type="month" />
              </div>
              <Textarea placeholder="Description" rows={3} />
            </Card>
          ))}

          <Button
            className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            onClick={() =>
              setProfileInfo({
                ...profileInfo,
                experience: [
                  ...profileInfo.experience,
                  {
                    company: "",
                    position: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  },
                ],
              })
            }
          >
            + Add experience
          </Button>
        </section>

        {/* EDUCATION */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Education</h2>

          {profileInfo.education.map((_, i) => (
            <Card key={i} className="p-4 space-y-3">
              <Input placeholder="School / University" />
              <Input placeholder="Degree" />
              <div className="flex gap-2">
                <Input type="month" />
                <Input type="month" />
              </div>
            </Card>
          ))}

          <Button
            className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            onClick={() =>
              setProfileInfo({
                ...profileInfo,
                education: [
                  ...profileInfo.education,
                  {
                    school: "",
                    degree: "",
                    startDate: "",
                    endDate: "",
                  },
                ],
              })
            }
          >
            + Add education
          </Button>
        </section>

        {/* LANGUAGES */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Languages</h2>

          {profileInfo.languages.map((_, i) => (
            <div key={i} className="flex gap-2">
              <Input placeholder="Language" />
              <Input placeholder="Level (A2 / B1 / Native)" />
            </div>
          ))}

          <Button
            className="border border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
            onClick={() =>
              setProfileInfo({
                ...profileInfo,
                languages: [...profileInfo.languages, { name: "", level: "" }],
              })
            }
          >
            + Add language
          </Button>
        </section>

        {/* NEXT */}
        <Button className="w-full" onClick={() => onSubmit(profileInfo)}>
          Choose template
        </Button>
      </Card>
    </div>
  );
}
