/**
 * Sort an array of objects by property
 * (sorts values as strings)
 * @param {Object[]} objArr - array of objects to sort
 * @param {string} prop - property to sort on
 * @param {boolean} [asc=true] - ascending? defaults to true
 * @returns {Object[]} - returns sorted array
 */
function sortObjects(objArr, prop, asc = true){
  const X = asc ? -1 : 1;
  const Y = asc ? 1 : -1;
  return objArr.sort(function(a, b){
    const A = (a[prop] + '').toLowerCase();
    const B = (b[prop] + '').toLowerCase();
    return (A < B) ? X : (A > B) ? Y : 0;
  });
}


/**
 * Sort an array of objects by property
 * (sorts *numerically*)
 * @param {Object[]} objArr - array of objects to sort
 * @param {string} prop - property to sort on
 * @param {boolean} [asc=true] - ascending? defaults to true
 * @returns {Object[]} - returns sorted array
 */
function sortObjectsNumeric(objArr, prop, asc = true){
  return objArr.sort((a, b) => {
    const A = Number(a[prop]);
    const B = Number(b[prop]);
    return asc ? A - B : B - A;
  });
}
