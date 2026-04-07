/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-07
 * This shared page lead keeps secondary pages visually consistent without forcing each route to rebuild the same heading and description wrapper, using Tailwind-only panel styling.
 */

type PageLeadProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageLead({ eyebrow, title, description }: PageLeadProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10">
      <div className="rounded-[2rem] border border-white/10 bg-neutral-900/85 p-7 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-9">
        <p className="text-[0.74rem] font-bold uppercase tracking-[0.28em] text-neutral-400">
          {eyebrow}
        </p>
        <h2 className="mt-4 [font-family:var(--font-fraunces)] text-4xl leading-tight text-neutral-100 sm:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-400 sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
