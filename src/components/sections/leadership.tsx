import type { LeadershipItem, Locale } from "@/lib/types";
import { formatMonthYear } from "@/lib/utils";
import { StaggerList } from "@/components/motion/stagger-list";

export function LeadershipSection({
  id,
  title,
  locale,
  items
}: Readonly<{
  id: string;
  title: string;
  locale: Locale;
  items: LeadershipItem[];
}>) {
  return (
    <section id={id} className="section">
      <div className="container">
        <h2>{title}</h2>
        <StaggerList className="card-grid">
          {items.map((item) => (
            <article className="card" key={item.id}>
              <div className="card-header">
                <h3>{item.title}</h3>
                <p>{item.org}</p>
                <span>{formatMonthYear(item.startDate, locale)}</span>
              </div>
              <ul>
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </StaggerList>
      </div>
    </section>
  );
}
