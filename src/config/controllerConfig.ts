export type ControlPreset = "default" | "alt";

export interface ControlScheme {
  jump: string;
  attack: string;
}

const presets: Record<ControlPreset, ControlScheme> = {
  default: {
    jump: "W",
    attack: "SPACE",
  },
  alt: {
    jump: "SPACE",
    attack: "MOUSE_LEFT_BUTTON",
  },
};

let activePreset: ControlPreset =
  (localStorage.getItem("controlPreset") as ControlPreset) || "default";

export function getActivePreset(): ControlScheme {
  return presets[activePreset];
}

export function getAllPresets(): Record<ControlPreset, ControlScheme> {
  return presets;
}

export function setActivePreset(preset: ControlPreset) {
  activePreset = preset;
  localStorage.setItem("controlPreset", preset);
}
