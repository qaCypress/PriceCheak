/**
 * Starts recording active currencies by returning an array of their names.
 * @returns {Array} An array of active currency names.
 */
export function startRecording() {
    const activeCurrencies = [];
    const activeButtons = document.querySelectorAll('.button.active');

    activeButtons.forEach(function(button) {
        activeCurrencies.push(button.textContent);
    });

    return activeCurrencies;
}

let choiseProjectRemoved = false;

/**
 * Removes the "Choose project" option from the project select element.
 */
export function removeChoiseProjectOption() {
    if (!choiseProjectRemoved) {
        var selectElement = document.getElementById('project');
        var options = selectElement.options;

        for (var i = 0; i < options.length; i++) {
            if (options[i].value === 'Choise project') {
                selectElement.remove(i);
                break;
            }
        }

        choiseProjectRemoved = true;
    }
}

/**
 * Finds a property in an object by checking multiple property names recursively.
 * @param {Object} obj - The object to search in.
 * @param {Array} propNames - An array of property names to search for.
 * @returns {*} The value of the property if found, otherwise null.
 */
function findProperty(obj, propNames) {
    if (typeof obj !== 'object' || obj === null) {
        return null;
    }

    for (const propName of propNames) {
        if (obj.hasOwnProperty(propName)) {
            return obj[propName];
        }
    }

    if (Array.isArray(obj)) {
        for (const item of obj) {
            const result = findProperty(item, propNames);
            if (result !== null) {
                return result;
            }
        }
    }

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const result = findProperty(obj[key], propNames);
            if (result !== null) {
                return result;
            }
        }
    }

    return null;
}

/**
 * Converts an array of objects with 'currency' and 'amount' properties into an object.
 * @param {Array} array - The array to convert.
 * @returns {Object} An object with currency names as keys and amounts as values.
 */
function convertArrayToObject(array) {
    const result = {};
    if (!Array.isArray(array)) {
        console.error("Input is not an array. Cannot convert.");
        return result;
    }
    array.forEach(item => {
        if (item.currency && typeof item.amount === 'number') {
            result[item.currency] = item.amount;
        }
    });
    return result;
}

/**
 * Retrieves data for campaigns based on user input and selected project.
 * @returns {Array} An array of objects containing campaign data.
 */
