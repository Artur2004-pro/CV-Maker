export type Skill = string;

export type Language = {
  name: string;
  level: string; // A1, B2, Native, etc.
};

export type Experience = {
  company: string;
  position: string;
  startDate: string; // YYYY-MM կամ ISO
  endDate: string; // YYYY-MM կամ "Present"
  description: string;
};

export type Education = {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;

  skills: Skill[];
  languages: Language[];
  experience: Experience[];
  education: Education[];
};
