const names = ['Alice', 'Bob', 'Charlie', /* Add 46 more names */];
const sports = ['Football', 'Basketball', 'Tennis', /* Add 46 more sports */];
const fruits = ['Apple', 'Banana', 'Orange', /* Add 46 more fruits */];
const countries = ['USA', 'Canada', 'UK', /* Add 46 more countries */];
const animals = ['Dog', 'Cat', 'Elephant', /* Add 46 more animals */];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName() {
  const name = getRandomElement(names);
  const sport = getRandomElement(sports);
  const fruit = getRandomElement(fruits);
  const country = getRandomElement(countries);
  const animal = getRandomElement(animals);

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `
    <p>${name} from ${country}</p>
    <p>eating ${fruit}</p>
    <p>has a ${animal}</p>
    <p>Fan of ${sport}</p>
  `;
}