export async function campaignsData() {
    const campaigns = [];
    const inputField = document.getElementById('input-field').value;
    const splittedValues = inputField.split(" ");

    campaigns.push(...splittedValues);

    try {
        const requests = campaigns
            .filter(camp => camp.includes("CAMPAIGN"))
            .map(async (camp) => {
                const options = document.getElementById('project');
                const selectedProject = options.value;

                const projectUrl = {
                    AllRight: `https://allrightcasino.nascms.co/api/bonus/info/${camp}/CAMPAIGN`,
                    LuckyBird: `https://luckybirdcasino.nascms.co/api/bonus/info/${camp}/CAMPAIGN`,
                    Slottica: `https://slottica.nascms.co/api/bonus/info/${camp}/CAMPAIGN`,
                    SlottyWay: `https://slottyway.nascms.co/api/bonus/info/${camp}/CAMPAIGN`,
                    Spinamba: `https://spinamba.nascms.co/api/bonus/info/${camp}/CAMPAIGN`,
                    SpinBounty: `https://spinbounty.nascms.co/api/bonus/info/${camp}/CAMPAIGN`,
                    SuperCat: `https://redbox.nascms.co/api/bonus/info/${camp}/CAMPAIGN`,
                    Viks: `https://viks.nascms.co/api/bonus/info/${camp}/CAMPAIGN`,
                    Magic365: `https://magic365.nascms.co/api/bonus/info/${camp}/CAMPAIGN`,
                    Spinado: `https://spinado.sofcms.co/api/bonus/info/${camp}/CAMPAIGN`,
                };

                const url = projectUrl[selectedProject];

                if (!url) {
                    console.warn(`Invalid project selected for ${camp}`);
                    return null;
                }

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Network response for ${camp} was not ok`);
                }

                const responseData = await response.json();

                const foundProperty = findProperty(responseData, ['totalBetAmounts', 'freeSpinPrice']);

                let convertedProperty;
                if (Array.isArray(foundProperty)) {
                    convertedProperty = convertArrayToObject(foundProperty);
                } else if (typeof foundProperty === 'object') {
                    convertedProperty = foundProperty;
                } else {
                    return null;
                }

                return { name: camp, data: convertedProperty };
            });

        const results = await Promise.all(requests);

        const activeCurrencies = startRecording();

        const filteredResults = results.map(result => {
            if (!result || !result.data) {
                return null;
            }

            const filteredProperty = {};

            Object.keys(result.data).forEach(currency => {
                if (activeCurrencies.includes(currency)) {
                    filteredProperty[currency] = result.data[currency];
                }
            });

            return { name: result.name, data: filteredProperty };
        });
        console.log(filteredResults)

        return filteredResults;

    } catch (error) {
        console.error('There was a проблема с fetch-операцией:', error);

    const tableContainer = document.getElementById("input-field");

    if (tableContainer) {
        const originalColor = tableContainer.style.backgroundColor;

        tableContainer.style.backgroundColor = "red";

        setTimeout(() => {
            tableContainer.style.backgroundColor = originalColor;
        }, 1500);
    }
    }
}

/**
 * Retrieves the value of an element in a specific tab using Chrome extension API.
 * @param {number} tabId - The ID of the tab to retrieve the element value from.
 * @returns {Promise<string|null>} A promise that resolves with the element value or null if not found.
 */
function getElementValue(tabId) {
    return new Promise((resolve, reject) => {
        chrome.scripting.executeScript(
            {
                target: { tabId },
                function: function () {
                    const element = document.querySelector(
                        '.MuiInputBase-input.MuiFilledInput-input[tabindex="4"]'
                    );
                    return element ? element.value : null;
                },
            },
            (results) => {
                if (chrome.runtime.lastError) {
                    console.error("Script execution error:", chrome.runtime.lastError);
                    reject(chrome.runtime.lastError);
                } else if (results && results[0]) {
                    resolve(results[0].result);
                } else {
                    resolve(null);
                }
            }
        );
    });
}

/**
 * Reloads a tab with a new URL.
 * @param {number} tabId - The ID of the tab to reload.
 * @param {string} newUrl - The URL to reload the tab with.
 */
function reloadTabWithNewUrl(tabId, newUrl) {
    if (!newUrl || !tabId) {
        console.error("URL or tab ID not specified.");
        return;
    }

    chrome.tabs.update(tabId, { url: newUrl });
}

/**
 * Delays execution for a specified duration.
 * @param {number} ms - The duration to delay in milliseconds.
 * @returns {Promise} A promise that resolves after the specified delay.
 */
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Waits for a page to finish loading in a tab.
 * @param {number} tabId - The ID of the tab to wait for.
 * @returns {Promise} A promise that resolves when the page is fully loaded.
 */
async function waitForPageLoad(tabId) {
    return new Promise((resolve, reject) => {
        chrome.scripting.executeScript({
            target: { tabId },
            function: () => document.readyState
        }, (results) => {
            if (results[0].result === 'complete') {
                resolve();
            } else {
                setTimeout(() => resolve(waitForPageLoad(tabId)), 500);
            }
        });
    });
}

/**
 * Reloads a tab with currency conversion for each active currency.
 * @param {number} eurValue - The value of EUR to use for conversion.
 * @param {number} index - The index of the campaign to reload.
 * @returns {Object} An object containing extracted values for each currency after reload.
 */
async function reloadWithCurrencies(eurValue, index) {
    const activeCurrencies = startRecording();
    const extractedValues = {};

    const currentTab = await new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0]);
        });
    });

    if (!currentTab || !currentTab.id) {
        console.error("Failed to get current tab.");
        return;
    }

    const campaigns = await campaignsData();
    const eurObject = campaigns[index];

    if (!eurObject) {
        console.error(`Campaign with index ${index} not found.`);
        return;
    }

    const eurObject1 = eurObject.data.EUR;

    for (let currency of activeCurrencies) {

        const newUrl = `https://www.oanda.com/currency-converter/ru/?from=EUR&to=${currency}&amount=${eurObject1}`;

        console.log(`Reloading with URL: ${newUrl}`);
        await reloadTabWithNewUrl(currentTab.id, newUrl);
        await waitForPageLoad(currentTab.id);
        await delay(1000);

        const value = await getElementValue(currentTab.id);

        if (value !== null) {
            extractedValues[currency] = value;
        } else {
            console.log(`Value for currency ${currency} not found`);
        }
    }

    console.log("Extracted values after reload:", extractedValues);
    return extractedValues;
}

/**
 * Runs reloadWithCurrencies for each campaign and gathers the results.
 * @returns {Object} An object containing extracted values for each campaign and currency.
 */
export async function runReloadWithCurrenciesForCampaigns() {
    const campaigns = await campaignsData(); // Get campaign data
    if (!Array.isArray(campaigns) || campaigns.length === 0) {
        console.error("Campaign list is empty or invalid.");
        return;
    }

    const allResults = {}; // Object to store results for all campaigns

    let index = 0; // Initial campaign index

    // Iterate through each campaign and run reloadWithCurrencies
    for (const campaign of campaigns) {
        console.log(`Starting reload for campaign: ${campaign.name}`);

        // Assume eurValue is contained within the campaign or extracted from some source
        const eurValue = campaign.eurValue || 1; // Use a sensible default value or extract from campaign

        // Pass eurValue and index when calling reloadWithCurrencies
        const results = await reloadWithCurrencies(eurValue, index);

        if (results) {
            allResults[campaign.name] = results; // Save results for this campaign
        } else {
            console.warn(`No results for campaign: ${campaign.name}`);
        }

        await delay(2000); // Delay between reloads to avoid overload

        index++; // Increment index after processing campaign
    }

    console.log("All results:", allResults);
    return allResults;
}