export interface QualityGateEvaluation {
  canPublish: boolean;
  totalRules: number;
  satisfiedCount: number;
  rules: {
    title: boolean;
    summary: boolean;
    coverImage: boolean;
    technologies: boolean;
    links: boolean;
  };
  missingRules: string[];
}

export function evaluateQualityGate(project: {
  title?: string | null;
  summary?: string | null;
  coverImageKey?: string | null;
  technologies?: unknown[];
  liveUrl?: string | null;
  repoUrl?: string | null;
}): QualityGateEvaluation {
  const hasTitle = Boolean(project.title && project.title.trim().length > 0);
  const hasSummary = Boolean(
    project.summary &&
      project.summary.trim().length > 0 &&
      project.summary.length <= 140
  );
  const hasCoverImage = Boolean(
    project.coverImageKey && project.coverImageKey.trim().length > 0
  );
  const hasTechnologies = Boolean(
    project.technologies && project.technologies.length >= 1
  );
  const hasLinks = Boolean(
    (project.liveUrl && project.liveUrl.trim().length > 0) ||
      (project.repoUrl && project.repoUrl.trim().length > 0)
  );

  const missingRules: string[] = [];
  if (!hasTitle) missingRules.push("Project Title");
  if (!hasSummary) missingRules.push("Summary (up to 140 characters)");
  if (!hasCoverImage) missingRules.push("16:9 Cover Image");
  if (!hasTechnologies) missingRules.push("At least one technology tag");
  if (!hasLinks) missingRules.push("At least one of Live URL or Repository URL");

  const rules = {
    title: hasTitle,
    summary: hasSummary,
    coverImage: hasCoverImage,
    technologies: hasTechnologies,
    links: hasLinks,
  };

  const satisfiedCount = Object.values(rules).filter(Boolean).length;
  const canPublish = satisfiedCount === 5;

  return {
    canPublish,
    totalRules: 5,
    satisfiedCount,
    rules,
    missingRules,
  };
}
