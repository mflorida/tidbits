/**
 * Sort an array of objects based on value of 'prop' property.
 * (Case-sensitive with no type conversion to string)
 * @param objArr
 * @param prop
 * @returns {*}
 */
function sortObjectsSimple(objArr, prop) {
  return objArr.sort((a, b) => {
    const aValue = a[prop];
    const bValue = b[prop];
    return (aValue < bValue) ? -1 : (aValue > bValue) ? 1 : 0;
  });
}

/**
 * Case-insensitive *ascending* sorting of an array of objects
 * for `prop` property value of type 'string'
 */
function sortObjectsAsc(objArr, prop) {
  return objArr.sort((a, b) => {
    const aValue = a[prop];
    const bValue = b[prop];
    if (!stringable(aValue) || !stringable(bValue)) {
      return Infinity;
    }
    const A = String(aValue).toUpperCase();
    const B = String(bValue).toUpperCase();
    return (A < B) ? -1 : (A > B) ? 1 : 0;
  });
}


/**
 * Case-insensitive *descending* sorting of an array of objects
 * for `prop` property value of type 'string'
 */
function sortObjectsDesc(objArr, prop) {
  return objArr.sort((a, b) => {
    const aValue = a[prop];
    const bValue = b[prop];
    if (!stringable(aValue) || !stringable(bValue)) {
      return Infinity;
    }
    const A = String(aValue).toUpperCase();
    const B = String(bValue).toUpperCase();
    return (A > B) ? -1 : (A < B) ? 1 : 0;
  });
}


/**
 * Sort an array of objects by property
 * (sorts values as strings)
 * @param {Object[]} objArr - array of objects to sort
 * @param {string} prop - property to sort on
 * @param {boolean|'asc'|'desc'} [asc = true] - ascending? defaults to true
 * @returns {Object[]} - returns sorted array
 */
function sortObjects(objArr, prop, asc = true) {
  const less = (asc !== false && asc !== 'desc') ? -1 : 1;
  const more = (asc !== false && asc !== 'desc') ? 1 : -1;
  // const less = (desc !== 'desc' || desc !== false) ? -1 : 1;
  // const more = (desc !== 'desc' || desc !== false) ? 1 : -1;
  return objArr.sort((a, b) => {
    const aValue = a[prop];
    const bValue = b[prop];
    if (!stringable(aValue) || !stringable(bValue)) {
      return Infinity;
    }
    const A = String(aValue).toUpperCase();
    const B = String(bValue).toUpperCase();
    return (A < B) ? less : (A > B) ? more : 0;
  });
}


/**
 * Sort an array of objects by property
 * (sorts *numerically*)
 * @param {Object[]} objArr - array of objects to sort
 * @param {string} prop - property to sort on
 * @param {boolean|'asc'|'desc'} [asc = true] - ascending? defaults to true
 * @returns {Object[]} - returns sorted array
 */
function sortObjectsNumeric(objArr, prop, asc = true) {
  return objArr.filter(obj => stringable(obj[prop])).sort((a, b) => {
    const aValue = a[prop];
    const bValue = b[prop];
    const A = Number(aValue);
    const B = Number(bValue);
    return (asc !== false && asc !== 'desc') ? (A - B) : (B - A);
  });
}


function stringable(value) {
  return /string|number|boolean/.test(typeof value);
}


// EXAMPLES
const names = [
  { first: 'Bob', last: 'Robertson', age: 29 },
  { first: 'Fred', last: 'Fredrickson', age: 55 },
  { first: 'Rick', last: 'Richardson', age: 30 },
  { first: 'John', last: 'Johnson', age: 32 },
  { first: 'Nick', last: 'Nixon', age: 38 },
  { first: '~Object', last: {}, age: 0 },
  { first: '~Array', last: [], age: 0 },
  { first: '~Date', last: new Date(), age: 0 },
  { first: '~Set', last: new Set(), age: 0 },
  { first: '~Map', last: new Map(), age: 0 },
  { first: '~WeakMap', last: new WeakMap(), age: 0 },
];

const numbers = [
  { a: 100, b: 2, c: 3000 },
  { a: 1, b: new Date(), c: 300 },
  { a: 10, b: 2000, c: 3 },
  { a: 1, b: [], c: 300 },
  { a: 1000, b: 200, c: 30 },
  { a: 1, b: 20, c: 300 },
  { a: 1, b: {}, c: 300 },
];

// Sort strings (and numeric strings)
console.log(`sortObjectsSimple(names, 'first')\n`, sortObjectsSimple([...names], 'first'));
console.log(`sortObjectsAsc(names, 'last')\n`, sortObjectsAsc([...names], 'last'));
console.log(`sortObjects(names, 'last', 'asc')\n`, sortObjects([...names], 'last', 'asc'));
console.log(`sortObjectsDesc(names, 'last')\n`, sortObjectsDesc([...names], 'last'));
console.log(`sortObjects(names, 'last', false)\n`, sortObjects([...names], 'last', false));
console.log(`sortObjectsNumeric(names, 'age')\n`, sortObjects([...names], 'age'));

// Sort number values
console.log(`sortObjectsNumeric(numbers, 'b', true) / numeric\n`, sortObjectsNumeric([...numbers], 'b', true));
console.log(`sortObjectsNumeric(numbers, 'b', false) / numeric\n`, sortObjectsNumeric([...numbers], 'b', false));
console.log(`sortObjectsAsc(numbers, 'b') / string\n`, sortObjectsAsc([...numbers], 'b'));
console.log(`sortObjects(numbers, 'b', true) / string\n`, sortObjects([...numbers], 'b', true));
console.log(`sortObjectsDesc(numbers, 'b') / string\n`, sortObjectsAsc([...numbers], 'b'));
console.log(`sortObjects(numbers, 'b', false) / string\n`, sortObjects([...numbers], 'b', false));
