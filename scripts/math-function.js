/**
 * Parses the table data and returns an array of objects.
 * @returns {Array} An array of objects representing the parsed table data.
 */
export async function parseTable() {
    const table = document.querySelector("table");
    const rows = table.querySelectorAll("tr");
    const data = [];

    rows.forEach((row, rowIndex) => {
        if (rowIndex === 0) return;

        if (row.cells.length === 1) {
            data.push({ campaignName: row.cells[0].textContent, data: [] });
        } else if (data.length > 0) {
            const lastCampaignIndex = data.length - 1;
            if (data[lastCampaignIndex]) {
                const campaignData = data[lastCampaignIndex].data;

                const rowData = {
                    currency: row.cells[0].textContent,
                    BOValue: row.cells[1].textContent,
                    converterValue: row.cells[2].textContent,
                    infoCell: row.cells[3].textContent,
                    Result: row.cells[4].textContent
                };

                campaignData.push(rowData);
            }
        }
    });

    return data;
}

/**
 * Applies deviation styles to table cells based on a percentage deviation threshold.
 */
export async function applyDeviationStyles() {
    const percentErrInput = document.getElementById('percentage-input');
    const percentageTrue = parseFloat(percentErrInput.value);

    const rows = document.querySelectorAll('#table-container tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 4) {
            const BOValue = parseFloat(cells[1].textContent.replace(',', '.'));
            const convertValue = parseFloat(cells[2].textContent.replace(',', '.'));

            if (!isNaN(BOValue) && !isNaN(convertValue) && BOValue !== 0) {
                let percentageDiff;
                let infoText;
                let resultColor;

                if (BOValue > convertValue) {
                    percentageDiff = Math.abs(((BOValue - convertValue) / convertValue) * 100);
                    infoText = `BO > Conv by ${percentageDiff.toFixed(2)}%`;
                    resultColor = percentageDiff <= percentageTrue ? 'green' : 'red';
                } else if (BOValue < convertValue) {
                    percentageDiff = Math.abs(((convertValue - BOValue) / BOValue) * 100);
                    infoText = `Conv > BO by ${percentageDiff.toFixed(2)}%`;
                    resultColor = percentageDiff <= percentageTrue ? 'green' : 'red';
                } else {
                    percentageDiff = 0;
                    infoText = 'Conv = BO';
                    resultColor = 'green';
                }

                const info = cells[3];
                const result = cells[4];

                result.style.backgroundColor = resultColor;
                info.textContent = infoText;
            }
        }
    });
}