/**
 * Insert 'insert' 2-D array before 'before' key in 'map'
 * WARNING: THIS MUTATES THE ORIGINAL Map!
 * @param {Map} map - Map to insert into
 * @param {any} before - key to insert after
 * @param {[any, any]} insert - 2-element array for entry to insert
 * @returns {Map} - returns mutated 'map' passed as first argument
 */
function insertBeforeKey(map, before, insert){
  const [insertKey, insertValue] = insert;
  // Copy to temp Map before clearing
  const tmp = new Map(map);
  // Remove all entries, but keep the reference
  map.clear();
  // Iterate 'tmp' and copy entries back to original reference
  for (const [key, value] of tmp) {
    // If the current key matches 'before'...
    if (key === before) {
      // ...insert the new item
      map.set(insertKey, insertValue);
    }
    map.set(key, value);
  }
  // If item is not yet inserted (there's no key that matches 'before')...
  if (!map.has(insertKey)) {
    // Insert item at the end
    map.set(insertKey, insertValue);
  }
  // Return same Map reference that was passed to the function
  return map;
}

function tryIt() {
  const numbers = (new Array(99)).fill(0).map((val, i) => [i, i]);
  const numberMap = new Map(numbers);

  const modified = insertBeforeKey(numberMap, 9, ['hello', 'HELLO!']);

  console.log(modified);
  console.log('same reference?', modified.get(11) === numberMap.get(11));
}

tryIt();
