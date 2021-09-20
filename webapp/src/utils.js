import {
  PLATE_TYPES,
  BAR_WEIGHT,
  UNIT,
  LBS_IN_KGS,
} from './constants';

export const roundToNearest = (number, step) => Math.round(number/step) * step;

export const toPlates = (number, unit) => {
  const platesAvailable = unit === UNIT.KG ? PLATE_TYPES.KG : PLATE_TYPES.LB;
  const barWeight = unit === UNIT.KG ? BAR_WEIGHT.KG : BAR_WEIGHT.LB;
  if (number < barWeight) return 'less than bar';

  const platesStrings = [];
  let left = (number - barWeight)/2;
  for (let i = 0; i < platesAvailable.length && left !== 0; i += 1) {
    const candidatePlateWeight = platesAvailable[i];
    const numPlates = Math.floor(left / candidatePlateWeight);
    if (numPlates) platesStrings.push(`${numPlates} x ${candidatePlateWeight}${unit}`);
    left -= numPlates * candidatePlateWeight;
  }

  return platesStrings.join('\n');
};

const rnd = val => Math.round((val + Number.EPSILON) * 100) / 100;

export const convertValue = (value, oldUnit, newUnit) => {
  if (oldUnit === UNIT.KG) {
    if (!isNaN(parseFloat(value))) return parseFloat(rnd(parseFloat(value) * LBS_IN_KGS).toFixed(2));
    return value;
  } else {
    if (!isNaN(parseFloat(value))) return parseFloat(rnd(parseFloat(value) / LBS_IN_KGS).toFixed(2));
    return value;
  }
};
