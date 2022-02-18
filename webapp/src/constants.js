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
  DEFAULT: {
    key: "DEFAULT",
    label: '10% increments',
    values: [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3],
  },
  MATT_GARY: {
    key: "MATT_GARY",
    label: 'Matt Gary Warmup %s',
    values: [0.96, 0.9, 0.825, 0.725, 0.60, 0.475],
  },
}

export const LOCAL_STORAGE = {
  CONFIG: "CONFIG",
  SMALLEST_LB_PLATE: "SMALLEST_LB_PLATE",
  SMALLEST_KG_PLATE: "SMALLEST_KG_PLATE",
  UNIT: "UNIT",
};

export const SMALLEST_PLATE_OPTS = [1.25, 2.5, 5];

export const DEFAULT_SMALLEST_LB_PLATE = 2.5;
export const DEFAULT_SMALLEST_KG_PLATE = 1.25;
