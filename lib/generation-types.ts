export const generationModes = ["workout", "program"] as const;

export type GenerationMode = (typeof generationModes)[number];
