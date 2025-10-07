import { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

const FormSection = ({ title, description, actions, children }: FormSectionProps) => {
  return (
    <section className="form-section">
      <header className="form-section__header">
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
        {actions}
      </header>
      {children}
    </section>
  );
};

export default FormSection;
