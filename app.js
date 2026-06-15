// Krishnagiri Farmer's Diary - Complete Application
// 3 Languages: Tamil, Telugu, English - 100% translation
// Transport added to Expenses
// Save as PDF feature
// Created by Shri Muhammed Zabiullah Khan | PrimeSys Solutions

let db;
let currentLanguage = 'tamil';
let editingEntryId = null;
let currentFilterMonth = null;
let currentServerUrl = 'https://krishnagiri-farmers-diary.onrender.com';
let currentMarket = 'hosur';

const CONTACT_EMAIL = '0gbtechintel@gmail.com';
const CONTACT_PHONE = '9087119440';

// Vegetable name translations
const vegetableTranslations = {
    tamil: {
        "Tomato": "தக்காளி",
        "Onion": "வெங்காயம்",
        "Potato": "உருளைக்கிழங்கு",
        "Brinjal": "கத்தரிக்காய்",
        "Carrot": "கேரட்",
        "Cabbage": "முட்டைக்கோஸ்",
        "Cauliflower": "காலிஃபிளவர்",
        "Beetroot": "பீட்ரூட்",
        "Ladies Finger": "வெண்டைக்காய்",
        "Garlic": "பூண்டு",
        "Ginger": "இஞ்சி",
        "Green Chilli": "பச்சை மிளகாய்",
        "Coconut": "தேங்காய்",
        "Pumpkin": "பூசணி",
        "Radish": "முள்ளங்கி",
        "Beans": "பீன்ஸ்",
        "Cucumber": "வெள்ளரிக்காய்",
        "Bitter Gourd": "பாகற்காய்",
        "Drumstick": "முருங்கைக்காய்",
        "Mango": "மாம்பழம்",
        "Amaranth Leaves": "சிறு கீரை",
        "Amla": "நெல்லிக்காய்",
        "Ash gourd": "சாம்பல் பூசணிக்காய்",
        "Baby Corn": "சிறிய மக்காச்சோளம்",
        "Banana Flower": "வாழைப்பூ",
        "Bottle Gourd": "சுரைக்காய்",
        "Broad Beans": "அவரைக்காய்",
        "Butter Beans": "பட்டர் பீன்ஸ்",
        "Capsicum": "குடைமிளகாய்",
        "Cluster beans": "கொத்தவரை",
        "Colocasia": "சேப்பங்கிழங்கு",
        "Colocasia Leaves": "சேப்பங்கிழங்கு கீரை",
        "Coriander Leaves": "கொத்தமல்லி",
        "Corn": "மக்காச்சோளம்",
        "Curry Leaves": "கறிவேப்பிலை",
        "Dill Leaves": "வெந்தயம் இலைகள்",
        "Elephant Yam": "சேனைக்கிழங்கு",
        "Fenugreek Leaves": "வெந்தயக்கீரை",
        "French Beans": "பிரஞ்சு பீன்ஸ்",
        "Green Peas": "பச்சை பட்டாணி",
        "Ivy Gourd": "கோவைக்காய்",
        "Lemon": "எலுமிச்சை",
        "Mango Raw": "மாங்காய்",
        "Mint Leaves": "புதினா",
        "Mushroom": "காளான்",
        "Mustard Leaves": "கடுகு இலைகள்",
        "Onion Big": "பெரிய வெங்காயம்",
        "Onion Green": "பச்சை வெங்காயம்",
        "Onion Small": "சின்ன வெங்காயம்",
        "Raw Banana": "வாழைக்காய்",
        "Ridge Gourd": "பீர்க்கங்காய்",
        "Shallot": "சின்ன வெங்காயம்",
        "Snake Gourd": "புடலங்காய்",
        "Sorrel Leaves": "புளிச்ச கீரை",
        "Spinach": "கீரை",
        "Sweet Potato": "இனிப்பு உருளைக்கிழங்கு"
    },
    telugu: {
        "Tomato": "టమోటా",
        "Onion": "ఉల్లిపాయ",
        "Potato": "బంగాళదుంప",
        "Brinjal": "వంకాయ",
        "Carrot": "క్యారెట్",
        "Cabbage": "క్యాబేజీ",
        "Cauliflower": "కాలీఫ్లవర్",
        "Beetroot": "బీట్రూట్",
        "Ladies Finger": "బెండకాయ",
        "Garlic": "వెల్లుల్లి",
        "Ginger": "అల్లం",
        "Green Chilli": "పచ్చి మిరపకాయ",
        "Coconut": "కొబ్బరి",
        "Pumpkin": "గుమ్మడికాయ",
        "Radish": "ముల్లంగి",
        "Beans": "బీన్స్",
        "Cucumber": "దోసకాయ",
        "Bitter Gourd": "కాకరకాయ",
        "Drumstick": "మునగకాయ",
        "Mango": "మామిడి"
    },
    english: {}
};

