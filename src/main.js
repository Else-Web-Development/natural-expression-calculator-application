import '../src/main.css';
import '../node_modules/flatpickr/dist/flatpickr.css';
import flatpickr from 'flatpickr';
import {
  primaryNumberMales,
  primaryNumberFemales,
  secondNumberMales,
  secondNumberFemales,
  thirdNumberArray,
} from './data';

//
// GLOBALS
//
let genderChosen = 'none-chosen';
let isDateSelected = false;

//
// A counter to see how many times the app has been used
//
function increaseUseCounter() {
  if (localStorage.timesUsed) {
    localStorage.timesUsed = Number(localStorage.timesUsed) + 1;
  } else {
    localStorage.timesUsed = 1;
  }
}

//
// selectors
//
const genderBox = document.getElementById('js-gender-box');
const testMask = document.getElementById('test-mask');


genderBox.textContent = 'Click here to choose your gender';

function toggleGenderBox() {
  if (isDateSelected === false) {
    if (genderChosen === 'M') {
      genderChosen = 'F';
      genderBox.textContent = 'Female';
      genderBox.classList.toggle('natural-expression-generator__gender-box--color-female');
    } else {
      genderChosen = 'M';
      genderBox.textContent = 'Male';
      genderBox.classList.toggle('natural-expression-generator__gender-box--color-male');
    }
  }
}


// add/remove visible, depending on test conditional, i less than 10
// div.classList.toggle("visible", i < 10 );


function tempTest() {
  document.getElementById('natural-expression-generator--mask').style.display = 'block';
}

genderBox.addEventListener('click', toggleGenderBox, false);
testMask.addEventListener('click', tempTest, false);

//
// Output the information to the DOM
//
function outputToDOM(thingsToPrint) {
  const resultString = `
  <p>Your number of goes using this app are <strong>${localStorage.timesUsed}</strong></p>
    <p>(NE year of birth is <strong>${thingsToPrint.naturalExpressionYearOfBirth}</strong>)</p>
    <p>Your gender is <strong>${genderChosen}</strong></p>
    <p>You are <strong>${thingsToPrint.duality}</strong></p>
    <p>You are a <strong>${thingsToPrint.complexity}</strong> Expression</p>
    <h3>Your 9-Energy Natural Expression is:</h3>
    <h2><strong>${thingsToPrint.thirdNumber[0]}-${thingsToPrint.thirdNumber[1]}-${thingsToPrint.thirdNumber[2]}</strong></h2>
    <p><strong>"${thingsToPrint.thirdNumber[3]}"</strong></p>`;
  document.getElementById('results').innerHTML = resultString;
}

//
// Translate the actual chosen year to the special Natural Expression year
//
function calculateYear(selectedDates) {
  if ((selectedDates[0].getMonth() === 0) ||
    (selectedDates[0].getMonth() === 1 && selectedDates[0].getDate() < 4)) {
    return selectedDates[0].getFullYear() - 1;
  }
  return selectedDates[0].getFullYear();
}

//
// Return primary number based on gender and special year of birth
//
function findPrimaryNumber(gender, naturalExpressionYearOfBirth) {
  const includesYearOfBirth = element =>
    element.year.includes(naturalExpressionYearOfBirth);

  return (gender === 'F') ?
    (primaryNumberFemales.find(includesYearOfBirth) || {}).number :
    (primaryNumberMales.find(includesYearOfBirth) || {}).number;
}

//
// Return Yin or Yang
//
function findDuality(gender, primaryNumber) {
  const isPrimaryNumber = element =>
    element.number === primaryNumber;

  return (gender === 'F') ?
    (primaryNumberFemales.find(isPrimaryNumber) || {}).duality :
    (primaryNumberMales.find(isPrimaryNumber) || {}).duality;
}

//
// Return if simple or complex
//
function findComplexity(gender, primaryNumber) {
  const isPrimaryNumber = element =>
    element.number === primaryNumber;

  return (gender === 'F') ?
    (primaryNumberFemales.find(isPrimaryNumber) || {}).complexity :
    (primaryNumberMales.find(isPrimaryNumber) || {}).complexity;
}

//
// Return second number based on gender, primary number, and month of birth
//
function findSecondNumber(gender, primaryNumber, monthOfBirth) {
  const includesPrimaryNumber = element =>
    element.primary.includes(primaryNumber);

  const listOfSecondaryNumbers = (gender === 'F') ?
    (secondNumberFemales.find(includesPrimaryNumber) || {}).secondary :
    (secondNumberMales.find(includesPrimaryNumber) || {}).secondary;

  let monthIndex = monthOfBirth - 1;

  if (monthIndex < 0) {
    monthIndex = listOfSecondaryNumbers.length - 1;
  }

  return listOfSecondaryNumbers[monthIndex];
}

//
// Return the 9-Energy Natural Expression
//
function findThirdNumber(primaryNumber, secondNumber) {
  return thirdNumberArray[--secondNumber][--primaryNumber];
}

function calculateNaturalExpression(selectedDates) {
  const naturalExpressionYearOfBirth = calculateYear(selectedDates);
  const monthOfBirth = selectedDates[0].getMonth();
  const primaryNumber = findPrimaryNumber(genderChosen, naturalExpressionYearOfBirth);
  const secondNumber = findSecondNumber(genderChosen, primaryNumber, monthOfBirth);
  const thirdNumber = findThirdNumber(primaryNumber, secondNumber);
  const duality = findDuality(genderChosen, primaryNumber);
  const complexity = findComplexity(genderChosen, primaryNumber);
  increaseUseCounter();
  outputToDOM({
    naturalExpressionYearOfBirth,
    duality,
    complexity,
    primaryNumber,
    secondNumber,
    thirdNumber,
  });
  // const mask = document.getElementById('mask');
  // mask.classList.add('natural-expression-generator--mask');
  // document.getElementById('natural-expression-generator--mask').style.display = 'block';
}

//
// Run the main program
//
flatpickr('#demo', {
  onChange(selectedDates) {
    if (genderChosen !== 'none-chosen') {
      isDateSelected = true;
      calculateNaturalExpression(selectedDates);
    }
  },
});