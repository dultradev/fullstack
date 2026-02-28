import ReactMarkdown from "react-markdown";
import { Reveal } from "@/components/motion/reveal";

export function RichTextSection({
  id,
  title,
  markdown
}: Readonly<{
  id: string;
  title: string;
  markdown: string;
}>) {
  return (
    <section id={id} className="section">
      <div className="container narrow">
        <Reveal>
          <h2>{title}</h2>
          <div className="markdown-body">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
