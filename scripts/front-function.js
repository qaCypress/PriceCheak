
/**
 * Toggles the state of a button between active and inactive.
 * @param {HTMLElement} button - The button element to toggle.
 */
export function toggleButton(button) {
    // Toggle the 'active' class on the button
    button.classList.toggle('active');
    
    // Check if the button is now active
    var isActive = button.classList.contains('active');
    
    // Set background color based on the button's active state
    button.style.backgroundColor = isActive ? '#7a7a7a9c' : '#f9f9f9';

    // Use the button's text content as an identifier
    var buttonId = button.textContent;

    // Store the button's state in local storage
    localStorage.setItem(buttonId, isActive ? 'active' : 'inactive');
}

/**
 * Initializes button states based on data stored in local storage.
 */
export function initButtonStates() {
    // Get all elements with class 'button'
    var buttons = document.querySelectorAll('.button');
    
    // Iterate over each button
    buttons.forEach(function(button) {
        // Get the button's text content
        var buttonId = button.textContent;

        // Get the button's state from local storage
        var buttonState = localStorage.getItem(buttonId);

        // If the button was previously active, set its state and background color accordingly
        if (buttonState === 'active') {
            button.classList.add('active');
            button.style.backgroundColor = '#7a7a7a9c';
        }
    });
}

/**
 * Handles input field behavior when focused and blurred.
 */
export function handleInputField() {
    var inputField = document.getElementById('input-field');

    // Set placeholder and style when input field is focused
    inputField.addEventListener('focus', function() {
        inputField.placeholder = '';
        inputField.style = '';
    });

    // Restore placeholder when input field is blurred and no value is entered
    inputField.addEventListener('blur', function() {
        if (!inputField.value) {
            inputField.placeholder = 'Enter campaigns';
        }
    });
}

/**
 * Handles percentage input field behavior when focused and blurred.
 */
export function handlePercentageInput() {
    var inputField = document.getElementById('percentage-input');

    // Set placeholder and style when input field is focused
    inputField.addEventListener('focus', function() {
        inputField.placeholder = '';
        inputField.style = '';
    });

    // Restore placeholder when input field is blurred and no value is entered
    inputField.addEventListener('blur', function() {
        if (!inputField.value) {
            inputField.placeholder = '%(-/+)';
        }
    });
}

/**
 * Creates currency selection buttons based on the selected project.
 */
export function createCurrenciesButtons() {
    // Object containing currency options for each project
    const currencies = {
        AllRight: [
            'ARS', 'AUD', 'AZN', 'BRL', 'CAD', 'CHF', 'CLP', 'EUR', 'GEL', 
            'INR', 'JPY', 'KZT', 'MXN', 'NOK', 'NZD', 'PEN', 'PLN', 'RUB', 
            'TRY', 'USD', 'ZAR'
        ],
        LuckyBird: [
            'ARS', 'AUD', 'BRL', 'CAD', 'CHF', 'CLP', 'EUR', 'INR', 'JPY', 
            'KZT', 'MXN', 'NOK', 'NZD', 'PEN', 'PLN', 'RUB', 'TRY', 'USD', 
            'ZAR'
        ],
        Slottica:[
            'ARS', 'AUD', 'AZN', 'BDT', 'BRL', 'CAD', 'CHF', 'CLP', 'EUR', 
            'INR', 'JPY', 'KZT', 'MXN', 'NOK', 'NZD', 'PEN', 'PLN', 'RUB', 
            'TRY', 'USD', 'UZS', 'ZAR'
        ],
        SlottyWay:[
            'ARS', 'AUD', 'BRL', 'CAD', 'CHF', 'CLP', 'EUR', 'INR', 'JPY', 
            'KZT', 'MXN', 'NOK', 'NZD', 'PEN', 'PLN', 'RUB', 'TRY', 'USD', 'ZAR'
        ],
        Spinamba:[
            'ARS', 'AUD', 'BRL', 'CAD', 'CHF', 'CLP', 'EUR', 'INR', 'JPY', 
            'KZT', 'MXN', 'NOK', 'NZD', 'PEN', 'PLN', 'RUB', 'TRY', 'USD', 'ZAR'
        ],
        SpinBounty:[
            'ARS', 'AUD', 'AZN', 'BRL', 'BTC', 'CAD', 'CHF', 'CLP', 'CZK', 
            'EUR', 'INR', 'JPY', 'KZT', 'MXN', 'NOK', 'NZD', 'PEN', 'PLN', 
            'RUB', 'SEK', 'TRY', 'USD', 'UZS', 'ZAR'
        ],
        SuperCat:[
            'ARS', 'AUD', 'BRL', 'CAD', 'CHF', 'CPL', 'EUR', 'KZT', 'MXN', 
            'NOK', 'PEN', 'PLN', 'RUB', 'TRY', 'USD', 'ZAR'
        ],
        Viks:['EUR','UZS'],
        Magic365:[
            'ARS', 'AUD', 'AZN', 'BRL', 'CAD', 'CHF', 'CLP', 'CZK', 'EUR', 
            'INR', 'JPY', 'KZT', 'MXN', 'NOK', 'NZD', 'PEN', 'PLN', 'RUB', 
            'SEK', 'TRY', 'USD', 'USZ', 'ZAR'
        ],
        Spinado:[
            'ARS', 'AUD', 'AZN', 'BRL', 'CAD', 'CHF', 'CLP', 'EUR', 'INR', 
            'JPY', 'KZT', 'MXN', 'NOK', 'NZD', 'PEN', 'PLN', 'RUB', 'TRY', 
            'USD', 'UZS', 'ZAR'
        ],
    };
    
    // Get necessary elements
    const buttonContainer = document.getElementById('button-container');
    const options = document.getElementById('project');
    const inputField = document.getElementById('input-field');
    const percentageInput = document.getElementById('percentage-input');
    const startButton = document.getElementById('start-button');

    // Hide input fields and start button initially
    inputField.style.display = 'none';
    percentageInput.style.display = 'none';
    startButton.style.display = 'none';

    // Event listener for project selection change
    options.addEventListener('change', function() {
        // Show input fields and start button
        inputField.style.display = 'block';
        percentageInput.style.display = 'block';
        startButton.style.display = 'block';

        // Clear existing buttons
        buttonContainer.innerHTML = '';

        // Get the selected project
        const selectedProject = options.value;

        // Check if currency array exists for the selected project
        if (currencies[selectedProject]) {
            const currencyArray = currencies[selectedProject];

            // Create buttons for each currency in the array
            currencyArray.forEach(currency => {
                const button = document.createElement('button');
                button.classList.add('button');
                button.textContent = currency;
                buttonContainer.appendChild(button);
            });
        }

        // Apply event listeners to the newly created buttons
        applyButtonListeners();
    });
}

