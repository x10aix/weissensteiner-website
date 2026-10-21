// One continuous, reversible construction story. Coordinates are model units.
export const clamp = value => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
export function ramp(progress, start, end) {
  const t = clamp((progress - start) / (end - start));
  return t * t * (3 - 2 * t);
}
export function buildState(progress) {
  const p = clamp(progress);
  const walls = .13 + .87 * ramp(p, .015, .13);
  const windows = ramp(p, .10, .19);
  const firstRoof = ramp(p, .17, .28);
  const lift = ramp(p, .34, .43);
  const floor = ramp(p, .445, .555);
  const reseat = ramp(p, .575, .65);
  const roofY = 1.52 + 2.65 * (1 - firstRoof) + 3.35 * lift - 1.93 * reseat;
  const phase = p < .325 ? 0 : p < .68 ? 1 : 2;
  let step;
  if (phase === 0) step = p < .10 ? 'Fundament und Wände' : p < .19 ? 'Fenster und Räume' : p < .28 ? 'Das Dach schließt das Haus' : 'Der Neubau steht';
  if (phase === 1) step = p < .43 ? 'Das Dach hebt sich' : p < .555 ? 'Ein Geschoss kommt hinzu' : p < .65 ? 'Das Dach findet seinen neuen Platz' : 'Ein Stockwerk mehr';
  if (phase === 2) step = p < .82 ? 'Die Garage entsteht' : p < .975 ? 'Die Pergola wächst im Garten' : 'Platz für neue Möglichkeiten';
  return {
    progress:p, phase, step, walls, windows, firstRoof, lift, floor, reseat, roofY,
    upperX: 5.8 * (1 - floor), upperY: 1.57 + .38 * (1 - floor),
    garageBase: ramp(p, .69, .735), garageWalls: ramp(p, .73, .79),
    garageDoor: ramp(p, .77, .815), garageRoof: ramp(p, .795, .84),
    pergolaBase: ramp(p, .825, .865), pergolaPosts: ramp(p, .85, .91),
    pergolaBeams: ramp(p, .895, .94), pergolaSlats: ramp(p, .925, .975),
    gardenView:ramp(p, .675, .79),
    guides: 1 - firstRoof + lift * (1 - reseat)
  };
}
