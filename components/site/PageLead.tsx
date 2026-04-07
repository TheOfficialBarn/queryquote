/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This shared page lead keeps secondary pages visually consistent without forcing each route to rebuild the same heading and description wrapper.
 */

type PageLeadProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageLead({ eyebrow, title, description }: PageLeadProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10">
      <div className="panel rounded-[2rem] p-7 sm:p-9">
        <p className="section-kicker">{eyebrow}</p>
        <h2 className="mt-4 [font-family:var(--font-display)] text-4xl leading-tight text-foreground sm:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
