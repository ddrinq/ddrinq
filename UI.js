var sClipboardTab = "";
const ciStringType = 0;
const ciArrayType = 1;
const ciDictionaryType = 2;

function generateClipboardContents() {
    var sSelectedTicker = document.getElementById("tickerSelector").value;
    var sClipboard = '';
    if (sSelectedTicker != '') {
        switch (sClipboardTab) {
            case 'HomeTab':
                sClipboard = getClipboardString(ciDictionaryType, 'Ticker Totals:', '', dictTotalsSummary);
                break;
            case 'TickerTab':
                sClipboard =
                    getClipboardString(ciStringType, 'Last Transaction:', dictLastTransaction['Headers'], sSelectedTicker + ', ' + dictLastTransaction['Data'][sSelectedTicker])
                    + '\n'
                    + getClipboardString(ciArrayType, 'Annual Totals:', dictDetailSummaryTableInfo['Headers'], dictDetailSummaryTableInfo['Data'][sSelectedTicker])
                    + '\n'
                    + getClipboardString(ciArrayType, 'Buy/Sell Transactions:', dictBuySellTableInfo['Headers'], dictBuySellTableInfo['Data'][sSelectedTicker])
                    + '\n';
                break;
            case 'TickerAnalysisTab':
                sClipboard = getClipboardString(ciDictionaryType, sSelectedTicker + ' Totals:', '', dictTickerTotals[sSelectedTicker]);
                break;
            case 'BuyTab':
                sClipboard = getClipboardString(ciDictionaryType, 'Next Buy Tickers:', dictBuyTickerInfo['Headers'], dictBuyTickerInfo['Data']);
                break;
            case 'SellTab':
                sClipboard = getClipboardString(ciDictionaryType, 'Next Sell Tickers:', dictSellTickerInfo['Headers'], dictSellTickerInfo['Data']);
                break;
            case 'BriefSummaryTab':
                sClipboard = getClipboardString(ciArrayType, sSelectedTicker + ' Annual Returns:', dictBriefSummaryTableInfo['Headers'], dictBriefSummaryTableInfo['Data'][sSelectedTicker]);
                break;
            case 'LastSoldTab':
                sClipboard = getClipboardString(ciDictionaryType, 'Last Buy/Sell Transaction:', dictLastBuySell['Headers'], dictLastBuySell['Data']);
                break;
            case 'LastTransactionTab':
                sClipboard = getClipboardString(ciDictionaryType, 'Last Transaction:', dictLastTransaction['Headers'], dictLastTransaction['Data']);
                break;
            case 'CurrentSessionTab':
                sClipboard =
                    getClipboardString(ciDictionaryType, 'Current Session:', dictCurrentSession['Headers'], dictCurrentSession['Data'])
                    + '\n'
                    + getClipboardString(ciDictionaryType, 'Current Session Counts:', '', dictCurrentSessionCounts)
                    + '\n';
                break;
        }
    }
    document.getElementById("sViewerClipboard").innerHTML = sClipboard;
    return sClipboard;
}

async function copyToClipboard() {
    try {
        var sClipboard = generateClipboardContents();
        await navigator.clipboard.writeText(sClipboard);
    } catch (err) {
        console.error("Failed to copy text:", err);
        alert("Failed to copy text: Permissions for clipboard access may be denied.");
    }
}

