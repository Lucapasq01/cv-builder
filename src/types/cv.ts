export type BaseItem = {
  id: string;
  title: string;
  subtitle?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type PersonalDetails = {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  photo: string;
};

export type Experience = BaseItem & {
  location?: string;
};

export type Education = BaseItem & {
  grade?: string;
};

export type Skill = {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
};

export type CVData = {
  personal: PersonalDetails;
  summary: string;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
};
