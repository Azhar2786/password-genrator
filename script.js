// Handle Slider Control and Display Password Length 

let lengthDisplay = document.querySelector('.lengthDisplay');


let inputSlider = document.querySelector('input[type=range]');


let password_length = 10;

function handleSlider() {
    inputSlider.value = password_length;
    lengthDisplay.innerText = password_length;
    let min = inputSlider.min;
    let max = inputSlider.max;
    inputSlider.style.backgroundSize = ((password_length - min)*100/(max-min)) + "% 100%";
}

handleSlider();

inputSlider.addEventListener('input', (event) => {
    password_length = event.target.value;
    handleSlider();
});

// ---------------------------------- Set indicator


// Strength Color Based on Password 
let indicator = document.querySelector('.indicator');

// Set Indicator 
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

// Default Indicator 
setIndicator("#ccc");

const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercase.checked){
        hasUpper = true;
    } 
    if (lowercase.checked){
        hasLower = true;
    } 
    if (numbers.checked){
        hasNumber = true;
    }
    if (symbols.checked){
        hasSymbol = true;
    }

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && password_length >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        password_length >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}


// --------------------------------------

// Generate Random Letters and Number and Symbols
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Random Lowercase Letter 
function generateRandomLowercase() {
    return String.fromCharCode(generateRandom(97, 123));
}

// Random uppercase Letter 
function generateRandomUppercase() {
    return String.fromCharCode(generateRandom(65, 91));
}

// Random Number 
function generateRandomNumber() {
    return generateRandom(0, 10);
}

// Generate Symbol 
function generateRandomSymbol() {
    const index = generateRandom(0, symbol.length);
    return symbol[index];
}
// --------------------------------------

// -----------------------------------

// Copy Message 
let copyMessage = document.querySelector(".copyMessage");
let copyBtn = document.querySelector(".copyBtn");
let passwordDisplay = document.querySelector("input[type=text]");


async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);

        copyMessage.innerText = "Copied"
    }
    catch (e) {
        // alert("Something went wrong in CopyContent");
        copyMessage.innerText = "Failed";
    }

    copyMessage.classList.add('active');

    setTimeout(() => {
        copyMessage.classList.remove('active');
    }, 3000);
}

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value)
        copyContent();
});

// ------------------------------------ 

// By Default UpperCase Checked 
uppercase.checked = true;

let checkBoxes = document.querySelectorAll("input[type=checkbox]");

let checkCount = 1;

// CheckBox - Handle 

function handleCheckBoxChange() {
    checkCount = 0;
    checkBoxes.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    if (password_length < checkCount) {
        password_length = checkCount;
        handleSlider();
    }
}

checkBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

// ------------------------------------------

// Password Generate 

let password = "";
let generateBtn = document.getElementById("generateBtn");

generateBtn.addEventListener('click', () => {
    if (checkCount <= 0)
        return;

    if (password_length < checkCount) {
        password_length = checkCount;
        handleSlider();
    }

    password = "";

    let total_checked_function = [];

    if (uppercase.checked){
        total_checked_function.push(generateRandomUppercase);
    }
    if (lowercase.checked){
        total_checked_function.push(generateRandomLowercase);
    } 
    if (numbers.checked){
        total_checked_function.push(generateRandomNumber);
    }
    if (symbols.checked){
        total_checked_function.push(generateRandomSymbol);
    }

    // Compulsory Addition
    for (let i = 0; i < total_checked_function.length; i++) {
        password += total_checked_function[i]();
    }


    // remaining addition to password gentrate randomly
    for (let i = 0; i < password_length - total_checked_function.length; i++) {
        let randIndex = generateRandom(0, total_checked_function.length);
        password += total_checked_function[randIndex]();
    }

// shuuffle password 
    function shuffle_password(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        let str = "";
        array.forEach((el) => (str += el));
        return str;
    }

    // Shuffle Password 
    password = shuffle_password(Array.from(password));
    passwordDisplay.value = password;
    // Calculate strenght to change indicator
    calcStrength();
});