/**
 * Applies click event listeners to currency selection buttons.
 */
function applyButtonListeners() {
    var buttons = document.querySelectorAll('.button');
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            toggleButton(button);
        });
    });
}

/**
 * Clears the table content.
 */
export function clearTable() {
    // Get the table container element
    const tableContainer = document.getElementById("table-container");

    // Check if the table container exists
    if (!tableContainer) {
        console.error("clearTable: table-container not found");
        return;
    }

    // Remove all child elements from the table container
    while (tableContainer.firstChild) {
        tableContainer.removeChild(tableContainer.firstChild);
    }

    // Hide the clear button if it exists
    const clearButton = document.getElementById("clear-button");
    if (clearButton) {
        clearButton.style.display = "none";
    }
}

/**
 * Creates a table based on filtered results.
 * @param {Array} filteredResults - The filtered results to display in the table.
 * @param {Object} allResults - All results data.
 */
export function createTable(filteredResults, allResults) {
    // Check if filteredResults is a valid array and not empty
    if (!Array.isArray(filteredResults) || filteredResults.length === 0) {
        console.error("createTable: filteredResults is invalid or empty");
        return;
    }

    // Get the table container element
    const tableContainer = document.getElementById("table-container");

    // Check if the table container exists
    if (!tableContainer) {
        console.error("createTable: table-container not found");
        return;
    }

    // Create a new table element
    const table = document.createElement("table");
    table.setAttribute("border", "1");
    table.setAttribute("cellpadding", "5");

    // Iterate over each filtered result
    filteredResults.forEach((result) => {
        if (!result || !result.data) {
            return;
        }

        // Create a row for the campaign name
        const campaignHeaderRow = document.createElement("tr");
        const campaignHeaderCell = document.createElement("th");
        campaignHeaderCell.setAttribute("colspan", "5");
        campaignHeaderCell.textContent = `${result.name}`;
        campaignHeaderRow.appendChild(campaignHeaderCell);
        table.appendChild(campaignHeaderRow);

        // Create header row for currency, BO, Converter, Info, Result
        const headerRow = document.createElement("tr");
        const headers = ["Cur", "BO", "Converter", "Info", "Result"]; // Additional headers
        headers.forEach((header) => {
            const headerCell = document.createElement("th");
            headerCell.textContent = header;
            headerRow.appendChild(headerCell);
        });
        table.appendChild(headerRow);

        // Create rows for each currency data
        Object.keys(result.data).forEach((currency) => {
            const row = document.createElement("tr");

            // Currency
            const currencyCell = document.createElement("td");
            currencyCell.textContent = currency;
            row.appendChild(currencyCell);

            // Value from BO
            const valueCell = document.createElement("td");
            valueCell.textContent = result.data[currency];
            row.appendChild(valueCell);

            // Value from Converter (if available)
            const convertCell = document.createElement("td");
            const convertValue = allResults[result.name] && allResults[result.name][currency] || "";
            convertCell.textContent = convertValue;
            row.appendChild(convertCell);

            // Two new cells for "-" results
            const negativeResultCell = document.createElement("td");
            negativeResultCell.textContent = ""; // Your logic for inserting corresponding value here
            row.appendChild(negativeResultCell);

            // and "+"
            const positiveResultCell = document.createElement("td");
            positiveResultCell.textContent = ""; // And here as well
            row.appendChild(positiveResultCell);

            table.appendChild(row);
        });
    });

    // Append the table to the table container
    tableContainer.appendChild(table);
}