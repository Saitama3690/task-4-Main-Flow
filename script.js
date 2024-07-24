document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.calculator-display');
    const buttons = document.querySelectorAll('.btn');
    let displayValue = '0';
    let firstOperand = null;
    let waitingForSecondOperand = false;
    let operator = null;

    function updateDisplay() {
        display.textContent = displayValue;
    }

    updateDisplay();

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const { number, action, clear, equal } = button.dataset;

            if (number) {
                inputNumber(number);
            } else if (action) {
                handleOperator(action);
            } else if (equal) {
                handleEqual();
            } else if (clear) {
                clearDisplay();
            }

            updateDisplay();
        });
    });

    function inputNumber(number) {
        if (waitingForSecondOperand) {
            displayValue = number;
            waitingForSecondOperand = false;
        } else {
            displayValue = displayValue === '0' ? number : displayValue + number;
        }
    }

    function inputDecimal(dot) {
        if (waitingForSecondOperand) {
            displayValue = '0.';
            waitingForSecondOperand = false;
            return;
        }
        if (!displayValue.includes(dot)) {
            displayValue += dot;
        }
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(displayValue);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        if (firstOperand === null && !isNaN(inputValue)) {
            firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            displayValue = `${parseFloat(result.toFixed(7))}`;
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
    }

    function calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case 'add':
                return firstOperand + secondOperand;
            case 'subtract':
                return firstOperand - secondOperand;
            case 'multiply':
                return firstOperand * secondOperand;
            case 'divide':
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }

    function handleEqual() {
        const inputValue = parseFloat(displayValue);

        if (operator && !waitingForSecondOperand) {
            displayValue = `${calculate(firstOperand, inputValue, operator)}`;
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = true;
        }
    }

    function clearDisplay() {
        displayValue = '0';
        firstOperand = null;
        waitingForSecondOperand = false;
        operator = null;
    }
});
