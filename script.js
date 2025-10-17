// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    initializeInputs();
    loadSavedData();
    updateCalculationTime();
});

// Создание полей ввода для двух столбцов
function initializeInputs() {
    const container = document.getElementById('inputContainer');
    container.innerHTML = '';

    for (let i = 0; i < 12; i++) {
        const inputRow = document.createElement('div');
        inputRow.className = 'input-row';
        inputRow.innerHTML = `
            <div class="input-label">${i + 1}</div>
            <div class="input-field">
                <input type="number" step="0.001" id="input1_${i}" placeholder="0.000" inputmode="decimal">
            </div>
            <div class="input-field">
                <input type="number" step="0.001" id="input2_${i}" placeholder="0.000" inputmode="decimal">
            </div>
        `;
        container.appendChild(inputRow);

        const inputs = inputRow.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(function () {
                calculate();
                saveData();
            }, 500));
        });
    }
}

// ✅ Функция строгого отсечения до 3 знаков (без округления)
function truncateToThree(num) {
    return Math.trunc(num * 1000) / 1000;
}
function truncateToTwo(num) {
    return Math.trunc(num * 100) / 100;
}
// Функция округления до 2 знаков (только для отображения)
function roundToTwo(num) {
    return Math.round(num * 100) / 100;
}

function roundToThree(num) {
    return Math.round(num * 1000) / 1000;
}

function roundToFor(num) {
    return Math.round(num * 10000) / 10000;
}

// Основная функция расчета
function calculate() {
    const numbers1 = [];
    const numbers2 = [];
    const numbers3 = [];

    let total1 = 0.0, total2 = 0.0, total3 = 0.0;

    for (let i = 0; i < 12; i++) {
        const value1 = parseFloat(document.getElementById(`input1_${i}`).value) || 0; //проверить тут
        const value2 = parseFloat(document.getElementById(`input2_${i}`).value) || 0;


        const exactValue = (value1 + value2) / 2;
        const value3 = roundToThree(exactValue);


        numbers1.push(value1);
        numbers2.push(value2);
        numbers3.push(value3);


        total1 += roundToTwo(value1);
        total2 += roundToTwo(value2);
        total3 += roundToTwo(value3);



    }


    // ✅ НЕ округляем totalX — оставляем точные
    updateResults(numbers1, numbers2, numbers3, total1, total2, total3);
    showResults();
    updateCalculationTime();
}

// Обновление результатов
function updateResults(numbers1, numbers2, numbers3, total1, total2, total3) {
    const resultsContainer = document.getElementById('resultsContainer');
    const total1Element = document.getElementById('total1');
    const total2Element = document.getElementById('total2');
    const total3Element = document.getElementById('total3');

    total1Element.textContent = roundToTwo(total1).toFixed(2);
    total2Element.textContent = roundToTwo(total2).toFixed(2);
    total3Element.textContent = roundToTwo(total3).toFixed(2);

    resultsContainer.innerHTML = `
        <div class="results-table">
            <div class="results-header">
                <div class="results-header-row">
                    <div class="cell cell-header cell-index">№</div>
                    <div class="cell cell-header">Пески 1</div>
                    <div class="cell cell-header">Расчет 1</div>
                    <div class="cell cell-header">Пески 2</div>
                    <div class="cell cell-header">Расчет 2</div>
                    <div class="cell cell-header">Пески 3</div>
                    <div class="cell cell-header">Расчет 3</div>
                </div>
            </div>
            <div class="results-body" id="resultsBody"></div>
        </div>
    `;

    const resultsBody = document.getElementById('resultsBody');

    let sumCalc1 = 0, sumCalc2 = 0, sumCalc3 = 0;

    numbers1.forEach((number1, index) => {
        const number2 = numbers2[index];
        const number3 = numbers3[index];

        const num3 = roundToTwo(number3);
        const num1 = roundToTwo(number1);
        const num2 = roundToTwo(number2);




        const calc1 = total1 > 0 ? roundToTwo(truncateToThree((num1 * 100) / total1)) : 0;
        const calc2 = total2 > 0 ? roundToTwo(truncateToThree((num2 * 100) / total2)) : 0;
        const calc3 = total3 > 0 ? roundToTwo(truncateToThree((num3 * 100) / total3)) : 0;






        sumCalc1 += calc1;
        sumCalc2 += calc2;
        sumCalc3 += calc3;

        roundToTwo(sumCalc1).toFixed(2);



        const row = document.createElement('div');
        row.className = 'results-row';
        row.innerHTML = `
            <div class="cell cell-index">${index + 1}</div>
            <div class="cell cell-number">${roundToTwo(number1).toFixed(2)}</div>
            <div class="cell cell-calc1">${roundToTwo(calc1).toFixed(2)}</div>
            <div class="cell cell-number">${roundToTwo(number2).toFixed(2)}</div>
            <div class="cell cell-calc2">${roundToTwo(calc2).toFixed(2)}</div>
            <div class="cell cell-number">${roundToTwo(number3).toFixed(2)}</div>
            <div class="cell cell-calc3">${roundToTwo(calc3).toFixed(2)}</div>
        `;
        resultsBody.appendChild(row);
    });

    // ✅ Итог — показываем без округления
    const sumRow = document.createElement('div');
    sumRow.className = 'results-row';
    sumRow.style.background = 'rgba(33, 150, 243, 0.05)';
    sumRow.style.fontWeight = '600';
    sumRow.innerHTML = `
        <div class="cell cell-index">∑</div>
        <div class="cell cell-number">${roundToTwo(total1)}</div>
        <div class="cell cell-calc1">${truncateToTwo(sumCalc1)}</div>
        <div class="cell cell-number">${roundToTwo(total2)}</div>
        <div class="cell cell-calc2">${truncateToTwo(sumCalc2)}</div>
        <div class="cell cell-number">${roundToTwo(total3)}</div>
        <div class="cell cell-calc3">${truncateToTwo(sumCalc3)}</div>
    `;
    resultsBody.appendChild(sumRow);
}

// Показать карточку результатов
function showResults() {
    document.getElementById('resultCard').style.display = 'block';
}

// Очистка
function clearAll() {
    for (let i = 0; i < 12; i++) {
        document.getElementById(`input1_${i}`).value = '';
        document.getElementById(`input2_${i}`).value = '';
    }
    document.getElementById('resultCard').style.display = 'none';
    localStorage.removeItem('calculatorData');
    updateCalculationTime();
}

// Сохранение данных
function saveData() {
    const data = { column1: [], column2: [] };
    for (let i = 0; i < 12; i++) {
        data.column1.push(document.getElementById(`input1_${i}`).value);
        data.column2.push(document.getElementById(`input2_${i}`).value);
    }
    localStorage.setItem('calculatorData', JSON.stringify(data));
}

// Загрузка
function loadSavedData() {
    const saved = localStorage.getItem('calculatorData');
    if (saved) {
        const data = JSON.parse(saved);
        for (let i = 0; i < 12; i++) {
            document.getElementById(`input1_${i}`).value = data.column1[i] || '';
            document.getElementById(`input2_${i}`).value = data.column2[i] || '';
        }
        calculate();
    }
}

// Обновление времени
function updateCalculationTime() {
    const now = new Date();
    document.getElementById('calculationTime').textContent =
        `${now.toLocaleDateString('ru-RU')} ${now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
}

// Debounce
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
