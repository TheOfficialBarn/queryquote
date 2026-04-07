/**
 * PROLOGUE COMMENT
 * Last updated: 2026-04-06
 * Shared section heading content keeps the landing page consistent while letting each section focus on its own layout and data.
 */

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionIntro({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionIntroProps) {
  const alignmentClass =
    align === "center"
      ? "mx-auto max-w-3xl items-center text-center"
      : "max-w-3xl";

  return (
    <div className={`flex flex-col gap-4 ${alignmentClass}`}>
      <p className="section-kicker">{eyebrow}</p>
      <div className="space-y-4">
        <h2 className="[font-family:var(--font-display)] text-3xl leading-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
