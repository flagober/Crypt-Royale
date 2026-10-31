import test from 'node:test';import assert from 'node:assert/strict';
import {MAPS,mapById,setGameMap,DEFAULT_MAP_ID} from './maps.js';
import {createGame,stepGame} from './engine.js';
test('three initial maps have unique IDs, phase order and local art',()=>{
 assert.equal(new Set(MAPS.map(m=>m.id)).size,3);assert.deepEqual(MAPS.map(m=>m.phase),[1,2,3]);
 for(const map of MAPS)assert.match(map.file,/^\/assets\/maps\/[^/]+\.png$/);
 assert.equal(mapById('invalid').id,DEFAULT_MAP_ID);
});
test('changing scenery keeps a running match, seed, troops, clock and all resources',()=>{
 const game=createGame();stepGame(game,500);const before=structuredClone(game);
 assert(setGameMap(game,'copper-mines'));const {mapId,...actual}=game,{mapId:old,...expected}=before;assert.deepEqual(actual,expected);
 const current=structuredClone(game);assert.equal(setGameMap(game,'unknown'),false);assert.deepEqual(game,current);
});
