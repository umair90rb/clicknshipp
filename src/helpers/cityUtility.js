const data = require('../data/digi-index');
const fs = require('fs');

// const capitalizeWord = (word) => word[0] + word.substring(1).toLowerCase();
// const capitalizeSentense = (sentense) => {
//   if (!/" "/g.test(sentense)) {
//     return capitalizeWord(sentense);
//   }
//   const splited = sentense.split(" ");
//   if (splited.length > 1) {
//     const capilizedArray = splited.map((word) => capitalizeWord(word));
//     return capilizedArray.join(" ");
//   }
//   return splited[0];
// };

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
    (item) => levenshteinDistance(searchString, item[listDataKey]) <= threshold
  );
}

function mapCities(
  cities,
  list,
  listIdKey,
  listNameKey,
  listOriginKey,
  listDestinationKey,
  listCodeKey,
  courier,
  thresold = 1
) {
  console.log('working on service:', courier, ' with data key:', listNameKey);
  return cities.map((city) => {
    const maped = findSimilarStrings(city, list, thresold, listNameKey);
    if (maped.length) {
      return {
        city,
        maped: maped[0][listNameKey],
        assigned_id: maped[0][listIdKey] || null,
        active_as_origin: maped[0][listOriginKey] || true,
        active_as_destination: maped[0][listDestinationKey] || true,
        code: maped[0][listCodeKey],
        courier,
      };
    }
  });
}

const mappedCities = data.servicesCities.map((list, index) =>
  mapCities(
    data.cities,
    list,
    data.courierList[index].idKey,
    data.courierList[index].nameKey,
    data.courierList[index].originKey,
    data.courierList[index].destnationKey,
    data.courierList[index].code,
    data.courierList[index].service
  )
);
const singleArr = [];
mappedCities.forEach((list) => {
  list.forEach((obj) => {
    if (obj) {
      singleArr.push(obj);
    }
  });
});
const result = JSON.stringify(singleArr);
const filePath = __dirname + '/output-digi_19_05_25_all.json';
fs.writeFile(filePath, result, 'utf8', (err) => {
  if (err) {
    console.error('Error writing JSON to file:', err);
    return;
  }
  console.log('JSON data has been written to file successfully.');
});
