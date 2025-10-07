import { forwardRef } from "react";
import type { CVData } from "../types/cv";

type CVPreviewProps = {
  data: CVData;
};

const CVPreview = forwardRef<HTMLDivElement, CVPreviewProps>(({ data }, ref) => {
  const {
    personal: { fullName, role, email, phone, location, website, linkedin, photo },
    summary,
    experiences,
    educations,
    skills
  } = data;

  const contactLine = [location, email, phone].filter(Boolean).join(" • ");
  const linksLine = [website, linkedin].filter(Boolean).join(" • ");

  return (
    <div ref={ref} className="preview">
      <header className="preview-header">
        <div className="preview-details">
          <h1>{fullName || "Nome Cognome"}</h1>
          <h2>{role || "Ruolo professionale"}</h2>
          <p>{contactLine || "Inserisci i tuoi contatti"}</p>
          {linksLine ? <p>{linksLine}</p> : null}
        </div>
        {photo ? (
          <div className="preview-photo">
            <img src={photo} alt={`Foto profilo di ${fullName || "utente"}`} />
          </div>
        ) : null}
      </header>

      <section className="preview-section">
        <h3>Profilo</h3>
        <p>{summary || "Descrivi brevemente la tua esperienza e le tue ambizioni professionali."}</p>
      </section>

      {experiences.length ? (
        <section className="preview-section">
          <h3>Esperienze</h3>
          {experiences.map((experience) => {
            const subtitleLine = [experience.subtitle, experience.location]
              .filter(Boolean)
              .join(" • ");
            const periodLine = [experience.startDate, experience.endDate].filter(Boolean).join(" – ");

            return (
              <div key={experience.id} className="preview-entry">
                <h4>{experience.title || "Ruolo"}</h4>
                <span>{subtitleLine || "Azienda"}</span>
                <div>{periodLine || "Periodo"}</div>
                {experience.description ? <p>{experience.description}</p> : null}
              </div>
            );
          })}
        </section>
      ) : null}

      {educations.length ? (
        <section className="preview-section">
          <h3>Formazione</h3>
          {educations.map((education) => {
            const subtitleLine = [education.subtitle, education.grade]
              .filter(Boolean)
              .join(" • ");
            const periodLine = [education.startDate, education.endDate].filter(Boolean).join(" – ");

            return (
              <div key={education.id} className="preview-entry">
                <h4>{education.title || "Percorso di studi"}</h4>
                <span>{subtitleLine || "Istituto"}</span>
                <div>{periodLine || "Periodo"}</div>
                {education.description ? <p>{education.description}</p> : null}
              </div>
            );
          })}
        </section>
      ) : null}

      {skills.length ? (
        <section className="preview-section">
          <h3>Competenze</h3>
          <div className="skill-list">
            {skills.map((skill) => (
              <span key={skill.id} className="skill-pill">
                {skill.name || "Competenza"} <small>{skill.level}</small>
              </span>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
});

CVPreview.displayName = "CVPreview";

export default CVPreview;
