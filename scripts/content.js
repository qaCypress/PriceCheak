import { 
    handleInputField, 
    handlePercentageInput, 
    createCurrenciesButtons, 
    createTable,
    clearTable,
    initButtonStates
} from './front-function.js';

import { 
    removeChoiseProjectOption, 
    campaignsData,
    runReloadWithCurrenciesForCampaigns
} from './send-reqrest-function.js';

import { 
    applyDeviationStyles
} from './math-function.js';



document.addEventListener('DOMContentLoaded', function () {
    // Initialize input field behavior
    handleInputField();
    // Initialize percentage input field behavior
    handlePercentageInput();
    // Create currency selection buttons
    createCurrenciesButtons();

    // Event listener for project selection change
    var selectElement = document.getElementById('project');
    selectElement.addEventListener('change', function() {
        // Remove the "Choose project" option
        removeChoiseProjectOption();
        // Initialize button states based on local storage
        initButtonStates();
    });

    // Event listener for start button click
    var startButton = document.getElementById('start-button');
    startButton.addEventListener('click', async function() {
        // Fetch filtered results data
        const filteredResults = await campaignsData();

        // Check if filteredResults is valid
        if (!Array.isArray(filteredResults) || filteredResults.length === 0) {
            console.error("Invalid or empty filteredResults");
            const tableContainer = document.getElementById("input-field");
            
            const originalColor = tableContainer.style.backgroundColor;

            tableContainer.style.backgroundColor = "red";

        setTimeout(() => {
            tableContainer.style.backgroundColor = originalColor;
        }, 1500);
            return;
        }

        // Fetch all results data with currencies
        const allResults = await runReloadWithCurrenciesForCampaigns();

        // Log all results data
        console.log("All results:", allResults);

        // Create table based on filtered results and all results
        createTable(filteredResults, allResults);

        // Apply deviation styles to the table
        await applyDeviationStyles(); // Applying the corrected function

        // Show the clear button
        const clearButton = document.getElementById("clear-button");
        if (clearButton) {
            clearButton.style.display = "block";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Event listener for clear button click
    const clearButton = document.getElementById("clear-button");
    if (clearButton) {
        clearButton.addEventListener("click", clearTable);
    }
});