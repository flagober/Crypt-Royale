import test from 'node:test';
import assert from 'node:assert/strict';
import {updateCardSelection,reconcileCardSelection,cardSelectionLimit} from './shop-selection.js';
import {selectedCopies} from './shop.js';

test('quantity controls cap the combined choice at 50, release room after minus, and preserve inventory',()=>{
 const inventory={'bit-bug':70,'data-mouse':30},before=structuredClone(inventory);
 let selected=updateCardSelection({},inventory,'bit-bug',45);
 selected=updateCardSelection(selected,inventory,'data-mouse',30);
 assert.deepEqual(selected,{'bit-bug':45,'data-mouse':5});
 assert.equal(selectedCopies(selected),50);
 assert.equal(cardSelectionLimit(selected,inventory,'data-mouse'),5);
 selected=updateCardSelection(selected,inventory,'bit-bug',44);
 selected=updateCardSelection(selected,inventory,'data-mouse',6);
 assert.equal(selectedCopies(selected),50);
 assert.deepEqual(inventory,before);
});
test('quantity entry respects owned copies and excludes fractional, unknown or invalid quantities',()=>{
 const inventory={'bit-bug':1};
 assert.deepEqual(updateCardSelection({},inventory,'bit-bug',900),{'bit-bug':1});
 assert.deepEqual(updateCardSelection({'bit-bug':1},inventory,'bit-bug',-1),{});
 for(const value of [0.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.deepEqual(updateCardSelection({},inventory,'bit-bug',value),{});
 assert.deepEqual(updateCardSelection({},inventory,'unknown',1),{});
 assert.equal(cardSelectionLimit({},inventory,'unknown'),0);
});
test('an updated inventory removes unavailable choices without granting or spending copies',()=>{
 const selected={'bit-bug':30,'data-mouse':20,'unknown':1};
 const inventory={'bit-bug':2,'data-mouse':0};
 assert.deepEqual(reconcileCardSelection(selected,inventory),{'bit-bug':2});
 assert.deepEqual(reconcileCardSelection(selected,{}),{});
 assert.equal(selected['bit-bug'],30);
 assert.equal(inventory['bit-bug'],2);
});
