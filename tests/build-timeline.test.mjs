import test from 'node:test';
import assert from 'node:assert/strict';
import { buildState } from '../v3/build-timeline.mjs';

test('Neubau ends as a complete single-storey house, without garden extensions', () => {
  const state=buildState(.31);
  assert.equal(state.phase,0);
  assert.equal(state.walls,1);assert.equal(state.windows,1);
  assert.equal(state.roofY,1.52);assert.equal(state.floor,0);
  assert.equal(state.garageBase,0);assert.equal(state.pergolaBase,0);
});
test('Ausbau lifts the existing roof before the extra floor enters', () => {
  const lifted=buildState(.44);
  assert.equal(lifted.lift,1);assert.equal(lifted.floor,0);
  assert.ok(lifted.roofY>4.8);
  const inserted=buildState(.56);
  assert.equal(inserted.floor,1);assert.equal(inserted.upperX,0);
  assert.equal(inserted.upperY,1.57);assert.equal(inserted.reseat,0);
});
test('Roof remains above the inserted storey throughout Ausbau', () => {
  for(let p=.445;p<=.68;p+=.001){
    const s=buildState(p);
    assert.ok(s.roofY>=s.upperY+1.315-1e-6, `Roof clearance at ${p}`);
  }
  const completed=buildState(.67);
  assert.equal(completed.floor,1);
  assert.ok(Math.abs(completed.roofY-2.94)<1e-9);
  assert.equal(completed.garageBase,0);assert.equal(completed.pergolaPosts,0);
});
test('Garage and pergola are built in Zubau, with the house retained', () => {
  const garage=buildState(.82);
  assert.equal(garage.phase,2);assert.equal(garage.garageWalls,1);
  assert.equal(garage.pergolaPosts,0);
  const completed=buildState(1);
  for(const key of ['walls','windows','floor','garageBase','garageWalls','garageDoor','garageRoof','pergolaBase','pergolaPosts','pergolaBeams','pergolaSlats'])assert.equal(completed[key],1,key);
});
test('Scroll direction does not change a scene; each state can be revisited', () => {
  const forward=Array.from({length:101},(_,i)=>buildState(i/100));
  for(let i=100;i>=0;i--)assert.deepEqual(buildState(i/100),forward[i]);
  assert.deepEqual(buildState(-1),buildState(0));
  assert.deepEqual(buildState(2),buildState(1));
});
