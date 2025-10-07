import { ChangeEvent, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CVPreview from "./components/CVPreview";
import FormSection from "./components/FormSection";
import type {
  CVData,
  Education,
  Experience,
  PersonalDetails,
  Skill
} from "./types/cv";
import { createId } from "./utils/id";
import "./App.css";

const createEmptyPersonalDetails = (): PersonalDetails => ({
  fullName: "",
  role: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin: "",
  photo: ""
});

const createExperience = (): Experience => ({
  id: createId(),
  title: "",
  subtitle: "",
  location: "",
  startDate: "",
  endDate: "",
  description: ""
});

const createEducation = (): Education => ({
  id: createId(),
  title: "",
  subtitle: "",
  grade: "",
  startDate: "",
  endDate: "",
  description: ""
});

const createSkill = (): Skill => ({
  id: createId(),
  name: "",
  level: "Intermediate"
});

const initialData: CVData = {
  personal: createEmptyPersonalDetails(),
  summary: "",
  experiences: [createExperience()],
  educations: [createEducation()],
  skills: [createSkill()]
};

type ExperienceField = Exclude<keyof Experience, "id">;
type EducationField = Exclude<keyof Education, "id">;
type PersonalField = keyof PersonalDetails;
type SkillField = Exclude<keyof Skill, "id">;

function App() {
  const [cvData, setCvData] = useState<CVData>(initialData);
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const handlePersonalChange = (field: PersonalField, value: string) => {
    setCvData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCvData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            photo: reader.result
          }
        }));
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handlePhotoRemove = () => {
    setCvData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        photo: ""
      }
    }));
  };

  const handleSummaryChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setCvData((prev) => ({
      ...prev,
      summary: value
    }));
  };

  const handleExperienceChange = (id: string, field: ExperienceField, value: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((experience) =>
        experience.id === id
          ? {
              ...experience,
              [field]: value
            }
          : experience
      )
    }));
  };

  const handleEducationChange = (id: string, field: EducationField, value: string) => {
    setCvData((prev) => ({
      ...prev,
      educations: prev.educations.map((education) =>
        education.id === id
          ? {
              ...education,
              [field]: value
            }
          : education
      )
    }));
  };

  const handleSkillChange = (id: string, field: SkillField, value: string) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.id === id
          ? {
              ...skill,
              [field]: field === "level" ? (value as Skill["level"]) : value
            }
          : skill
      )
    }));
  };

  const addExperience = () => {
    setCvData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, createExperience()]
    }));
  };

  const removeExperience = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((experience) => experience.id !== id)
    }));
  };

  const addEducation = () => {
    setCvData((prev) => ({
      ...prev,
      educations: [...prev.educations, createEducation()]
    }));
  };

  const removeEducation = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      educations: prev.educations.filter((education) => education.id !== id)
    }));
  };

  const addSkill = () => {
    setCvData((prev) => ({
      ...prev,
      skills: [...prev.skills, createSkill()]
    }));
  };

  const removeSkill = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id)
    }));
  };

  const exportAsPDF = async () => {
    if (!previewRef.current) {
      return;
    }

    try {
      setIsExporting(true);
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: "#111827",
        scale: 2,
        useCORS: true
      });
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imageData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save("cv.pdf");
    } catch (error) {
      console.error("Errore durante l'esportazione del PDF", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="app">
      <div className="forms">
        <div className="actions-bar">
          <button
            type="button"
            className="button primary"
            onClick={exportAsPDF}
            disabled={isExporting}
          >
            {isExporting ? "Esportazione..." : "Esporta PDF"}
          </button>
        </div>
        <FormSection
          title="Dati personali"
          description="Queste informazioni saranno mostrate nella testata del CV."
        >
          <div className="fields-grid two-columns">
            <div className="field">
              <label htmlFor="fullName">Nome e cognome</label>
              <input
                id="fullName"
                placeholder="Nome Cognome"
                value={cvData.personal.fullName}
                onChange={(event) => handlePersonalChange("fullName", event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="role">Ruolo</label>
              <input
                id="role"
                placeholder="Ruolo professionale"
                value={cvData.personal.role}
                onChange={(event) => handlePersonalChange("role", event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="nome@azienda.com"
                value={cvData.personal.email}
                onChange={(event) => handlePersonalChange("email", event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Telefono</label>
              <input
                id="phone"
                placeholder="+39 000 000 0000"
                value={cvData.personal.phone}
                onChange={(event) => handlePersonalChange("phone", event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="location">Località</label>
              <input
                id="location"
                placeholder="Città, Paese"
                value={cvData.personal.location}
                onChange={(event) => handlePersonalChange("location", event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="website">Sito web / Portfolio</label>
              <input
                id="website"
                placeholder="https://portfolio.com"
                value={cvData.personal.website}
                onChange={(event) => handlePersonalChange("website", event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="linkedin">LinkedIn</label>
              <input
                id="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={cvData.personal.linkedin}
                onChange={(event) => handlePersonalChange("linkedin", event.target.value)}
              />
            </div>
            <div className="field photo-field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="photo">Foto profilo</label>
              <div className="photo-field__content">
                <div className="photo-field__preview">
                  {cvData.personal.photo ? (
                    <img src={cvData.personal.photo} alt="Anteprima foto profilo" />
                  ) : (
                    <span>Nessuna foto</span>
                  )}
                </div>
                <div className="photo-field__actions">
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                  {cvData.personal.photo ? (
                    <button
                      type="button"
                      className="button danger"
                      onClick={handlePhotoRemove}
                    >
                      Rimuovi foto
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Profilo"
          description="Riassumi le tue competenze e il tuo valore in poche frasi."
        >
          <div className="field">
            <label htmlFor="summary">Descrizione</label>
            <textarea
              id="summary"
              value={cvData.summary}
              onChange={handleSummaryChange}
              placeholder="Breve descrizione delle tue competenze chiave, risultati ottenuti e obiettivi professionali."
            />
          </div>
        </FormSection>

        <FormSection
          title="Esperienze"
          description="Aggiungi i ruoli più rilevanti, partendo dal più recente."
          actions={
            <button type="button" className="button primary" onClick={addExperience}>
              + Esperienza
            </button>
          }
        >
          {cvData.experiences.length === 0 ? (
            <p>Nessuna esperienza aggiunta. Clicca su &quot;+ Esperienza&quot; per iniziare.</p>
          ) : null}
          {cvData.experiences.map((experience) => (
            <div key={experience.id} className="item-card">
              <div className="fields-grid two-columns">
                <div className="field">
                  <label htmlFor={`exp-title-${experience.id}`}>Ruolo</label>
                  <input
                    id={`exp-title-${experience.id}`}
                    value={experience.title}
                    onChange={(event) =>
                      handleExperienceChange(experience.id, "title", event.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor={`exp-subtitle-${experience.id}`}>Azienda</label>
                  <input
                    id={`exp-subtitle-${experience.id}`}
                    value={experience.subtitle ?? ""}
                    onChange={(event) =>
                      handleExperienceChange(experience.id, "subtitle", event.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor={`exp-location-${experience.id}`}>Località</label>
                  <input
                    id={`exp-location-${experience.id}`}
                    value={experience.location ?? ""}
                    onChange={(event) =>
                      handleExperienceChange(experience.id, "location", event.target.value)
                    }
                  />
                </div>
                <div className="fields-grid two-columns" style={{ gridColumn: "1 / -1" }}>
                  <div className="field">
                    <label htmlFor={`exp-start-${experience.id}`}>Data inizio</label>
                    <input
                      id={`exp-start-${experience.id}`}
                      type="month"
                      value={experience.startDate ?? ""}
                      onChange={(event) =>
                        handleExperienceChange(experience.id, "startDate", event.target.value)
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`exp-end-${experience.id}`}>Data fine</label>
                    <input
                      id={`exp-end-${experience.id}`}
                      type="month"
                      value={experience.endDate ?? ""}
                      onChange={(event) =>
                        handleExperienceChange(experience.id, "endDate", event.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor={`exp-description-${experience.id}`}>Descrizione</label>
                  <textarea
                    id={`exp-description-${experience.id}`}
                    value={experience.description ?? ""}
                    onChange={(event) =>
                      handleExperienceChange(experience.id, "description", event.target.value)
                    }
                  />
                </div>
              </div>
              <div className="card-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={() =>
                    handleExperienceChange(
                      experience.id,
                      "description",
                      "• Risultato chiave o progetto di successo\n• Impatto misurabile o responsabilità principale"
                    )
                  }
                >
                  Suggerimento descrizione
                </button>
                <button
                  type="button"
                  className="button danger"
                  onClick={() => removeExperience(experience.id)}
                >
                  Elimina esperienza
                </button>
              </div>
            </div>
          ))}
        </FormSection>

        <FormSection
          title="Formazione"
          description="Inserisci i titoli di studio o corsi più significativi."
          actions={
            <button type="button" className="button primary" onClick={addEducation}>
              + Formazione
            </button>
          }
        >
          {cvData.educations.length === 0 ? (
            <p>Nessun percorso formativo aggiunto finora.</p>
          ) : null}
          {cvData.educations.map((education) => (
            <div key={education.id} className="item-card">
              <div className="fields-grid two-columns">
                <div className="field">
                  <label htmlFor={`edu-title-${education.id}`}>Titolo</label>
                  <input
                    id={`edu-title-${education.id}`}
                    value={education.title}
                    onChange={(event) =>
                      handleEducationChange(education.id, "title", event.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor={`edu-subtitle-${education.id}`}>Istituto</label>
                  <input
                    id={`edu-subtitle-${education.id}`}
                    value={education.subtitle ?? ""}
                    onChange={(event) =>
                      handleEducationChange(education.id, "subtitle", event.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor={`edu-grade-${education.id}`}>Valutazione</label>
                  <input
                    id={`edu-grade-${education.id}`}
                    value={education.grade ?? ""}
                    onChange={(event) =>
                      handleEducationChange(education.id, "grade", event.target.value)
                    }
                  />
                </div>
                <div className="fields-grid two-columns" style={{ gridColumn: "1 / -1" }}>
                  <div className="field">
                    <label htmlFor={`edu-start-${education.id}`}>Data inizio</label>
                    <input
                      id={`edu-start-${education.id}`}
                      type="month"
                      value={education.startDate ?? ""}
                      onChange={(event) =>
                        handleEducationChange(education.id, "startDate", event.target.value)
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor={`edu-end-${education.id}`}>Data fine</label>
                    <input
                      id={`edu-end-${education.id}`}
                      type="month"
                      value={education.endDate ?? ""}
                      onChange={(event) =>
                        handleEducationChange(education.id, "endDate", event.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="field" style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor={`edu-description-${education.id}`}>Descrizione</label>
                  <textarea
                    id={`edu-description-${education.id}`}
                    value={education.description ?? ""}
                    onChange={(event) =>
                      handleEducationChange(education.id, "description", event.target.value)
                    }
                  />
                </div>
              </div>
              <div className="card-actions">
                <button
                  type="button"
                  className="button danger"
                  onClick={() => removeEducation(education.id)}
                >
                  Elimina formazione
                </button>
              </div>
            </div>
          ))}
        </FormSection>

        <FormSection
          title="Competenze"
          description="Evidenzia le competenze tecniche e trasversali più rilevanti."
          actions={
            <button type="button" className="button primary" onClick={addSkill}>
              + Competenza
            </button>
          }
        >
          {cvData.skills.length === 0 ? (
            <p>Aggiungi una competenza per iniziare.</p>
          ) : null}
          {cvData.skills.map((skill) => (
            <div key={skill.id} className="item-card">
              <div className="fields-grid two-columns">
                <div className="field">
                  <label htmlFor={`skill-name-${skill.id}`}>Competenza</label>
                  <input
                    id={`skill-name-${skill.id}`}
                    placeholder="Comunicazione"
                    value={skill.name}
                    onChange={(event) =>
                      handleSkillChange(skill.id, "name", event.target.value)
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor={`skill-level-${skill.id}`}>Livello</label>
                  <select
                    id={`skill-level-${skill.id}`}
                    value={skill.level}
                    onChange={(event) =>
                      handleSkillChange(skill.id, "level", event.target.value)
                    }
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
              <div className="card-actions">
                <button
                  type="button"
                  className="button danger"
                  onClick={() => removeSkill(skill.id)}
                >
                  Elimina competenza
                </button>
              </div>
            </div>
          ))}
        </FormSection>
      </div>
      <CVPreview ref={previewRef} data={cvData} />
    </div>
  );
}

export default App;
