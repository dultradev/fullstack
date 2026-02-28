import Link from "next/link";
import type { Locale, ProjectItem } from "@/lib/types";
import { StaggerList } from "@/components/motion/stagger-list";

export function ProjectsSection({
  id,
  title,
  items,
  locale
}: Readonly<{
  id: string;
  title: string;
  items: ProjectItem[];
  locale: Locale;
}>) {
  const copy =
    locale === "pt-BR"
      ? {
          problem: "Problema",
          solution: "Solução",
          impact: "Impacto",
          button: "GitHub"
        }
      : {
          problem: "Problem",
          solution: "Solution",
          impact: "Impact",
          button: "GitHub"
        };

  return (
    <section id={id} className="section">
      <div className="container">
        <h2>{title}</h2>
        <StaggerList className="project-grid">
          {items.map((project) => (
            <article className="project-card" key={project.id}>
              <h3>{project.title}</h3>
              <p>
                <strong>{copy.problem}:</strong> {project.problem}
              </p>
              <p>
                <strong>{copy.solution}:</strong> {project.solution}
              </p>
              <p>
                <strong>{copy.impact}:</strong> {project.impact}
              </p>
              <div className="tag-list">
                {project.tech.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              <Link href={project.link} target="_blank" rel="noreferrer" className="button ghost">
                {copy.button}
              </Link>
              {project.visibilityNote ? <p className="note">{project.visibilityNote}</p> : null}
            </article>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
