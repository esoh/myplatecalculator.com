export const UNIT = {
  KG: "KG",
  LB: "LB",
};

export const PLATE_TYPES = {
  [UNIT.KG]: [25, 20, 15, 10, 5, 2.5, 1.25],
  [UNIT.LB]: [45, 35, 25, 10, 5, 2.5, 1.25],
};

export const BAR_WEIGHT = {
  [UNIT.KG]: 20,
  [UNIT.LB]: 45,
};

export const LBS_IN_KGS = 2.20462262;

export const JUMP_CONFIG = {
  MATT_GARY: {
    key: "MATT_GARY",
    label: 'Matt Gary',
    values: [0.475, 0.60, 0.725, 0.825, 0.9, 0.96, 1],
  },
  DEFAULT: {
    key: "DEFAULT",
    label: '10% increments',
    values: [0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 1],
  },
}

export const LOCAL_STORAGE = {
  CONFIG: "CONFIG",
};