function showTickerInfo(dictTableInfo, sTableContainer, sTableId, iaRound, iaFactor) {
    const table = document.createElement('table');
    table.classList.add("display");
    table.id = sTableId;
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    var saColumnHeader = dictTableInfo["Headers"].split(',');
    var iColumnHeaderLength = saColumnHeader.length;
    for (var iColumnIndex = 0; iColumnIndex < iColumnHeaderLength; iColumnIndex++) {
        const th = document.createElement('th');
        th.innerHTML = saColumnHeader[iColumnIndex].replace(/ /g, '<br>');
        th.style.backgroundColor = '#f0f0f0';
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const dictData = dictTickerInfo["Data"];
    for (var sTicker in dictData) {
        var saRowData = dictData[sTicker].split(',');
        iRowDataLength = saRowData.length;
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.textContent = sTicker;
        row.appendChild(cell);
        for (var iColumnIndex = 0; iColumnIndex < iRowDataLength; iColumnIndex++) {
            const cell = document.createElement('td');
            const iRound = iaRound[iColumnIndex];
            if (iRound > 0) {
                dCell = parseFloat(saRowData[iColumnIndex])
                if (isNaN(dCell)) {
                    cell.textContent = saRowData[iColumnIndex];
                } else {
                    cell.textContent = (dCell * (iaFactor[iColumnIndex] == null ? 1 : iaFactor[iColumnIndex])).toFixed(iRound);
                }
            } else if (iRound == 0) {
                cell.textContent = '' + parseInt(saRowData[iColumnIndex]);
            } else {
                cell.textContent = saRowData[iColumnIndex];
            }
            if (saColumnHeader[iColumnIndex + 1].endsWith('Return') || saColumnHeader[iColumnIndex + 1].endsWith('Percent'))
                cell.textContent += '%';
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    document.getElementById(sTableContainer).innerHTML = "";
    document.getElementById(sTableContainer).appendChild(table);
}

function showTableInfo(dictTableInfo, sTableContainer, sTableId, iaRound, iaFactor) {
    const table = document.createElement('table');
    table.classList.add("display");
    table.id = sTableId;
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    var saColumnHeader = dictTableInfo["Headers"].split(',');
    var iColumnHeaderLength = saColumnHeader.length;
    for (var iColumnIndex = 0; iColumnIndex < iColumnHeaderLength; iColumnIndex++) {
        const th = document.createElement('th');
        th.innerHTML = saColumnHeader[iColumnIndex].replace(/ /g, '<br>');
        th.style.backgroundColor = '#f0f0f0';
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const vaData = dictTickerInfo["Data"];
    for (var iDataIndex in vaData) {
        const dictData = vaData[iDataIndex];
        const sTicker = Object.keys(dictData)[0];
        const saRowData = dictData[sTicker].split(',')
        iRowDataLength = saRowData.length;
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.textContent = sTicker;
        row.appendChild(cell);
        for (var iColumnIndex = 0; iColumnIndex < iRowDataLength; iColumnIndex++) {
            const cell = document.createElement('td');
            const iRound = iaRound[iColumnIndex];
            if (iRound > 0) {
                cell.textContent = (parseFloat(saRowData[iColumnIndex]) * (iaFactor[iColumnIndex] == null ? 1 : iaFactor[iColumnIndex])).toFixed(iRound);
            } else if (iRound == 0) {
                cell.textContent = '' + parseInt(saRowData[iColumnIndex]);
            } else {
                cell.textContent = saRowData[iColumnIndex];
            }
            if (saColumnHeader[iColumnIndex + 1].endsWith('Return') || saColumnHeader[iColumnIndex + 1].endsWith('Percent'))
                cell.textContent += '%';
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    document.getElementById(sTableContainer).innerHTML = '';
    document.getElementById(sTableContainer).appendChild(table);
}

function showAnalysisTableInfo(dictTotalsSummary, sTableContainer) {
    document.getElementById(sTableContainer).innerHTML = `
    <h3>
        DDrINQ Individual Daily Return Summary From
        ${dictTotalsSummary["StartDate"]}
        to
        ${dictTotalsSummary["EndDate"]}
    </h3>
    <section class="summary-list">
        <ul>
            <li onmouseover="this.style.backgroundColor='transparent'">
                <span class="tooltip">
                    <b>${dictTotalsSummary["BuySellCumulativeDailyReturnTotalCount"]}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 420px; text-align: center;">
                        Number of buy sell data points analyzed.  One data point<br>
                        represents a buy sell pair of trades for each of <b>${dictTotalsSummary["TickerCount"]}</b> tickers<br>
                        that were analyzed since ${dictTotalsSummary["StartDate"]}.
                    </span>
                </span>
                total investments (buy/sell pairs).
                <span class="tooltip">
                    <b>${dictTotalsSummary["BuySellCumulativeDailyReturnPositiveCount"]}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 420px; text-align: center;">
                        Number of positive buy sell data points analyzed. One<br>
                        data point represents a buy sell pair of trades for each<br>
                        of <b>${dictTotalsSummary["TickerCount"]}</b> tickers that were analyzed since ${dictTotalsSummary["StartDate"]}.
                    </span>
                </span>
                were profitable.
                <span class="tooltip">
                    <b>${dictTotalsSummary["BuySellCumulativeDailyReturnNegativeCount"]}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 420px; text-align: center;">
                        Number of negative buy sell data points analyzed. One<br>
                        data point represents a buy sell pair of trades for each<br>
                        of <b>${dictTotalsSummary["TickerCount"]}</b> tickers that were analyzed since ${dictTotalsSummary["StartDate"]}.
                    </span>
                </span>
                were losses.
            </li>
            <br>
            <li onmouseover="this.style.backgroundColor='transparent'">
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["BuySellCumulativeDailyReturnPositivePercent"], '', '%', 2)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Percentage of tickers which had a positive return for each buy sell<br>
                        pair of trades for <b>${dictTotalsSummary["TickerCount"]}</b> tickers as of ${dictTotalsSummary["StartDate"]}. Any ticker which had<br>
                        one million shares traded daily in 2020 was chosen. The list has been updated in 2024.
                    </span>
                </span>
                positive.
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["BuySellCumulativeDailyReturnNegativePercent"], '', '%', 2)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Percentage of tickers which had a negative return for each buy sell<br>
                        pair of trades for <b>${dictTotalsSummary["TickerCount"]}</b> tickers as of ${dictTotalsSummary["StartDate"]}. Any ticker which had<br>
                        one million shares traded daily in 2020 was chosen. The list has been updated in 2024.
                    </span>
                </span>
                negative.
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["BuySellCumulativeDailyReturnMedian"], '', '%', 4, 100)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Median daily return for a buy sell strategy for each buy sell pair of<br>
                        trades for <b>${dictTotalsSummary["TickerCount"]}</b> tickers as of ${dictTotalsSummary["StartDate"]}. Any ticker which had<br>
                        one million shares traded daily in 2020 was chosen. The list has been updated in 2024.
                    </span>
                </span>
                median daily return.
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["BuySellCumulativeDailyReturnAverage"], '', '%', 4, 100)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Average daily return for a buy sell strategy for each buy sell pair of<br>
                        trades for <b>${dictTotalsSummary["TickerCount"]}</b> tickers as of ${dictTotalsSummary["StartDate"]}. Any ticker which had<br>
                        one million shares traded daily in 2020 was chosen. The list has been updated in 2024.
                    </span>
                </span>
                average daily return.
            </li>
        </ul>
    </section>

    <h3>
        DDrINQ Annual Daily Return Summary From
        ${dictTotalsSummary["StartDate"]}
        to
        ${dictTotalsSummary["EndDate"]}
    </h3>
    <section class="summary-list">
        <ul>
            <li onmouseover="this.style.backgroundColor='transparent'">
                <span class="tooltip">
                    <b>${dictTotalsSummary["AnnualizedCumulativeBuySellDailyReturnTotalCount"]}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 450px; text-align: center;">
                        Number of buy sell data points analyzed.  One data point<br>
                        represents the realized return at the end of each year for<br>
                        each of <b>${dictTotalsSummary["TickerCount"]}</b> tickers that were analyzed since ${dictTotalsSummary["StartDate"]}.
                    </span>
                </span>
                total investment Sets (buy/sell pairs).
                <span class="tooltip">
                    <b>${dictTotalsSummary["AnnualizedCumulativeBuySellDailyReturnPositiveCount"]}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Number of buy sell positive data points analyzed.  One data point<br>
                        represents the realized return at the end of each year for each<br>
                        of <b>${dictTotalsSummary["TickerCount"]}</b> tickers that were analyzed since ${dictTotalsSummary["StartDate"]}.
                    </span>
                </span>
                were profitable.
                <span class="tooltip">
                    <b>${dictTotalsSummary["AnnualizedCumulativeBuySellDailyReturnNegativeCount"]}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Number of buy sell negative data points analyzed.  One data point<br>
                        represents the realized return at the end of each year for each<br>
                        of <b>${dictTotalsSummary["TickerCount"]}</b> tickers that were analyzed since ${dictTotalsSummary["StartDate"]}.
                    </span>
                </span>
                were losses.
            </li>
            <br>
            <li onmouseover="this.style.backgroundColor='transparent'">
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["AnnualizedCumulativeBuySellDailyReturnPositivePercent"], '', '%', 2)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Percentage of tickers which had a positive return at the end of each<br>
                        year for a buy sell strategy of <b>${dictTotalsSummary["TickerCount"]}</b> tickers as of ${dictTotalsSummary["StartDate"]}. Any ticker<br>
                        which had one million shares traded daily in 2020 was chosen. The list has been updated in 2024.
                    </span>
                </span>
                positive.
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["AnnualizedCumulativeBuySellDailyReturnNegativePercent"], '', '%', 2)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Percentage of tickers which had a negative return at the end of each<br>
                        year for a buy sell strategy of <b>${dictTotalsSummary["TickerCount"]}</b> tickers as of ${dictTotalsSummary["StartDate"]}. Any ticker<br>
                        which had one million shares traded daily in 2020 was chosen. The list has been updated in 2024.
                    </span>
                </span>
                negative.
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["AnnualizedCumulativeBuySellDailyReturnMedian"], '', '%', 4, 100)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Median daily return for a buy/sell strategy of <b>${dictTotalsSummary["TickerCount"]}</b> tickers at the end of<br>
                        each year as of ${dictTotalsSummary["StartDate"]}. Any ticker which had one million shares<br>
                        traded daily in 2020 was chosen. The list has been updated in 2024.
                    </span>
                </span>
                median daily return.
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["AnnualizedCumulativeBuySellDailyReturnAverage"], '', '%', 4, 100)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Average daily return for a buy/sell strategy of <b>${dictTotalsSummary["TickerCount"]}</b> tickers at the end of<br>
                        each year as of ${dictTotalsSummary["StartDate"]}. Any ticker which had one million shares<br>
                        traded daily in 2020 was chosen. The list has been updated in 2024.
                    </span>
                </span>
                average daily return.
            </li>
        </ul>
        <p style="margin-left: 20px;">
            <b>&rarr;</b>&nbsp;
            <span class="tooltip">
                <b>${fn(dictTotalsSummary["AnnualDailyReturnLossPercent"], '', '%', 0, 1)}</b>
                <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 600px; text-align: center;">
                    <span class="fraction">
                        <span class="denominator">
                            ("Negative Buy Sell Daily Return Years" - "Negative Buy Hold Daily Return Years")<br>
                        </span>
                    </span>
                    "Cumulative Daily Return Years"
                </span>
            </span>
            less negative than buy/sell.
            <span class="tooltip">
                <b>${fn(dictTotalsSummary["AnnualDailyReturnGainPercent"], '', '%', 0, 1)}</b>
                <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 600px; text-align: center;">
                    <span class="fraction">
                        <span class="denominator">
                            ("Positive Buy Sell Daily Return Years" - "Positive Buy Hold Daily Return Years")<br>
                        </span>
                    </span>
                    "Positive Cumulative Daily Return Years"
                </span>
            </span>
            more positive than buy/hold.<br>
            <b>&rarr;</b>&nbsp;
            <span class="tooltip">
                <b>${fn(dictTotalsSummary["AnnualDailyReturnMedianPercent"], '', '%', 0, 1)}</b>
                <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 600px; text-align: center;">
                    <span class="fraction">
                        <span class="denominator">
                            ("Median Buy Sell Daily Return Years" - "Median Buy Hold Daily Return Years")<br>
                        </span>
                    </span>
                    "Median Cumulative Daily Return Years"
                </span>
            </span>
            higher median than buy/hold.
            <span class="tooltip">
                <b>${fn(dictTotalsSummary["AnnualDailyReturnAveragePercent"], '', '%', 0, 1)}</b>
                <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 600px; text-align: center;">
                    <span class="fraction">
                        <span class="denominator">
                            ("Average Buy Sell Daily Return Years" - "Average Buy Hold Daily Return Years")<br>
                        </span>
                    </span>
                    "Average Cumulative Daily Return Years"
                </span>
            </span>
            higher average than buy/hold.
        </p>
    </section>

    <h3>
        Annual Buy & Hold Daily Return Summary From
        ${dictTotalsSummary["StartDate"]}
        to
        ${dictTotalsSummary["EndDate"]}
    </h3>
    <section class="summary-list">
        <ul>
            <li onmouseover="this.style.backgroundColor='transparent'">
                <span class="tooltip">
                    <b>${dictTotalsSummary["AnnualCumulativeDailyReturnTotalCount"]}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Number of buy/hold data points analyzed.  One data point represents<br>
                        a year for each of <b>${dictTotalsSummary["TickerCount"]}</b> tickers that were analyzed since ${dictTotalsSummary["StartDate"]}.
                    </span>
                </span>
                total investments (start/end annual return.
                <span class="tooltip">
                    <b>${dictTotalsSummary["AnnualCumulativeDailyReturnPositiveCount"]}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 400px; text-align: center;">
                        Number of positive buy/hold data points analyzed.<br>
                        One data point represents a year for each of <b>${dictTotalsSummary["TickerCount"]}</b><br>
                        tickers that were analyzed since ${dictTotalsSummary["StartDate"]}.
                    </span>
                </span>
                were profitable.
                <span class="tooltip">
                    <b>${dictTotalsSummary["AnnualCumulativeDailyReturnNegativeCount"]}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 400px; text-align: center;">
                        Number of negative buy/hold data points analyzed.<br>
                        One data point represents a year for each of <b>${dictTotalsSummary["TickerCount"]}</b><br>
                        tickers that were analyzed since ${dictTotalsSummary["StartDate"]}.
                    </span>
                </span>
                were losses.
            </li>
            <br>
            <li onmouseover="this.style.backgroundColor='transparent'">
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["AnnualCumulativeDailyReturnPositivePercent"], '', '%', 2)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Percentage of tickers which had a positive return for a buy/hold<br>
                        strategy of <b>${dictTotalsSummary["TickerCount"]}</b> tickers as of ${dictTotalsSummary["StartDate"]}. Any ticker which had<br>
                        one million shares traded daily in 2020 was chosen. The list has been updated in 2024.
                    </span>
                </span>
                positive.
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["AnnualCumulativeDailyReturnNegativePercent"], '', '%', 2)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Percentage of tickers which had a negative return for a buy/hold<br>
                        strategy of <b>${dictTotalsSummary["TickerCount"]}</b> tickers as of ${dictTotalsSummary["StartDate"]}. Any ticker which had<br>
                        one million shares traded daily in 2020 was chosen. The list has been updated in 2024.
                    </span>
                </span>
                negative.
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["AnnualCumulativeDailyReturnMedian"], '', '%', 4, 100)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Median daily return for a buy/hold strategy of <b>${dictTotalsSummary["TickerCount"]}</b> tickers as of<br>
                        ${dictTotalsSummary["StartDate"]}. Any ticker which had one million shares traded daily<br>
                        in 2020 was chosen. The list has been updated in 2024.
                    </span>
                </span>
                median daily return.
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["AnnualCumulativeDailyReturnAverage"], '', '%', 4, 100)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Average daily return for a buy/hold strategy of <b>${dictTotalsSummary["TickerCount"]}</b> tickers as of<br>
                        ${dictTotalsSummary["StartDate"]}. Any ticker which had one million shares traded daily<br>
                        in 2020 was chosen. The list has been updated in 2024.
                    </span>
                </span>
                average daily return.
            </li>
        </ul>
    </section>

    <h3>Conditional Similarities From ${dictTotalsSummary["StartDate"]} to ${dictTotalsSummary["EndDate"]}</h3>
    <section class="summary-list">
        <ul>
            <li onmouseover="this.style.backgroundColor='transparent'">
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["TotalBuySellReturnMedian"], '', '%', 2, 100)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Median return by ticker of executing every buy sell since ${dictTotalsSummary["StartDate"]}
                    </span>
                </span>
                median buy/sell return.
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["TotalBuySellReturnAverage"], '', '%', 2, 100)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 500px; text-align: center;">
                        Average return by ticker of executing every buy sell since ${dictTotalsSummary["StartDate"]}
                    </span>
                </span>
                average buy/sell return.
            </li>
            <br>
            <li onmouseover="this.style.backgroundColor='transparent'">
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["AnnualReturnMedian"], '', '%', 2, 100)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 550px; text-align: center;">
                        Median annual return of holding every ticker every year since ${dictTotalsSummary["StartDate"]}
                    </span>
                </span>
                median buy/hold return.
                <span class="tooltip">
                    <b>${fn(dictTotalsSummary["AnnualReturnAverage"], '', '%', 2, 100)}</b>
                    <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 550px; text-align: center;">
                        Average annual return of holding every ticker every year since ${dictTotalsSummary["StartDate"]}
                    </span>
                </span>
                average buy/hold return.
            </li>
        </ul>
    </section>

    <p style="margin-left: 20px;">
        <b>&rarr;</b>&nbsp;
        <span class="tooltip">
            <b>${fn(dictTotalsSummary["AnnualReturnMedianPercent"], '', '%', 0, 1)}</b>
            <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 700px; text-align: center;">
                <span class="fraction">
                    <span class="denominator">
                        ("Median Return of Every Buy Sell by Ticker" - "Median Return of Every Buy Hold by Ticker")<br>
                    </span>
                </span>
                "Median Return of Every Buy Hold by Ticker"
            </span>
        </span>
        higher median than buy/hold.
        <span class="tooltip">
            <b>${fn(dictTotalsSummary["AnnualReturnAveragePercent"], '', '%', 0, 1)}</b>
            <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 700px; text-align: center;">
                <span class="fraction">
                    <span class="denominator">
                        ("Average Return of Every Buy Sell by Ticker" - "Average Return of Every Buy Hold by Ticker")<br>
                    </span>
                </span>
                "Average Return of Every Buy Hold by Ticker"
            </span>
        </span>
        higher average than buy/hold.
    </p>
    <p style="margin-left: 20px;">
        <span class="tooltip">
            <b>${dictTotalsSummary["TickerCount"]}</b>
            <span class="tooltip-text" style="margin-top: -15px; margin-left: 10px; width: 600px; text-align: center;">
                Tickers were chosen in 2020. The list has been updated in 2024. Any ticker which has one million shares traded daily.
            </span>
        </span>
        Tickers
    </p>
`;
}

function showSelectedTableInfo(sSelectedItem, dictTableInfo, sTableContainer, sTableId, iaRound, iaFactor) {
    const table = document.createElement('table');
    table.classList.add("display");
    table.id = sTableId;
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    var saColumnHeader = ('Id,' + dictTableInfo["Headers"]).split(',');
    iColumnHeaderLength = saColumnHeader.length;
    for (var iColumnIndex = 1; iColumnIndex < iColumnHeaderLength; iColumnIndex++) {
        const th = document.createElement('th');
        th.innerHTML = saColumnHeader[iColumnIndex].replace(/ /g, '<br>');
        th.style.backgroundColor = '#f0f0f0';
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    dictData = dictTableInfo["Data"][sSelectedItem];
    for (var sTickerInfo in dictData) {
        var saRowData = dictData[sTickerInfo].split(',');
        iRowDataLength = saRowData.length;
        const row = document.createElement('tr');
        for (var iColumnIndex = 0; iColumnIndex < iRowDataLength; iColumnIndex++) {
            const cell = document.createElement('td');
            const iRound = iaRound[iColumnIndex];
            if (iRound > 0) {
                cell.textContent = (parseFloat(saRowData[iColumnIndex]) * (iaFactor[iColumnIndex] == null ? 1 : iaFactor[iColumnIndex])).toFixed(iRound);
            } else if (iRound == 0) {
                cell.textContent = '' + parseInt(saRowData[iColumnIndex]);
            } else {
                cell.textContent = saRowData[iColumnIndex];
            }
            if (saColumnHeader[iColumnIndex + 1].endsWith('Return') || saColumnHeader[iColumnIndex + 1].endsWith('Percent'))
                cell.textContent += '%';
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    document.getElementById(sTableContainer).innerHTML = "";
    document.getElementById(sTableContainer).appendChild(table);
}

function cellLessColor(sTableName, vThresholds, sColumnIndex) {
    $(document).ready(function () {
        const iThresholdsLength = vThresholds.length;
        $('#' + sTableName + ' tr').each(function () {
            var cellValue = parseFloat($(this).find('td:eq(' + sColumnIndex + ')').text());
            for (var iCell = 0; iCell < iThresholdsLength; iCell++) {
                if (cellValue < vThresholds[iCell].value) {
                    $(this).find('td:eq(' + sColumnIndex + ')').addClass(vThresholds[iCell].class);
                    break;
                }
            }
        });
    });
}

function cellMoreColor(sTableName, vThresholds, sColumnIndex) {
    $(document).ready(function () {
        const iThresholdsLength = vThresholds.length;
        $('#' + sTableName + ' tr').each(function () {
            var cellValue = parseFloat($(this).find('td:eq(' + sColumnIndex + ')').text());
            for (var iCell = 0; iCell < iThresholdsLength; iCell++) {
                if (cellValue > vThresholds[iCell].value) {
                    $(this).find('td:eq(' + sColumnIndex + ')').addClass(vThresholds[iCell].class);
                    break;
                }
            }
        });
    });
}

function getClipboardString(iStructureType, sTitle, sHeader, oStructure) {
    sText = sTitle + '\n';
    switch (iStructureType) {
        case ciStringType:
            sText += sHeader += oStructure + '\n';
            break;
        case ciArrayType:
            sText += sHeader + '\n';
            for (const sItem of oStructure) {
                sText += `${sItem}\n`;
            }
            break;
        case ciDictionaryType:
            if (sHeader != '') {
                sText += sHeader + '\n';
            }
            for (const sKey in oStructure) {
                sText += `${sKey}: ${oStructure[sKey]}\n`;
            }
            break;
        default:
    }
    return sText;
}

function showTabOnHover(tabName) {
    var tabs = document.getElementsByClassName("tab");
    for (var i = 0; i < tabs.length; i++) { tabs[i].style.display = "none"; }
    document.getElementById(tabName).style.display = "block";
    oTopSectionStyle = document.getElementById('topSection').style

    if ((tabName === 'HomeTab') || (tabName === 'TickerAnalysisTab') || (tabName === 'BuyTab') || (tabName === 'SellTab') ||
        (tabName === 'SummaryTab') || (tabName === 'LastSoldTab') || (tabName === 'LastTransactionTab') || (tabName === 'CurrentSessionTab')
    ) {
        oTopSectionStyle.display = "none";
    } else {
        oTopSectionStyle.display = "block";
    }
    var oTickerMenu = document.querySelector('ticker-menu');
    var oULElement = oTickerMenu.querySelector('ul');
    var oILElements = oULElement.querySelectorAll('li');
    for (var oILElement of oILElements) {
        oILElement.style.backgroundColor = '';
        var oAnchors = oILElement.querySelectorAll('a');
        for (var oAnchor of oAnchors) {
            oAnchor.style.color = '';
        }
    }
    document.getElementById('TickerBriefSummaryTab').style.display = 'block';
    document.getElementById('TickerTransactionTab').style.display = 'block';
    document.getElementById('TickerLastTransactionTab').style.display = 'block';
    sClipboardTab = tabName;
    generateClipboardContents()
}

function mouseOutMenu(oItem) {
    oItem.style.backgroundColor = 'black';
    var oAnchors = oItem.querySelectorAll('a');
    for (var oAnchor of oAnchors) {
        oAnchor.style.color = 'white';
    }
}

function fn(sValue, sPrefix = '', sSuffix = '', iDigits = 2, iFactor = 1) {
    return sPrefix + (parseFloat(sValue) * iFactor).toFixed(iDigits) + sSuffix;
}

function loadWebPage(sWebPageContainer, sWebPage, sHeaderContainer, sHeader) {
    var oHeader = document.getElementById(sHeaderContainer)
    oHeader.innerText = sHeader;
    oHeader.title = sHeader;

    var iFrame = document.createElement('iframe');
    iFrame.src = sWebPage;
    var oContainer = document.getElementById(sWebPageContainer);
    oContainer.innerHTML = '';
    oContainer.appendChild(iFrame);
}

function onSelectTicker() {
    var sSelectedTicker = document.getElementById("tickerSelector").value;
    loadWebPage("twoYearHistoryPlot", './500/' + sSelectedTicker + '.html', "twoYearHistoryPlotHeader", sSelectedTicker + ' 500 Days')
    loadWebPage("oneYearHistoryPlot", './250/' + sSelectedTicker + '.html', "oneYearHistoryPlotHeader", sSelectedTicker + ' 250 Days')
    loadWebPage("oneYearReturnsPlot", './Year/' + sSelectedTicker + '.html', "oneYearReturnsPlotHeader", sSelectedTicker + ' One Year Returns')
    loadWebPage("fullReturnsPlot", './All/' + sSelectedTicker + '.html', "fullReturnsPlotHeader", sSelectedTicker + ' Full Returns')

    var sTickerInfo = dictBuyTickerInfo['Data'][sSelectedTicker];
    var obuyOrSellDetails = document.getElementById("buyOrSellDetails");
    if (sTickerInfo === undefined) {
        sTickerInfo = dictSellTickerInfo['Data'][sSelectedTicker];
        if (sTickerInfo === undefined) {
            obuyOrSellDetails.innerHTML = '';
        } else {
            var saColumnValues = sTickerInfo.split(',');
            obuyOrSellDetails.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;Sell:' + fn(saColumnValues[0], '$', '', 2) + ', Last:' + fn(saColumnValues[1], '$', '', 2) + ', Delta:' + fn(saColumnValues[3], '$', '', 2) + '; ' + saColumnValues[4] + '%';
        }
    } else {
        var saColumnValues = sTickerInfo.split(',');
        obuyOrSellDetails.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;Buy:' + fn(saColumnValues[0], '$', '', 2) + ', Last:' + fn(saColumnValues[1], '$', '', 2) + ', Delta:' + fn(saColumnValues[3], '$', '', 2) + '; ' + saColumnValues[4] + '%';
    }
    showSelectedTableInfo(sSelectedTicker, dictBuySellTableInfo, 'transactionsTableContainer', 'transactionsTable', aiRound = iaTransactionsRound, iaFactor = iaTransactionsFactor);
    cellMoreColor(sTableName = 'transactionsTable', vThresholds = vaTransactionsTableThresholds, sColumnIndex = sTransactionsTableThresholdOrderColumnIndex);
    $(document).ready(function () { $('#transactionsTable').DataTable({ "order": [[iTransactionsTableThresholdOrderColumnIndex, 'desc']] }); });

    showSelectedTableInfo(sSelectedTicker, dictDetailSummaryTableInfo, 'tickerBriefSummaryTableContainer', 'tickerBriefSummaryTable', aiRound = iaDetailSummaryRound, iaFactor = iaDetailSummaryFactor);
    cellMoreColor(sTableName = 'tickerBriefSummaryTable', vThresholds = vaDetailSummaryTableThresholds, sColumnIndex = sDetailSummaryTableThresholdOrderColumnIndex);
    $(document).ready(function () { $('#tickerBriefSummaryTable').DataTable({ "order": [[iDetailSummaryTableThresholdOrderColumnIndex, 'desc']] }); });

    showSelectedTableInfo(sSelectedTicker, dictBriefSummaryTableInfo, 'briefSummaryTableContainer', 'briefSummaryTable', aiRound = iaBriefSummaryRound, iaFactor = iaBriefSummaryFactor);
    cellMoreColor(sTableName = 'briefSummaryTable', vThresholds = vaBriefSummaryTableThresholds, sColumnIndex = sBriefSummaryTableThresholdOrderColumnIndex);
    $(document).ready(function () { $('#briefSummaryTable').DataTable({ "order": [[iBriefSummaryTableThresholdOrderColumnIndex, 'desc']] }); });

    var dictTickerLastTransaction = { "Headers": dictLastTransaction['Headers'], "Data": { [sSelectedTicker]: dictLastTransaction['Data'][sSelectedTicker] } };
    showTickerInfo(dictTickerInfo = dictTickerLastTransaction, sTickerContainer = 'tickerLastTransactionTableContainer', sTableId = 'tickerLastTransactionTable', iaRound = iaLastTransactionRound, iaFactor = iaLastTransactionFactor);

    showAnalysisTableInfo(dictTickerTotals[sSelectedTicker], 'tickerAnalysisTableContainer');
    document.querySelector('[onmouseover="showTabOnHover(\'TickerAnalysisTab\')"] a').textContent = "Analysis: " + sSelectedTicker;

    sTickerTransactionDailyReturnColumnIndex = "6";
    iTickerTransactionBuyDateColumnIndex = 1;
    showSelectedTableInfo(sSelectedTicker, dictBuySellTableInfo, 'tickerTransactionTableContainer', 'tickerTransactionTable', aiRound = iaTransactionsRound, iaFactor = iaTransactionsFactor);
    cellMoreColor(sTableName = 'tickerTransactionTable', vThresholds = vaTransactionsTableThresholds, sColumnIndex = sTickerTransactionDailyReturnColumnIndex);
    $(document).ready(function () { $('#tickerTransactionTable').DataTable({ "order": [[iTickerTransactionBuyDateColumnIndex, 'desc']] }); });
}

function populateTickerSelector(sSetType) {
    var oTickerSelector = document.getElementById("tickerSelector");
    if (sSetType === "buy") {
        saTickerSet = Object.keys(dictBuyTickerInfo['Data']);
    } else if (sSetType === "sell") {
        saTickerSet = Object.keys(dictSellTickerInfo['Data']);
    } else if (sSetType === "held") {
        saBuyTickerSet = new Set(Object.keys(dictBuyTickerInfo['Data']))
        saTickerSet = Object.keys(dictLastTransaction.Data).filter(key => dictLastTransaction.Data[key].includes('Bought')).filter(key => !saBuyTickerSet.has(key));
    } else if (sSetType === "wait") {
        saSellTickerSet = new Set(Object.keys(dictSellTickerInfo['Data']))
        saHeldSet = new Set(Object.keys(dictLastTransaction.Data).filter(key => dictLastTransaction.Data[key].includes('Bought')));
        saTickerSet = saTicker.filter(element => !saSellTickerSet.has(element) && !saHeldSet.has(element));
    } else {
        saTickerSet = saTicker;
    }

    document.getElementById("buyOrSellDetailsCount").innerHTML = saTickerSet.length;
    oTickerSelector.innerHTML = '';
    saSortedTickerSet = saTickerSet.sort()
    for (var sTicker of saSortedTickerSet) {
        var option = document.createElement("option");
        option.value = sTicker;
        option.text = sTicker;
        oTickerSelector.appendChild(option);
    }
    oTickerSelector.focus();
    if (oTickerSelector.length > 0) {
        oTickerSelector.selectedIndex = 0;
    }
    onSelectTicker();
}

vaBuySellReturnThresholds = [
    { class: 'green', value: .7 },
    { class: 'lightgreen', value: 0.5 },
    { class: 'blue', value: 0.3 },
    { class: 'yellow', value: 0.1 },
    { class: 'orange', value: 0.0 },
    { class: 'red', value: -1.0 }
];
iBuyThresholdOrderColumnIndex = 6;
sBuyThresholdOrderColumnIndex = "" + iBuyThresholdOrderColumnIndex;
iaBuyRound = [null, 2, 2, 2, 4, 4, 4];
iaBuyFactor = [null, null, null, null, null, 100, 100];
showTickerInfo(dictTickerInfo = dictBuyTickerInfo, sTickerContainer = 'buyTableContainer', sTableId = 'buyTable', iaRound = iaBuyRound, iaFactor = iaBuyFactor);
cellMoreColor(sTableName = 'buyTable', vThresholds = vaBuySellReturnThresholds, sColumnIndex = sBuyThresholdOrderColumnIndex);
$(document).ready(function () { $('#buyTable').DataTable({ "order": [[iBuyThresholdOrderColumnIndex, 'desc']] }); });

iSellThresholdOrderColumnIndex = 6;
sSellThresholdOrderColumnIndex = "" + iSellThresholdOrderColumnIndex;
iaSellRound = [null, 2, 2, 2, 4, 4, 4];
iaSellFactor = [null, null, null, null, null, 100, 100];
showTickerInfo(dictTickerInfo = dictSellTickerInfo, sTickerContainer = 'sellTableContainer', sTableId = 'sellTable', iaRound = iaSellRound, iaFactor = iaSellFactor);
cellMoreColor(sTableName = 'sellTable', vThresholds = vaBuySellReturnThresholds, sColumnIndex = sSellThresholdOrderColumnIndex);
$(document).ready(function () { $('#sellTable').DataTable({ "order": [[iSellThresholdOrderColumnIndex, 'desc']] }); });

vaSummaryTableThresholds = [
    { class: 'blue', value: 1. },
    { class: 'lightblue', value: 0.5 },
    { class: 'green', value: 0.2 },
    { class: 'lightgreen', value: 0.1 },
    { class: 'yellow', value: -0.2 },
    { class: 'red', value: -100. }
];
iSummaryTableThresholdOrderColumnIndex = 9;
sSummaryTableThresholdOrderColumnIndex = "" + iSummaryTableThresholdOrderColumnIndex;
iaSummaryRound = [null, 2, 2, 2, null, 2, 2, 4, 4, 2, 2];
iaSummaryFactor = [null, null, null, 100, null, 100, 100, 100, 100, 100, 100];
cellMoreColor(sTableName = 'summaryTable', vThresholds = vaSummaryTableThresholds, sColumnIndex = sSummaryTableThresholdOrderColumnIndex);
showTableInfo(dictTickerInfo = dictSummaryTableInfo, sTickerContainer = 'summaryTableContainer', sTableId = 'summaryTable', iaRound = iaSummaryRound, iaFactor = iaSummaryFactor);
$(document).ready(function () { $('#summaryTable').DataTable({ "order": [[iSummaryTableThresholdOrderColumnIndex, 'desc']] }); });

vaLastTransactionThresholds = [
];
iLastTransactionThresholdOrderColumnIndex = 2;
sLastTransactionThresholdOrderColumnIndex = "" + iLastTransactionThresholdOrderColumnIndex;
iaLastTransactionRound = [null, 2, 2, 2, 2, 2, null, 2];
iDateColumnIndex = 1;
iTickerColumnIndex = 0;
iaLastTransactionFactor = [null, null, null, null, null, null, null, null];
cellLessColor(sTableName = 'lastTransactionTable', vThresholds = vaLastTransactionThresholds, sColumnIndex = sLastTransactionThresholdOrderColumnIndex);
showTickerInfo(dictTickerInfo = dictLastTransaction, sTickerContainer = 'LastTransactionTableContainer', sTableId = 'lastTransactionTable', iaRound = iaLastTransactionRound, iaFactor = iaLastTransactionFactor);
$(document).ready(function () { $('#lastTransactionTable').DataTable({ "order": [[iDateColumnIndex, 'desc'], [iTickerColumnIndex, 'asc']] }); });

vaTransactionsTableThresholds = [
    { class: 'blue', value: 5. },
    { class: 'lightblue', value: 3. },
    { class: 'green', value: 1. },
    { class: 'lightgreen', value: 0. },
    { class: 'yellow', value: -2. },
    { class: 'red', value: -100. }
];
iTransactionsTableThresholdOrderColumnIndex = 2;
sTransactionsTableThresholdOrderColumnIndex = "" + iTransactionsTableThresholdOrderColumnIndex;
iaTransactionsRound = [null, null, 2, null, 2, 0, 2];
iaTransactionsFactor = [null, null, null, null, null, null, 100];

vaBriefSummaryTableThresholds = [
    { class: 'blue', value: 1. },
    { class: 'lightblue', value: 0.5 },
    { class: 'green', value: 0.2 },
    { class: 'lightgreen', value: 0.1 },
    { class: 'yellow', value: -0.2 },
    { class: 'red', value: -100. }
];
iBriefSummaryTableThresholdOrderColumnIndex = 9;
sBriefSummaryTableThresholdOrderColumnIndex = "" + iBriefSummaryTableThresholdOrderColumnIndex;
iaBriefSummaryRound = [null, null, 2, 2, 2, null, 2, 2, 4, 4, 2, 2];
iaBriefSummaryFactor = [null, null, null, null, 100, null, 100, 100, 100, 100, 100, 100];

vaDetailSummaryTableThresholds = [
    { class: 'blue', value: 1. },
    { class: 'lightblue', value: 0.5 },
    { class: 'green', value: 0.2 },
    { class: 'lightgreen', value: 0.1 },
    { class: 'yellow', value: -0.2 },
    { class: 'red', value: -100. }
];
iDetailSummaryTableThresholdOrderColumnIndex = 1;
sDetailSummaryTableThresholdOrderColumnIndex = "6";
iaDetailSummaryRound = [null, null, 2, 2, 2, null, 2, 4, 4];
iaDetailSummaryFactor = [null, null, null, null, 100, null, 100, 100, 100];

vaLastSoldTableThresholds = [
    { class: 'blue', value: 5. },
    { class: 'lightblue', value: 3. },
    { class: 'green', value: 1. },
    { class: 'lightgreen', value: 0. },
    { class: 'yellow', value: -2. },
    { class: 'red', value: -100. }
];
iLastSoldTableThresholdOrderColumnIndex = 6;
sLastSoldTableThresholdOrderColumnIndex = "" + iLastSoldTableThresholdOrderColumnIndex;
iaLastSoldRound = [null, 2, null, 2, 0, 2];
iaLastSoldFactor = [null, null, null, null, null, 100];
showTickerInfo(dictTickerInfo = dictLastBuySell, sTickerContainer = 'lastSoldTableContainer', sTableId = 'lastSoldTable', iaRound = iaLastSoldRound, iaFactor = iaLastSoldFactor);
cellMoreColor(sTableName = 'lastSoldTable', vThresholds = vaLastSoldTableThresholds, sColumnIndex = sLastSoldTableThresholdOrderColumnIndex);
$(document).ready(function () { $('#lastSoldTable').DataTable({ "order": [[iLastSoldTableThresholdOrderColumnIndex, 'desc']] }); });

vaCurrentSessionTableThresholds = [
    { class: 'blue', value: 1. },
    { class: 'lightblue', value: 0.5 },
    { class: 'green', value: 0.2 },
    { class: 'lightgreen', value: 0.1 },
    { class: 'yellow', value: -0.2 },
    { class: 'red', value: -100. }
];
vaCurrentSessionBooleanTableThresholds = [
    { class: 'lightgreen', value: 'True' },
    { class: 'yellow', value: 'False' }
];
iCurrentSessionTableThresholdOrderColumnIndex = 13;
sCurrentSessionTableThresholdOrderColumnIndex = "" + iCurrentSessionTableThresholdOrderColumnIndex;
iaCurrentSessionRound = [null, 2, 2, null, 2, null, null, 2, null, null, 2, 0, 4, null, 2, null, 2, 2, 2, 4];
iaCurrentSessionFactor = [null, null, null, null, null, null, null, null, null, null, null, null, 100, null, null, null, null, null, null, 100];
showTickerInfo(dictTickerInfo = dictCurrentSession, sTickerContainer = 'CurrentSessionTableContainer', sTableId = 'currentSessionTable', iaRound = iaCurrentSessionRound, iaFactor = iaCurrentSessionFactor);
cellMoreColor(sTableName = 'currentSessionTable', vThresholds = vaCurrentSessionTableThresholds, sColumnIndex = sCurrentSessionTableThresholdOrderColumnIndex);
$(document).ready(function () { $('#currentSessionTable').DataTable({ "order": [[iCurrentSessionTableThresholdOrderColumnIndex, 'desc']] }); });
document.body.style.zoom = "190%";
showTabOnHover('TickerTab');

showAnalysisTableInfo(dictTotalsSummary, 'homeTableContainer');

document.getElementById("buyComments").innerHTML = '<b>(' + dictTotalsSummary["CloseDate"] + ') Next Day Buy Signal</b>: If the price drops below the buy price and then rises to that price then buy.';
document.getElementById("sellComments").innerHTML = '<b>(' + dictTotalsSummary["CloseDate"] + ') Next Day Sell Signal</b>: If the price drops below the sell price and then rises to that price then sell.';

document.getElementById("buyHint").innerHTML =
    'Signals were completed end of trade day: <b>(' + dictTotalsSummary["CloseDate"] + ')</b>. Below are ' + Object.keys(dictBuyTickerInfo['Data']).length + ' potential trades.<br>' +
    'The buy conditions were refreshed at <b>' + dictTotalsSummary["RefreshTimestamp"].substring(0, 19) + ' PST</b> and take effect the next trade day.<br>' +
    'If the price drops below the suggested buy price and then rises to or above that price then the buy conditions are satisfied';
document.getElementById("sellHint").innerHTML =
    'Signals were completed end of trade day: <b>(' + dictTotalsSummary["CloseDate"] + ')</b>. Below are ' + Object.keys(dictSellTickerInfo['Data']).length + ' potential trades.<br>' +
    'The sell conditions were refreshed at <b>' + dictTotalsSummary["RefreshTimestamp"].substring(0, 19) + ' PST</b> and take effect the next trade day.<br>' +
    'If the price drops at or below the suggested sell price then the sell conditions are satisfied.';
document.getElementById("tickerHint").innerHTML =
    '' + saTicker.length + ' Tickers were chosen in 2020. The list has been updated in 2024. The list has been updated in 2024. The signals have been back tested since <b>' + dictTotalsSummary["StartDate"] + '</b>.<br>' +
    'Most of these securities have a minimum volume of one million shares a day.  This ensures liquidity.<br>' +
    'The charts compare returns for a security if it is held, if one executes the suggested trades, and also if one maintains a diversified portfolio.';

document.getElementById("LastRefresh").innerHTML = dictTotalsSummary["RefreshTimestamp"].substring(0, 19) + ' PST';

document.getElementById("CurrentSessionTotals").innerHTML =
    'Of ' + dictCurrentSessionCounts["Ticker Count"] + ' tickers ' +
    ' there are ' + dictCurrentSessionCounts["Next Buy Count"] + ' potential buys and ' +
    dictCurrentSessionCounts["Next Sell Count"] + ' potential sells for the trade day after ' + sCloseDate + '. ' +
    fn(dictCurrentSessionCounts["Next Ratio"], '', '%', 0, 100) + ' are in play.<br>' +
    fn(dictCurrentSessionCounts["Current Ratio"], '', '%', 0, 100) + ' were in play on ' + sCloseDate + '. ' +
    dictCurrentSessionCounts["Bought Count"] + ' were bought of ' + dictCurrentSessionCounts["Buy Count"] + ' potential buys' +
    ' (' + fn(dictCurrentSessionCounts["Bought Rate"], '', '%', 0, 100) + ' success rate). ' +
    dictCurrentSessionCounts["Sold Count"] + ' were sold of ' + dictCurrentSessionCounts["Sell Count"] + ' potential sells' +
    ' (' + fn(dictCurrentSessionCounts["Sold Rate"], '', '%', 0, 100) + ' success rate).<br>' +
    'The ' + dictCurrentSessionCounts["Sold Count"] + ' buy/sell pairs of transactions have an average daily return of ' +
    '<span class="tooltip"><b>' + fn(dictCurrentSessionCounts["Average Daily Return"], '', '%', 4, 100) +
    '</b><span class="tooltip-text" style="margin-top: 15px; margin-left: 10px; width: 250px; text-align: center;">Average("Sold Daily Return")</span></span>' +
    ' and a realized average return of ' +
    '<span class="tooltip"><b>' + fn(dictCurrentSessionCounts["Realized Daily Return"], "", "%", 4, 100) +
    '</b><span class="tooltip-text" style="margin-top: 15px; margin-left: 10px; width: 450px; text-align: center;">' +
    'Sum("Days Held" * "Sold Daily Return") / Sum("Days Held")</span></span>';

$(document).ready(function () {
    populateTickerSelector;
    document.getElementById("tickerSelector").selectedIndex = 0;
    $('select[name="tickerSelector"]').val($('select[name="tickerSelector"] option:first-child').val());
});