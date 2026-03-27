// Display and state management
const display = document.getElementById('display');
const scientificToggle = document.getElementById('scientific-toggle');
const scientificKeys = document.getElementById('scientific-keys');
const allButtons = document.querySelectorAll('button:not(#scientific-toggle)');

let currentInput = '';
let previousInput = '';
let operation = null;
let shouldResetDisplay = false;

// Scientific mode toggle
scientificToggle.addEventListener('change', function() {
    if (this.checked) {
        scientificKeys.style.display = 'grid';
    } else {
        scientificKeys.style.display = 'none';
    }
});

// Button clicks - excluding the toggle checkbox
allButtons.forEach(button => {
    button.addEventListener('click', function() {
        const value = this.textContent;
        handleInput(value);
    });
});

// Handle all input
function handleInput(value) {
    if (value === '=') {
        calculate();
    } else if (value === 'AC') {
        clear();
    } else if (value === '%') {
        percentage();
    } else if (['+', '-', '*', '/', '.'].includes(value)) {
        handleOperator(value);
    } else if (['sin', 'cos', 'tan', 'sqrt', 'log', 'ln', '!', 'x²', 'x³', '(', ')'].includes(value)) {
        handleScientific(value);
    } else if (value === 'π') {
        currentInput = (currentInput || 0) + Math.PI;
        updateDisplay();
    } else if (value === 'e') {
        currentInput = (currentInput || 0) + Math.E;
        updateDisplay();
    } else if (value === '00') {
        if (currentInput !== '' && currentInput !== '0') {
            currentInput += '00';
            updateDisplay();
        }
    } else {
        // Number input
        if (shouldResetDisplay) {
            currentInput = value;
            shouldResetDisplay = false;
        } else {
            currentInput = currentInput === '0' ? value : currentInput + value;
        }
        updateDisplay();
    }
}

function handleOperator(op) {
    if (op === '.') {
        if (!currentInput.includes('.')) {
            currentInput = currentInput === '' ? '0.' : currentInput + '.';
            updateDisplay();
        }
        return;
    }

    if (currentInput === '') return;

    if (previousInput !== '') {
        calculate();
    } else {
        previousInput = currentInput;
    }

    operation = op;
    currentInput = '';
    shouldResetDisplay = true;
}

function calculate() {
    if (currentInput === '' || previousInput === '' || operation === null) return;

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            result = current === 0 ? 'Error' : prev / current;
            break;
        default:
            return;
    }

    currentInput = result.toString();
    previousInput = '';
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function handleScientific(func) {
    let result = 0;
    const num = parseFloat(currentInput) || 0;

    try {
        switch (func) {
            case 'sin':
                result = Math.sin(num * Math.PI / 180); // Convert degrees to radians
                break;
            case 'cos':
                result = Math.cos(num * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(num * Math.PI / 180);
                break;
            case 'sqrt':
                result = Math.sqrt(num);
                break;
            case 'x²':
                result = num * num;
                break;
            case 'x³':
                result = num * num * num;
                break;
            case 'log':
                result = Math.log10(num);
                break;
            case 'ln':
                result = Math.log(num);
                break;
            case '!':
                result = factorial(Math.floor(num));
                break;
            case '(':
                currentInput += '(';
                updateDisplay();
                return;
            case ')':
                currentInput += ')';
                updateDisplay();
                return;
            default:
                return;
        }

        currentInput = result.toString();
        shouldResetDisplay = true;
        updateDisplay();
    } catch (error) {
        display.value = 'Error';
    }
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function percentage() {
    const num = parseFloat(currentInput);
    if (!isNaN(num)) {
        currentInput = (num / 100).toString();
        updateDisplay();
    }
}

function clear() {
    currentInput = '';
    previousInput = '';
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function updateDisplay() {
    display.value = currentInput || '0';
}

// Initialize display
updateDisplay();
