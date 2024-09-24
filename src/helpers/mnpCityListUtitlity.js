const fs = require('fs');
const { cities } = require('../data/cities');
const mnpCities = require('../data/mnpCourierProductionCityList.js');

function levenshteinDistance(a, b) {
  // Convert strings to lowercase for case-insensitive comparison
  a = a.toLowerCase();
  b = b.toLowerCase();

  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  var matrix = [];

  // Initialize matrix
  for (var i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (var j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in matrix
  for (var i = 1; i <= b.length; i++) {
    for (var j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // Substitution
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j] + 1 // Deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function findSimilarStrings(searchString, list, threshold, listDataKey) {
  return list.filter(
    (item) =>
      levenshteinDistance(
        searchString,
        listDataKey ? item[listDataKey] : item
      ) <= threshold
  );
}

const result = [];
for (let i = 0; i < cities.length; i++) {
  const city = cities[i];
  const maped = findSimilarStrings(city, mnpCities, 1, '');
  if (maped.length) {
    result.push({
      city,
      maped: maped[0],
      assigned_id: null,
      active_as_origin: true,
      active_as_destination: true,
      code: null,
      courier: 'mnp',
    });
  }
}

console.log(
  `original cities array: ${cities.length}, mnp cities length: ${mnpCities.length}, resulted array length: ${result.length}`
);
const filePath = __dirname + '/output-mnp.json';
fs.writeFile(filePath, JSON.stringify(result), 'utf8', (err) => {
  if (err) {
    console.error('Error writing JSON to file:', err);
    return;
  }
  console.log('JSON data has been written to file successfully.');
});
