document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');

    calculateBtn.addEventListener('click', () => {
        // --- 1. Grab all input values ---
        const annualIncome = parseFloat(document.getElementById('annualIncome').value);
        const monthlyExpenses = parseFloat(document.getElementById('monthlyExpenses').value);
        const traditionalGrowthRate = parseFloat(document.getElementById('traditionalGrowthRate').value) / 100;
        const incomeTaxRate = parseFloat(document.getElementById('incomeTaxRate').value) / 100;
        const capitalGainsRate = parseFloat(document.getElementById('capitalGainsRate').value) / 100;
        const btcGrowthRate = parseFloat(document.getElementById('btcGrowthRate').value) / 100;
        const simulationYears = parseInt(document.getElementById('simulationYears').value);

        // --- Setup variables for the simulation ---
        let traditionalNetWorth = 0;
        let btcNetWorth = 0;
        const projectionTableBody = document.getElementById('projectionTableBody');
        const finalYearBreakdown = document.getElementById('finalYearBreakdown');
        projectionTableBody.innerHTML = ''; // Clear previous results

        // --- Currency formatter ---
        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

        // --- 2. Run the multi-year simulation loop ---
        for (let year = 1; year <= simulationYears; year++) {
            // --- Annual calculations ---
            const annualNetIncome = annualIncome * (1 - incomeTaxRate);
            const annualExpenses = monthlyExpenses * 12;
            const annualSavings = annualNetIncome - annualExpenses;

            // --- Update Traditional Net Worth with Compounding Growth ---
            const traditionalGrowth = traditionalNetWorth * traditionalGrowthRate;
            traditionalNetWorth += annualSavings + traditionalGrowth;

            // --- Update Bitcoin Standard Net Worth ---
            const startingPrincipal = btcNetWorth + annualNetIncome;
            const amountSoldForExpenses = annualExpenses;
            const amountHeld = startingPrincipal - amountSoldForExpenses;
            
            const capitalGain = amountHeld * btcGrowthRate;
            const capitalGainsTax = capitalGain * capitalGainsRate;
            
            btcNetWorth = amountHeld + capitalGain - capitalGainsTax;
            
            // --- 3. Populate the projection table for the current year ---
            const difference = btcNetWorth - traditionalNetWorth;
            const row = `
                <tr class="border-b border-gray-600">
                    <td class="py-2 px-4">${year}</td>
                    <td class="py-2 px-4">${formatter.format(traditionalNetWorth)}</td>
                    <td class="py-2 px-4 font-semibold text-green-400">${formatter.format(btcNetWorth)}</td>
                    <td class="py-2 px-4 text-orange-400">${formatter.format(difference)}</td>
                </tr>
            `;
            projectionTableBody.innerHTML += row;

            // --- 4. If it's the last year, generate the final breakdown ---
            if (year === simulationYears) {
                const finalBreakdownHTML = `
                    <div>
                        <h3 class="text-lg font-semibold text-gray-400">Traditional Model (Final Year)</h3>
                        <p>Starting Principal: <span class="font-mono float-right">${formatter.format(traditionalNetWorth - annualSavings - traditionalGrowth)}</span></p>
                        <p>Annual Savings Added: <span class="font-mono float-right">+${formatter.format(annualSavings)}</span></p>
                        <p>Investment Growth: <span class="font-mono float-right text-green-400">+${formatter.format(traditionalGrowth)}</span></p>
                         <hr class="border-gray-500 my-2">
                        <p>Final Net Worth: <span class="font-mono float-right font-bold">${formatter.format(traditionalNetWorth)}</span></p>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-gray-400">Bitcoin Model (Final Year)</h3>
                        <p>Starting Principal: <span class="font-mono float-right">${formatter.format(btcNetWorth - (amountHeld * (1 + btcGrowthRate - capitalGainsRate * btcGrowthRate)) + amountSoldForExpenses - annualNetIncome)}</span></p>
                        <p>Net Income Added: <span class="font-mono float-right">+${formatter.format(annualNetIncome)}</span></p>
                        <p>Capital Gain (Net): <span class="font-mono float-right text-green-400">+${formatter.format(capitalGain - capitalGainsTax)}</span></p>
                         <hr class="border-gray-500 my-2">
                        <p>Final Net Worth: <span class="font-mono float-right font-bold text-orange-400">${formatter.format(btcNetWorth)}</span></p>
                    </div>
                `;
                finalYearBreakdown.innerHTML = finalBreakdownHTML;
            }
        }

        // --- 5. Show the results section ---
        document.getElementById('results').style.display = 'block';
    });
});