function translateVegetable(vegName, lang) {
    if (lang === 'tamil' && vegetableTranslations.tamil[vegName]) {
        return vegetableTranslations.tamil[vegName];
    } else if (lang === 'telugu' && vegetableTranslations.telugu[vegName]) {
        return vegetableTranslations.telugu[vegName];
    }
    return vegName;
}

// Load saved server URL
function loadServerUrl() {
    const saved = localStorage.getItem('api_server_url');
    if (saved) {
        currentServerUrl = saved;
        const serverUrlInput = document.getElementById('serverUrl');
        if (serverUrlInput) serverUrlInput.value = saved;
    }
}

function updateApiServerUrl(url) {
    currentServerUrl = url;
    localStorage.setItem('api_server_url', url);
}

function loadMarketPreference() {
    const saved = localStorage.getItem('preferred_market');
    if (saved && (saved === 'hosur' || saved === 'krishnagiri')) {
        currentMarket = saved;
        const marketSelect = document.getElementById('marketSelect');
        if (marketSelect) marketSelect.value = saved;
    }
}

// ============================================ //
// PDF REPORT GENERATION                        //
// ============================================ //

async function downloadPDFReport() {
    const entries = await getAllEntries();
    const t = translations[currentLanguage];
    
    if (entries.length === 0) {
        showToast(currentLanguage === 'tamil' ? 'PDF உருவாக்க எந்த பதிவுகளும் இல்லை' : 
                   currentLanguage === 'telugu' ? 'PDF సృష్టించడానికి ఎంట్రీలు లేవు' : 
                   'No entries to create PDF');
        return;
    }
    
    // Calculate totals
    let totalIncome = 0, totalExpense = 0;
    entries.forEach(entry => {
        if (entry.type === 'income') totalIncome += entry.amount;
        else totalExpense += entry.amount;
    });
    const balance = totalIncome - totalExpense;
    
    // Create HTML for PDF
    const reportHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Farmer's Diary Report</title>
            <style>
                body {
                    font-family: 'Inter', 'Noto Sans Tamil', 'Noto Sans Telugu', sans-serif;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #065f46;
                    padding-bottom: 10px;
                }
                .header h1 {
                    color: #065f46;
                    margin: 0;
                }
                .header p {
                    color: #666;
                    margin: 5px 0;
                }
                .summary {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    gap: 10px;
                }
                .summary-card {
                    flex: 1;
                    background: #f0fdf4;
                    padding: 10px;
                    border-radius: 8px;
                    text-align: center;
                }
                .summary-card h3 {
                    margin: 0;
                    font-size: 14px;
                    color: #666;
                }
                .summary-card p {
                    margin: 5px 0 0;
                    font-size: 18px;
                    font-weight: bold;
                    color: #065f46;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                .income-row {
                    border-left: 3px solid #10b981;
                }
                .expense-row {
                    border-left: 3px solid #ef4444;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #999;
                    border-top: 1px solid #ddd;
                    padding-top: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${t.appTitle}</h1>
                <p>${t.subtitleText}</p>
                <p>${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="summary">
                <div class="summary-card">
                    <h3>${t.totalIncomeLabel || 'Total Income'}</h3>
                    <p>₹${totalIncome.toLocaleString()}</p>
                </div>
                <div class="summary-card">
                    <h3>${t.totalExpenseLabel || 'Total Expense'}</h3>
                    <p>₹${totalExpense.toLocaleString()}</p>
                </div>
                <div class="summary-card">
                    <h3>${t.netBalanceLabel || 'Net Balance'}</h3>
                    <p>₹${balance.toLocaleString()}</p>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>${t.dateLabel || 'Date'}</th>
                        <th>${t.typeLabel || 'Type'}</th>
                        <th>${t.categoryLabel || 'Category'}</th>
                        <th>${t.amountLabel || 'Amount (₹)'}</th>
                        <th>${t.notesLabel || 'Notes'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${entries.sort((a,b) => new Date(b.date) - new Date(a.date)).map(entry => `
                        <tr class="${entry.type === 'income' ? 'income-row' : 'expense-row'}">
                            <td>${entry.date}</td>
                            <td>${entry.type === 'income' ? (t.incomeText || 'Income') : (t.expenseText || 'Expense')}</td>
                            <td>${entry.category}</td>
                            <td>₹${entry.amount.toLocaleString()}</td>
                            <td>${entry.notes || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="footer">
                <p>Generated by Krishnagiri Farmer's Diary | PrimeSys Solutions</p>
                <p>Contact: ${CONTACT_PHONE} | ${CONTACT_EMAIL}</p>
            </div>
        </body>
        </html>
    `;
    
    // Convert HTML to PDF and download
    const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: `farmers_diary_report_${new Date().toISOString().slice(0,10)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    const element = document.createElement('div');
    element.innerHTML = reportHtml;
    document.body.appendChild(element);
    html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(element);
        showToast(t.pdfSaved || 'PDF saved successfully!');
    });
}

// ============================================ //
// FETCH REAL PRICES FROM BACKEND API          //
// ============================================ //

async function changeMarket() {
    const marketSelect = document.getElementById('marketSelect');
    currentMarket = marketSelect.value;
    localStorage.setItem('preferred_market', currentMarket);
    
    const pricesContainer = document.getElementById('marketPricesList');
    if (pricesContainer) {
        pricesContainer.innerHTML = '<div class="text-center text-gray-500 py-4 col-span-2 md:col-span-4"><i class="fas fa-spinner fa-spin mr-2"></i>Fetching prices...</div>';
    }
    await fetchRealMarketPrices();
    
    const marketName = currentMarket === 'hosur' ? 'Hosur' : 'Krishnagiri';
    showToast(`Switched to ${marketName} market`);
}

async function fetchRealMarketPrices() {
    const pricesContainer = document.getElementById('marketPricesList');
    const errorContainer = document.getElementById('priceError');
    const errorMessageSpan = document.getElementById('priceErrorMessage');
    const refreshBtn = document.getElementById('refreshPricesBtn');
    
    if (!pricesContainer) return;
    
    if (errorContainer) errorContainer.classList.add('hidden');
    pricesContainer.innerHTML = '<div class="text-center text-gray-500 py-4 col-span-2 md:col-span-4"><i class="fas fa-spinner fa-spin mr-2"></i>Fetching prices...</div>';
    
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.style.opacity = '0.5';
    }
    
    try {
        const response = await fetch(`${currentServerUrl}/api/prices?market=${currentMarket}`);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (data.success && data.prices && Object.keys(data.prices).length > 0) {
            const marketName = currentMarket === 'hosur' ? 'Hosur Market' : 'Krishnagiri Market';
            displayMarketPrices(data.prices, marketName);
            if (errorContainer) errorContainer.classList.add('hidden');
            
            localStorage.setItem(`${currentMarket}_prices_cache`, JSON.stringify({
                prices: data.prices,
                timestamp: Date.now()
            }));
        } else {
            throw new Error('No price data received');
        }
        
    } catch (error) {
        console.error('Fetch error:', error);
        
        const cached = localStorage.getItem(`${currentMarket}_prices_cache`);
        if (cached) {
            const cachedData = JSON.parse(cached);
            const hoursSinceFetch = (Date.now() - cachedData.timestamp) / (1000 * 60 * 60);
            
            if (hoursSinceFetch < 24 && cachedData.prices && Object.keys(cachedData.prices).length > 0) {
                const marketName = currentMarket === 'hosur' ? 'Hosur Market' : 'Krishnagiri Market';
                displayMarketPrices(cachedData.prices, `${marketName} (Cached)`);
                
                if (errorContainer) {
                    errorContainer.classList.remove('hidden');
                    let warningMsg = '';
                    if (currentLanguage === 'tamil') {
                        warningMsg = `⚠️ சேவர் இணைப்பு சிக்கல். சேமித்த விலைகளைக் காட்டுகிறது.<br><br>📞 ${CONTACT_PHONE} | ✉️ ${CONTACT_EMAIL}`;
                    } else if (currentLanguage === 'telugu') {
                        warningMsg = `⚠️ సర్వర్ కనెక్షన్ సమస్య. నిల్వ చేసిన ధరలను చూపిస్తోంది.<br><br>📞 ${CONTACT_PHONE} | ✉️ ${CONTACT_EMAIL}`;
                    } else {
                        warningMsg = `⚠️ Server connection issue. Showing cached prices.<br><br>📞 ${CONTACT_PHONE} | ✉️ ${CONTACT_EMAIL}`;
                    }
                    errorMessageSpan.innerHTML = warningMsg;
                }
                return;
            }
        }
        
        if (errorContainer) {
            errorContainer.classList.remove('hidden');
            let errorMsg = '';
            if (currentLanguage === 'tamil') {
                errorMsg = `❌ விலைகளைப் பெற முடியவில்லை<br><br>• இணைய இணைப்பை சரிபார்க்கவும்<br>• சிறிது நேரத்தில் மீண்டும் முயற்சிக்கவும்<br><br>📞 ${CONTACT_PHONE}<br>✉️ ${CONTACT_EMAIL}`;
            } else if (currentLanguage === 'telugu') {
                errorMsg = `❌ ధరలను పొందలేకపోయింది<br><br>• ఇంటర్నెట్ కనెక్షన్ తనిఖీ చేయండి<br>• కొంత సేపటి తర్వాత మళ్లీ ప్రయత్నించండి<br><br>📞 ${CONTACT_PHONE}<br>✉️ ${CONTACT_EMAIL}`;
            } else {
                errorMsg = `❌ Unable to fetch prices<br><br>• Check your internet connection<br>• Try again in a few minutes<br><br>📞 ${CONTACT_PHONE}<br>✉️ ${CONTACT_EMAIL}`;
            }
            errorMessageSpan.innerHTML = errorMsg;
        }
        
        pricesContainer.innerHTML = `<div class="text-center py-6 col-span-2 md:col-span-4">
            <i class="fas fa-cloud-sun-rain text-gray-400 text-4xl mb-2"></i>
            <p class="text-gray-500 text-sm">${currentLanguage === 'tamil' ? 'விலைகள் கிடைக்கவில்லை' : currentLanguage === 'telugu' ? 'ధరలు అందుబాటులో లేవు' : 'Prices unavailable'}</p>
        </div>`;
        
    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.style.opacity = '1';
        }
    }
}

function displayMarketPrices(prices, source) {
    const container = document.getElementById('marketPricesList');
    if (!container) return;
    
    const priceEntries = Object.entries(prices);
    
    if (priceEntries.length === 0) {
        container.innerHTML = `<div class="text-center text-gray-500 py-4 col-span-2 md:col-span-4">
            ${currentLanguage === 'tamil' ? 'விலைகள் கிடைக்கவில்லை' : currentLanguage === 'telugu' ? 'ధరలు అందుబాటులో లేవు' : 'No prices available'}
        </div>`;
        return;
    }
    
    container.innerHTML = priceEntries.map(([crop, price]) => {
        const translatedCrop = translateVegetable(crop, currentLanguage);
        return `
            <div class="bg-green-50 rounded-xl p-2 text-center card-hover">
                <p class="text-green-700 font-bold text-lg">₹${price}</p>
                <p class="text-[10px] text-gray-500 truncate" title="${crop}">${translatedCrop}</p>
            </div>
        `;
    }).join('');
    
    const noteSpan = document.getElementById('priceNote');
    if (noteSpan) {
        if (currentLanguage === 'tamil') {
            noteSpan.innerHTML = `📊 ${source} | ${priceEntries.length} பொருட்கள் | ← → ஸ்க்ரோல் செய்யவும்`;
        } else if (currentLanguage === 'telugu') {
            noteSpan.innerHTML = `📊 ${source} | ${priceEntries.length} వస్తువులు | ← → స్క్రోల్ చేయండి`;
        } else {
            noteSpan.innerHTML = `📊 ${source} | ${priceEntries.length} items | ← → Scroll for more`;
        }
    }
}

async function refreshPrices() {
    await fetchRealMarketPrices();
}

// ============================================ //
// COMPLETE TRANSLATIONS (Tamil, Telugu, English) //
// ============================================ //

const translations = {
    tamil: {
        settingsTitle: "அமைப்புகள்",
        languageTitle: "🌐 மொழி",
        themeTitle: "🎨 வண்ண தீம்",
        serverTitle: "🖥️ சேவர் இணைப்பு",
        serverHelpText: "லேப்டாப்பில் இயக்கவும்: python api_server.py",
        serverNote: "உங்கள் லேப்டாப் அதே WiFi நெட்வொர்க்கில் இருக்க வேண்டும்",
        dataTitle: "🗑️ தரவு மேலாண்மை",
        clearDataBtnText: "எல்லா தரவையும் அழிக்க",
        clearWarning: "எச்சரிக்கை: இது உங்கள் எல்லா பதிவுகளையும் நிரந்தரமாக நீக்கும்",
        aboutTitle: "ℹ️ பற்றி",
        aboutText: "உங்கள் தினசரி வருமானம் மற்றும் செலவுகளை பதிவு செய்யுங்கள்",
        appTitle: "கிருஷ்ணகிரி விவசாயி நாட்குறிப்பு",
        subtitleText: "விவசாயி நாட்குறிப்பு",
        createdByText: "ஷ்ரீ முஹம்மது ஜபியுல்லா கான் | பிரைம் சிஸ் சொல்யூஷன்ஸ்",
        installBtnText: "ஆப் நிறுவுக",
        settingsBtnText: "அமைப்புகள்",
        todayIncomeLabel: "இன்றைய வருமானம்",
        todayExpenseLabel: "இன்றைய செலவு",
        monthIncomeLabel: "மாத வருமானம்",
        monthProfitLabel: "மாத இருப்பு",
        marketPricesTitle: "📊 இன்றைய சந்தை விலைகள்",
        refreshPricesBtn: "புதுப்பி",
        addEntryTitle: "➕ புதிய பதிவு",
        categoryLabel: "வகை",
        amountLabel: "தொகை (₹)",
        notesLabel: "குறிப்புகள்",
        saveBtnText: "💾 பதிவு சேமி",
        updateBtnText: "🔄 பதிவு புதுப்பி",
        historyTitle: "📋 என் நாட்குறிப்பு பதிவுகள்",
        noEntriesText: "இன்னும் பதிவுகள் இல்லை. மேலே உங்கள் முதல் பதிவை உருவாக்கவும்!",
        filterBtn: "வடிகட்டு",
        clearFilterBtn: "அழி",
        deleteConfirm: "இந்த பதிவை நீக்க வேண்டுமா?",
        deleteSuccess: "✅ பதிவு நீக்கப்பட்டது!",
        updateSuccess: "✅ பதிவு புதுப்பிக்கப்பட்டது!",
        saveSuccess: "✅ பதிவு சேமிக்கப்பட்டது!",
        noAmountAlert: "⚠️ தயவுசெய்து தொகையை உள்ளிடவும்!",
        clearConfirm: "⚠️ அனைத்து பதிவுகளையும் நீக்க வேண்டுமா?",
        pdfReportBtn: "PDF சேமி",
        totalIncomeLabel: "மொத்த வருமானம்",
        totalExpenseLabel: "மொத்த செலவு",
        netBalanceLabel: "நிகர இருப்பு",
        dateLabel: "தேதி",
        typeLabel: "வகை",
        incomeText: "வருமானம்",
        expenseText: "செலவு",
        pdfSaved: "PDF வெற்றிகரமாக சேமிக்கப்பட்டது!"
    },
    telugu: {
        settingsTitle: "సెట్టింగ్స్",
        languageTitle: "🌐 భాష",
        themeTitle: "🎨 రంగు",
        serverTitle: "🖥️ సర్వర్ కనెక్షన్",
        serverHelpText: "ల్యాప్టాప్‌లో అమలు చేయండి: python api_server.py",
        serverNote: "మీ ల్యాప్టాప్ అదే WiFi నెట్‌వర్క్‌లో ఉండాలి",
        dataTitle: "🗑️ డేటా మేనేజ్మెంట్",
        clearDataBtnText: "అన్ని డేటాను తొలగించు",
        clearWarning: "హెచ్చరిక: ఇది మీ అన్ని ఎంట్రీలను శాశ్వతంగా తొలగిస్తుంది",
        aboutTitle: "ℹ️ గురించి",
        aboutText: "మీ రోజువారీ ఆదాయం & ఖర్చులను ట్రాక్ చేయండి",
        appTitle: "కృష్ణగిరి రైతు డైరీ",
        subtitleText: "రైతు డైరీ",
        createdByText: "ష్రీ ముహమ్మద్ జబియుల్లా ఖాన్ | ప్రైమ్సిస్ సొల్యూషన్స్",
        installBtnText: "యాప్ ఇన్స్టాల్",
        settingsBtnText: "సెట్టింగ్స్",
        todayIncomeLabel: "నేటి ఆదాయం",
        todayExpenseLabel: "నేటి ఖర్చు",
        monthIncomeLabel: "నెలవారీ ఆదాయం",
        monthProfitLabel: "నెలవారీ బ్యాలెన్స్",
        marketPricesTitle: "📊 నేటి మార్కెట్ ధరలు",
        refreshPricesBtn: "రిఫ్రెష్",
        addEntryTitle: "➕ కొత్త ఎంట్రీ",
        categoryLabel: "వర్గం",
        amountLabel: "మొత్తం (₹)",
        notesLabel: "గమనికలు",
        saveBtnText: "💾 ఎంట్రీ సేవ్",
        updateBtnText: "🔄 ఎంట్రీ అప్డేట్",
        historyTitle: "📋 నా డైరీ ఎంట్రీలు",
        noEntriesText: "ఇంకా ఎంట్రీలు లేవు. పైన మీ మొదటి ఎంట్రీని సృష్టించండి!",
        filterBtn: "ఫిల్టర్",
        clearFilterBtn: "క్లియర్",
        deleteConfirm: "ఈ ఎంట్రీని తొలగించాలా?",
        deleteSuccess: "✅ ఎంట్రీ తొలగించబడింది!",
        updateSuccess: "✅ ఎంట్రీ అప్డేట్ చేయబడింది!",
        saveSuccess: "✅ ఎంట్రీ సేవ్ చేయబడింది!",
        noAmountAlert: "⚠️ దయచేసి మొత్తాన్ని నమోదు చేయండి!",
        clearConfirm: "⚠️ అన్ని ఎంట్రీలను తొలగించాలా?",
        pdfReportBtn: "PDF సేవ్",
        totalIncomeLabel: "మొత్తం ఆదాయం",
        totalExpenseLabel: "మొత్తం ఖర్చు",
        netBalanceLabel: "నికర బ్యాలెన్స్",
        dateLabel: "తేదీ",
        typeLabel: "రకం",
        incomeText: "ఆదాయం",
        expenseText: "ఖర్చు",
        pdfSaved: "PDF విజయవంతంగా సేవ్ చేయబడింది!"
    },
    english: {
        settingsTitle: "Settings",
        languageTitle: "🌐 Language",
        themeTitle: "🎨 Theme Color",
        serverTitle: "🖥️ Server Connection",
        serverHelpText: "Run on laptop: python api_server.py",
        serverNote: "Your laptop must be on the same WiFi network",
        dataTitle: "🗑️ Data Management",
        clearDataBtnText: "Clear All Data",
        clearWarning: "Warning: This will delete all your entries permanently",
        aboutTitle: "ℹ️ About",
        aboutText: "Track your daily income and expenses",
        appTitle: "Krishnagiri Farmer's Diary",
        subtitleText: "Farmer's Diary",
        createdByText: "Shri Muhammed Zabiullah Khan | PrimeSys Solutions",
        installBtnText: "Install App",
        settingsBtnText: "Settings",
        todayIncomeLabel: "Today's Income",
        todayExpenseLabel: "Today's Expense",
        monthIncomeLabel: "Month Income",
        monthProfitLabel: "Month Balance",
        marketPricesTitle: "📊 Today's Market Prices",
        refreshPricesBtn: "Refresh",
        addEntryTitle: "➕ Add New Entry",
        categoryLabel: "Category",
        amountLabel: "Amount (₹)",
        notesLabel: "Notes",
        saveBtnText: "💾 Save Entry",
        updateBtnText: "🔄 Update Entry",
        historyTitle: "📋 My Diary Entries",
        noEntriesText: "No entries yet. Create your first entry above!",
        filterBtn: "Filter",
        clearFilterBtn: "Clear",
        deleteConfirm: "Delete this entry?",
        deleteSuccess: "✅ Entry deleted!",
        updateSuccess: "✅ Entry updated!",
        saveSuccess: "✅ Entry saved!",
        noAmountAlert: "⚠️ Please enter amount!",
        clearConfirm: "⚠️ Delete all entries?",
        pdfReportBtn: "Save PDF",
        totalIncomeLabel: "Total Income",
        totalExpenseLabel: "Total Expense",
        netBalanceLabel: "Net Balance",
        dateLabel: "Date",
        typeLabel: "Type",
        incomeText: "Income",
        expenseText: "Expense",
        pdfSaved: "PDF saved successfully!"
    }
};

// ============================================ //
// LANGUAGE AND UI FUNCTIONS                    //
// ============================================ //

function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('app_language', lang);
    applyTranslations();
    let msg = lang === 'tamil' ? '✅ தமிழுக்கு மாற்றப்பட்டது' : (lang === 'telugu' ? '✅ తెలుగుకు మార్చబడింది' : '✅ Switched to English');
    showToast(msg);
    fetchRealMarketPrices(); // Refresh prices to show translated vegetable names
}

function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }

function applyTranslations() {
    const t = translations[currentLanguage];
    
    setText('settingsTitle', t.settingsTitle);
    setText('languageTitle', t.languageTitle);
    setText('themeTitle', t.themeTitle);
    setText('serverTitle', t.serverTitle);
    setText('serverHelpText', t.serverHelpText);
    setText('serverNote', t.serverNote);
    setText('dataTitle', t.dataTitle);
    setText('clearDataBtnText', t.clearDataBtnText);
    setText('clearWarning', t.clearWarning);
    setText('aboutTitle', t.aboutTitle);
    setText('aboutText', t.aboutText);
    setText('appTitle', t.appTitle);
    setText('subtitleText', t.subtitleText);
    setText('createdByText', t.createdByText);
    setText('installBtnText', t.installBtnText);
    setText('settingsBtnText', t.settingsBtnText);
    setText('todayIncomeLabel', t.todayIncomeLabel);
    setText('todayExpenseLabel', t.todayExpenseLabel);
    setText('monthIncomeLabel', t.monthIncomeLabel);
    setText('monthProfitLabel', t.monthProfitLabel);
    setText('marketPricesTitle', t.marketPricesTitle);
    setText('refreshPricesBtn', t.refreshPricesBtn);
    setText('addEntryTitle', t.addEntryTitle);
    setText('categoryLabel', t.categoryLabel);
    setText('amountLabel', t.amountLabel);
    setText('notesLabel', t.notesLabel);
    setText('saveBtnText', editingEntryId ? t.updateBtnText : t.saveBtnText);
    setText('historyTitle', t.historyTitle);
    setText('noEntriesText', t.noEntriesText);
    setText('filterBtn', t.filterBtn);
    setText('clearFilterBtn', t.clearFilterBtn);
    setText('pdfReportBtn', t.pdfReportBtn);
    
    // Update category dropdown
    const categorySelect = document.getElementById('category');
    const entryType = document.getElementById('entryType');
    
    if (categorySelect) {
        if (currentLanguage === 'tamil') {
            categorySelect.options[0].text = '🌾 பயிர் விற்பனை';
            categorySelect.options[1].text = '🥛 பால் விற்பனை';
            categorySelect.options[2].text = '🥚 முட்டை விற்பனை';
            categorySelect.options[3].text = '🌱 உரம்';
            categorySelect.options[4].text = '🐛 மருந்து';
            categorySelect.options[5].text = '👨‍🌾 கூலி';
            categorySelect.options[6].text = '🚛 போக்குவரத்து';
            categorySelect.options[7].text = '📋 மற்றவை';
        } else if (currentLanguage === 'telugu') {
            categorySelect.options[0].text = '🌾 పంట అమ్మకం';
            categorySelect.options[1].text = '🥛 పాలు అమ్మకం';
            categorySelect.options[2].text = '🥚 గుడ్లు అమ్మకం';
            categorySelect.options[3].text = '🌱 ఎరువు';
            categorySelect.options[4].text = '🐛 మందు';
            categorySelect.options[5].text = '👨‍🌾 కూలీ';
            categorySelect.options[6].text = '🚛 రవాణా';
            categorySelect.options[7].text = '📋 ఇతర';
        } else {
            categorySelect.options[0].text = '🌾 Crop Sale';
            categorySelect.options[1].text = '🥛 Milk Sale';
            categorySelect.options[2].text = '🥚 Egg Sale';
            categorySelect.options[3].text = '🌱 Fertilizer';
            categorySelect.options[4].text = '🐛 Pesticide';
            categorySelect.options[5].text = '👨‍🌾 Labor';
            categorySelect.options[6].text = '🚛 Transport';
            categorySelect.options[7].text = '📋 Other';
        }
    }
    
    if (entryType) {
        if (currentLanguage === 'tamil') {
            entryType.options[0].text = '💰 வருமானம்';
            entryType.options[1].text = '💸 செலவு';
        } else if (currentLanguage === 'telugu') {
            entryType.options[0].text = '💰 ఆదాయం';
            entryType.options[1].text = '💸 ఖర్చు';
        } else {
            entryType.options[0].text = '💰 Income';
            entryType.options[1].text = '💸 Expense';
        }
    }
    
    loadEntries();
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function openSettings() {
    document.getElementById('settingsPanel').classList.add('open');
    document.getElementById('settingsOverlay').classList.add('active');
}

function closeSettings() {
    document.getElementById('settingsPanel').classList.remove('open');
    document.getElementById('settingsOverlay').classList.remove('active');
}

function changeTheme(theme) {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('app_theme', theme);
    let msg = currentLanguage === 'tamil' ? 'வண்ண தீம் மாற்றப்பட்டது' : (currentLanguage === 'telugu' ? 'రంగు మార్చబడింది' : 'Theme changed');
    showToast(msg);
    closeSettings();
}

// ============================================ //
// DATABASE FUNCTIONS                           //
// ============================================ //

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('FarmersDiaryDB', 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => { db = request.result; resolve(db); };
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('entries')) {
                db.createObjectStore('entries', { keyPath: 'id' });
            }
        };
    });
}

function saveEntryToDB(entry) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['entries'], 'readwrite');
        const store = tx.objectStore('entries');
        const request = store.put(entry);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function deleteEntryFromDB(entryId) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['entries'], 'readwrite');
        const store = tx.objectStore('entries');
        const request = store.delete(entryId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function getAllEntries() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['entries'], 'readonly');
        const store = tx.objectStore('entries');
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

function getEntryById(entryId) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(['entries'], 'readonly');
        const store = tx.objectStore('entries');
        const request = store.get(entryId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// ============================================ //
// CRUD OPERATIONS                              //
// ============================================ //

async function saveEntry() {
    const t = translations[currentLanguage];
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (!amount || amount <= 0) {
        alert(t.noAmountAlert);
        return;
    }
    
    const entryType = document.getElementById('entryType').value;
    const category = document.getElementById('category').value;
    const notes = document.getElementById('notes').value;
    const date = document.getElementById('entryDate').value;
    const month = date.slice(0, 7);
    
    const entry = {
        id: editingEntryId || Date.now(),
        type: entryType,
        category: category,
        amount: amount,
        notes: notes,
        date: date,
        month: month,
        timestamp: new Date().toISOString()
    };
    
    await saveEntryToDB(entry);
    showToast(editingEntryId ? t.updateSuccess : t.saveSuccess);
    
    editingEntryId = null;
    document.getElementById('amount').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('entryType').value = 'income';
    document.getElementById('category').value = 'Crop Sale';
    
    const saveBtn = document.getElementById('saveEntryBtn');
    if (saveBtn) saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t.saveBtnText}`;
    
    loadEntries();
}

async function editEntry(entryId) {
    const t = translations[currentLanguage];
    const entry = await getEntryById(entryId);
    if (!entry) return;
    
    editingEntryId = entryId;
    document.getElementById('entryType').value = entry.type;
    document.getElementById('category').value = entry.category;
    document.getElementById('amount').value = entry.amount;
    document.getElementById('notes').value = entry.notes;
    document.getElementById('entryDate').value = entry.date;
    
    const saveBtn = document.getElementById('saveEntryBtn');
    if (saveBtn) saveBtn.innerHTML = `<i class="fas fa-edit"></i> ${t.updateBtnText}`;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteEntry(entryId) {
    const t = translations[currentLanguage];
    if (confirm(t.deleteConfirm)) {
        await deleteEntryFromDB(entryId);
        await loadEntries();
        showToast(t.deleteSuccess);
        if (editingEntryId === entryId) {
            editingEntryId = null;
            const saveBtn = document.getElementById('saveEntryBtn');
            if (saveBtn) saveBtn.innerHTML = `<i class="fas fa-save"></i> ${t.saveBtnText}`;
        }
    }
}

// ============================================ //
// FILTER FUNCTIONS                             //
// ============================================ //

async function filterByMonth() {
    const monthInput = document.getElementById('monthFilter');
    currentFilterMonth = monthInput.value;
    await loadEntries();
}

async function clearFilter() {
    document.getElementById('monthFilter').value = new Date().toISOString().slice(0, 7);
    currentFilterMonth = null;
    await loadEntries();
}

async function loadEntries() {
    const entries = await getAllEntries();
    const container = document.getElementById('entriesList');
    const t = translations[currentLanguage];
    
    let filteredEntries = [...entries];
    if (currentFilterMonth) {
        filteredEntries = filteredEntries.filter(e => e.month === currentFilterMonth);
    }
    filteredEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredEntries.length === 0) {
        if (container) {
            container.innerHTML = `<div class="text-center text-gray-500 py-8"><i class="fas fa-book-open text-4xl mb-2 opacity-50"></i><p class="text-sm">${t.noEntriesText}</p></div>`;
        }
        updateSummary(entries);
        return;
    }
    
    container.innerHTML = filteredEntries.map(entry => `
        <div class="entry-item border rounded-xl p-3 hover:shadow-md transition bg-white">
            <div class="flex flex-wrap justify-between items-center gap-2">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="font-bold ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                        ${entry.type === 'income' ? '💰' : '💸'} ${entry.category}
                    </span>
                    <span class="text-gray-600 text-sm">₹${entry.amount.toLocaleString()}</span>
                </div>
                <div><span class="text-xs text-gray-500">${entry.date}</span></div>
            </div>
            ${entry.notes ? `<div class="text-xs text-gray-400 mt-1">📝 ${escapeHtml(entry.notes)}</div>` : ''}
            <div class="flex gap-2 mt-2 pt-2 border-t">
                <button onclick="editEntry(${entry.id})" class="flex-1 bg-yellow-500 text-white px-2 py-1.5 rounded-lg text-xs hover:bg-yellow-600 transition">
                    <i class="fas fa-edit"></i> ${t.updateBtnText}
                </button>
                <button onclick="deleteEntry(${entry.id})" class="flex-1 bg-red-500 text-white px-2 py-1.5 rounded-lg text-xs hover:bg-red-600 transition">
                    <i class="fas fa-trash"></i> ${t.deleteConfirm.split('?')[0]}
                </button>
            </div>
        </div>
    `).join('');
    
    updateSummary(entries);
}

function updateSummary(entries) {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    let todayIncome = 0, todayExpense = 0;
    let monthIncome = 0, monthExpense = 0;
    
    entries.forEach(entry => {
        if (entry.date === today) {
            if (entry.type === 'income') todayIncome += entry.amount;
            else todayExpense += entry.amount;
        }
        if (entry.month === currentMonth) {
            if (entry.type === 'income') monthIncome += entry.amount;
            else monthExpense += entry.amount;
        }
    });
    
    const monthProfit = monthIncome - monthExpense;
    
    document.getElementById('todayIncome').textContent = `₹${todayIncome.toLocaleString()}`;
    document.getElementById('todayExpense').textContent = `₹${todayExpense.toLocaleString()}`;
    document.getElementById('monthIncome').textContent = `₹${monthIncome.toLocaleString()}`;
    
    const monthProfitEl = document.getElementById('monthProfit');
    monthProfitEl.textContent = `₹${Math.abs(monthProfit).toLocaleString()}`;
    monthProfitEl.className = `text-xl font-bold ${monthProfit >= 0 ? 'text-green-600' : 'text-red-600'}`;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function clearAllData() {
    const t = translations[currentLanguage];
    if (confirm(t.clearConfirm)) {
        const tx = db.transaction(['entries'], 'readwrite');
        tx.objectStore('entries').clear();
        await tx.done;
        await loadEntries();
        showToast('✅ All data cleared!');
        closeSettings();
    }
}

// ============================================ //
// INITIALIZATION                               //
// ============================================ //

async function init() {
    try {
        const savedLanguage = localStorage.getItem('app_language');
        if (savedLanguage && (savedLanguage === 'tamil' || savedLanguage === 'telugu' || savedLanguage === 'english')) {
            currentLanguage = savedLanguage;
        }
        
        const savedTheme = localStorage.getItem('app_theme');
        if (savedTheme) document.body.classList.add(`theme-${savedTheme}`);
        
        loadServerUrl();
        loadMarketPreference();
        await initDB();
        await loadEntries();
        await fetchRealMarketPrices();
        
        setInterval(fetchRealMarketPrices, 30 * 60 * 1000);
        applyTranslations();
        
        console.log('✅ Farmer\'s Diary Ready!');
    } catch (error) {
        console.error('Init error:', error);
    }
}

// Make functions global
window.setLanguage = setLanguage;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.changeTheme = changeTheme;
window.saveEntry = saveEntry;
window.editEntry = editEntry;
window.deleteEntry = deleteEntry;
window.filterByMonth = filterByMonth;
window.clearFilter = clearFilter;
window.clearAllData = clearAllData;
window.refreshPrices = refreshPrices;
window.downloadPDFReport = downloadPDFReport;
window.changeMarket = changeMarket;
window.updateApiServerUrl = updateApiServerUrl;

init();
