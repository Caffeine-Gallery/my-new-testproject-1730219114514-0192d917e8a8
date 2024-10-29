import { backend } from 'declarations/backend';

let firstOperand = '';
let secondOperand = '';
let currentOperation = null;
let shouldResetDisplay = false;

const display = document.getElementById('display');
const loading = document.getElementById('loading');

function showLoading() {
    loading.style.display = 'flex';
}

function hideLoading() {
    loading.style.display = 'none';
}

window.appendToDisplay = (value) => {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }
    display.value += value;
};

window.clearDisplay = () => {
    display.value = '';
    firstOperand = '';
    secondOperand = '';
    currentOperation = null;
};

window.setOperation = (operation) => {
    if (currentOperation !== null) calculate();
    firstOperand = display.value;
    currentOperation = operation;
    shouldResetDisplay = true;
};

window.calculate = async () => {
    if (currentOperation === null || shouldResetDisplay) return;

    secondOperand = display.value;
    showLoading();

    try {
        let result;
        const x = parseFloat(firstOperand);
        const y = parseFloat(secondOperand);

        switch (currentOperation) {
            case '+':
                result = await backend.add(x, y);
                break;
            case '-':
                result = await backend.subtract(x, y);
                break;
            case '*':
                result = await backend.multiply(x, y);
                break;
            case '/':
                const divisionResult = await backend.divide(x, y);
                result = divisionResult[0] !== null ? divisionResult[0] : 'Error';
                break;
        }

        display.value = result;
    } catch (error) {
        console.error('Error:', error);
        display.value = 'Error';
    } finally {
        hideLoading();
    }

    firstOperand = '';
    secondOperand = '';
    currentOperation = null;
    shouldResetDisplay = true;
};
