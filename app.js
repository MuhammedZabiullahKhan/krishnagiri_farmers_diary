// Krishnagiri Farmer's Diary - Complete Application
// Mobile-First, Fully Translated (Tamil, Telugu, English)
// Features: Income/Expense Tracking, Hosur/Krishnagiri Market Prices, PDF Report
// Created by Shri Muhammed Zabiullah Khan | PrimeSys Solutions

let db;
let currentLanguage = 'tamil';
let editingEntryId = null;
let currentFilterMonth = null;
let currentMarket = 'hosur';
let currentServerUrl = 'https://krishnagiri-farmers-diary.onrender.com';

const CONTACT = { email: '0gbtechintel@gmail.com', phone: '9087119440' };

// ============================================ //
// COMPLETE VEGETABLE NAME TRANSLATIONS         //
// ============================================ //
const vegetableNames = {
    tamil: {
        "Onion Big": "பெரிய வெங்காயம்", "Onion Small": "சின்ன வெங்காயம்", "Tomato": "தக்காளி",
        "Green Chilli": "பச்சை மிளகாய்", "Beetroot": "பீட்ரூட்", "Potato": "உருளைக்கிழங்கு",
        "Raw Banana": "வாழைக்காய்", "Amaranth Leaves": "சிறு கீரை", "Amla": "நெல்லிக்காய்",
        "Ash gourd": "சாம்பல் பூசணிக்காய்", "Baby Corn": "சிறிய மக்காச்சோளம்", "Banana Flower": "வாழைப்பூ",
        "Capsicum": "குடைமிளகாய்", "Bitter Gourd": "பாகற்காய்", "Bottle Gourd": "சுரைக்காய்",
        "Butter Beans": "பட்டர் பீன்ஸ்", "Broad Beans": "அவரைக்காய்", "Cabbage": "முட்டைக்கோஸ்",
        "Carrot": "கேரட்", "Cauliflower": "காலிஃபிளவர்", "Cluster beans": "கொத்தவரை",
        "Coconut": "தேங்காய்", "Colocasia Leaves": "சேப்பங்கிழங்கு கீரை", "Colocasia": "சேப்பங்கிழங்கு",
        "Coriander Leaves": "கொத்தமல்லி", "Corn": "மக்காச்சோளம்", "Cucumber": "வெள்ளரிக்காய்",
        "Curry Leaves": "கறிவேப்பிலை", "Dill Leaves": "வெந்தயம் இலைகள்", "Drumsticks": "முருங்கைக்காய்",
        "Brinjal": "கத்தரிக்காய்", "Brinjal (Big)": "பெரிய கத்தரிக்காய்", "Elephant Yam": "சேனைக்கிழங்கு",
        "Fenugreek Leaves": "வெந்தயக்கீரை", "French Beans": "பிரஞ்சு பீன்ஸ்", "Garlic": "பூண்டு",
        "Ginger": "இஞ்சி", "Onion Green": "பச்சை வெங்காயம்", "Green Peas": "பச்சை பட்டாணி",
        "Ivy Gourd": "கோவைக்காய்", "Lemon": "எலுமிச்சை", "Mango Raw": "மாங்காய்",
        "Mint Leaves": "புதினா", "Mushroom": "காளான்", "Mustard Leaves": "கடுகு இலைகள்",
        "Ladies Finger": "வெண்டைக்காய்", "Pumpkin": "பூசணி", "Radish": "முள்ளங்கி",
        "Ridge Gourd": "பீர்க்கங்காய்", "Shallot": "சின்ன வெங்காயம்", "Snake Gourd": "புடலங்காய்",
        "Sorrel Leaves": "புளிச்ச கீரை", "Spinach": "கீரை", "Sweet Potato": "இனிப்பு உருளைக்கிழங்கு"
    },
    telugu: {
        "Onion Big": "పెద్ద ఉల్లిపాయ", "Onion Small": "చిన్న ఉల్లిపాయ", "Tomato": "టమోటా",
        "Green Chilli": "పచ్చి మిరపకాయ", "Beetroot": "బీట్రూట్", "Potato": "బంగాళదుంప",
        "Raw Banana": "అరటికాయ", "Cabbage": "క్యాబేజీ", "Carrot": "క్యారెట్",
        "Cauliflower": "కాలీఫ్లవర్", "Coconut": "కొబ్బరి", "Brinjal": "వంకాయ",
        "Garlic": "వెల్లుల్లి", "Ginger": "అల్లం", "Ladies Finger": "బెండకాయ",
        "Pumpkin": "గుమ్మడికాయ", "Radish": "ముల్లంగి", "Drumsticks": "మునగకాయ",
        "Lemon": "నిమ్మకాయ", "Mango Raw": "మామిడికాయ", "Mint Leaves": "పుదీనా",
        "Sweet Potato": "చిలగడదుంప"
    },
    english: {}
};

function translateVegetable(name, lang) {
    if (lang === 'tamil' && vegetableNames.tamil[name]) return vegetableNames.tamil[name];
    if (lang === 'telugu' && vegetableNames.telugu[name]) return vegetableNames.telugu[name];
    return name;
}

// ============================================ //
// TRANSLATIONS (UI)                            //
// ============================================ //
const translations = {
    tamil: {
        appTitle: "கிருஷ்ணகிரி விவசாயி நாட்குறிப்பு", subtitleText: "விவசாயி நாட்குறிப்பு",
        settingsTitle: "அமைப்புகள்", languageTitle: "மொழி", marketTitle: "சந்தை", themeTitle: "வண்ண தீம்",
        serverTitle: "சேவர் இணைப்பு", dataTitle: "தரவு மேலாண்மை", clearWarning: "எச்சரிக்கை: அனைத்து பதிவுகளும் நிரந்தரமாக நீங்கும்",
        todayIncomeLabel: "இன்றைய வருமானம்", todayExpenseLabel: "இன்றைய செலவு", monthIncomeLabel: "மாத வருமானம்", monthBalanceLabel: "மாத இருப்பு",
        marketTitleText: "📊 இன்றைய சந்தை விலைகள்", addEntryTitle: "➕ புதிய பதிவு", historyTitle: "📋 என் பதிவுகள்",
        filterBtn: "வடிகட்டு", clearFilterBtn: "அழி", pdfBtn: "PDF", saveBtnText: "💾 பதிவு சேமி", updateBtnText: "🔄 பதிவு புதுப்பி",
        noEntriesText: "இன்னும் பதிவுகள் இல்லை. மேலே உங்கள் முதல் பதிவை உருவாக்கவும்!",
        deleteConfirm: "இந்த பதிவை நீக்க வேண்டுமா?", deleteSuccess: "✅ பதிவு நீக்கப்பட்டது!", updateSuccess: "✅ பதிவு புதுப்பிக்கப்பட்டது!",
        saveSuccess: "✅ பதிவு சேமிக்கப்பட்டது!", noAmountAlert: "⚠️ தயவுசெய்து தொகையை உள்ளிடவும்!", clearConfirm: "⚠️ அனைத்து பதிவுகளையும் நீக்க வேண்டுமா?",
        totalIncomeLabel: "மொத்த வருமானம்", totalExpenseLabel: "மொத்த செலவு", netBalanceLabel: "நிகர இருப்பு", dateLabel: "தேதி", typeLabel: "வகை",
        incomeText: "வருமானம்", expenseText: "செலவு", pdfSaved: "PDF வெற்றிகரமாக சேமிக்கப்பட்டது!"
    },
    telugu: {
        appTitle: "కృష్ణగిరి రైతు డైరీ", subtitleText: "రైతు డైరీ",
        settingsTitle: "సెట్టింగ్స్", languageTitle: "భాష", marketTitle: "మార్కెట్", themeTitle: "రంగు",
        serverTitle: "సర్వర్", dataTitle: "డేటా", clearWarning: "హెచ్చరిక: అన్ని ఎంట్రీలు శాశ్వతంగా తొలగించబడతాయి",
        todayIncomeLabel: "నేటి ఆదాయం", todayExpenseLabel: "నేటి ఖర్చు", monthIncomeLabel: "నెలవారీ ఆదాయం", monthBalanceLabel: "నెలవారీ బ్యాలెన్స్",
        marketTitleText: "📊 నేటి మార్కెట్ ధరలు", addEntryTitle: "➕ కొత్త ఎంట్రీ", historyTitle: "📋 నా ఎంట్రీలు",
        filterBtn: "ఫిల్టర్", clearFilterBtn: "క్లియర్", pdfBtn: "PDF", saveBtnText: "💾 ఎంట్రీ సేవ్", updateBtnText: "🔄 ఎంట్రీ అప్డేట్",
        noEntriesText: "ఇంకా ఎంట్రీలు లేవు. పైన మీ మొదటి ఎంట్రీని సృష్టించండి!",
        deleteConfirm: "ఈ ఎంట్రీని తొలగించాలా?", deleteSuccess: "✅ ఎంట్రీ తొలగించబడింది!", updateSuccess: "✅ ఎంట్రీ అప్డేట్ చేయబడింది!",
        saveSuccess: "✅ ఎంట్రీ సేవ్ చేయబడింది!", noAmountAlert: "⚠️ దయచేసి మొత్తాన్ని నమోదు చేయండి!", clearConfirm: "⚠️ అన్ని ఎంట్రీలను తొలగించాలా?",
        totalIncomeLabel: "మొత్తం ఆదాయం", totalExpenseLabel: "మొత్తం ఖర్చు", netBalanceLabel: "నికర బ్యాలెన్స్", dateLabel: "తేదీ", typeLabel: "రకం",
        incomeText: "ఆదాయం", expenseText: "ఖర్చు", pdfSaved: "PDF విజయవంతంగా సేవ్ చేయబడింది!"
    },
    english: {
        appTitle: "Krishnagiri Farmer's Diary", subtitleText: "Farmer's Diary",
        settingsTitle: "Settings", languageTitle: "Language", marketTitle: "Market", themeTitle: "Theme",
        serverTitle: "Server", dataTitle: "Data", clearWarning: "Warning: Deletes all entries permanently",
        todayIncomeLabel: "Today's Income", todayExpenseLabel: "Today's Expense", monthIncomeLabel: "Month Income", monthBalanceLabel: "Month Balance",
        marketTitleText: "📊 Today's Market Prices", addEntryTitle: "➕ Add New Entry", historyTitle: "📋 My Entries",
        filterBtn: "Filter", clearFilterBtn: "Clear", pdfBtn: "PDF", saveBtnText: "💾 Save Entry", updateBtnText: "🔄 Update Entry",
        noEntriesText: "No entries yet. Create your first entry above!",
        deleteConfirm: "Delete this entry?", deleteSuccess: "✅ Entry deleted!", updateSuccess: "✅ Entry updated!",
        saveSuccess: "✅ Entry saved!", noAmountAlert: "⚠️ Please enter amount!", clearConfirm: "⚠️ Delete all entries?",
        totalIncomeLabel: "Total Income", totalExpenseLabel: "Total Expense", netBalanceLabel: "Net Balance", dateLabel: "Date", typeLabel: "Type",
        incomeText: "Income", expenseText: "Expense", pdfSaved: "PDF saved successfully!"
    }
};

// Apply UI translations
function applyTranslations() {
    const t = translations[currentLanguage];
    const ids = ['appTitle', 'subtitleText', 'settingsTitle', 'languageTitle', 'marketTitle', 'themeTitle', 'serverTitle', 'dataTitle', 'clearWarning', 'todayIncomeLabel', 'todayExpenseLabel', 'monthIncomeLabel', 'monthBalanceLabel', 'marketTitleText', 'addEntryTitle', 'historyTitle', 'filterBtn', 'clearFilterBtn', 'pdfBtn', 'noEntriesText', 'totalIncomeLabel', 'totalExpenseLabel', 'netBalanceLabel', 'dateLabel', 'typeLabel'];
    ids.forEach(id => { let el = document.getElementById(id); if(el) el.textContent = t[id]; });
    setSaveButtonText();
    loadEntries(); // Refresh entries to update buttons
}

function setSaveButtonText() {
    let btn = document.getElementById('saveBtnText');
    if(btn) btn.textContent = editingEntryId ? translations[currentLanguage].updateBtnText : translations[currentLanguage].saveBtnText;
}

function showToast(msg) { let toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = msg; document.body.appendChild(toast); setTimeout(() => toast.remove(), 2000); }

function setLanguage(lang) { currentLanguage = lang; localStorage.setItem('app_language', lang); applyTranslations(); fetchRealMarketPrices(); showToast(lang === 'tamil' ? '✅ தமிழுக்கு மாற்றப்பட்டது' : (lang === 'telugu' ? '✅ తెలుగుకు మార్చబడింది' : '✅ Switched to English')); }

function setMarket(market) { currentMarket = market; localStorage.setItem('preferred_market', market); fetchRealMarketPrices(); showToast(`Switched to ${market === 'hosur' ? 'Hosur' : 'Krishnagiri'} market`); }

// ============================================ //
// MARKET PRICES (LIVE FETCH)                   //
// ============================================ //
async function fetchRealMarketPrices() {
    const container = document.getElementById('marketPricesList');
    const errorDiv = document.getElementById('priceError');
    if (!container) return;
    container.innerHTML = '<div class="text-center text-gray-500 py-8 col-span-full">Fetching prices...</div>';
    try {
        const response = await fetch(`${currentServerUrl}/api/prices?market=${currentMarket}`);
        const data = await response.json();
        if (data.success && data.prices && Object.keys(data.prices).length > 0) {
            const entries = Object.entries(data.prices).slice(0, 30);
            container.innerHTML = entries.map(([veg, price]) => `
                <div class="price-card">
                    <div class="price-value">₹${price}</div>
                    <div class="price-name" title="${veg}">${translateVegetable(veg, currentLanguage)}</div>
                </div>
            `).join('');
            if (errorDiv) errorDiv.classList.add('hidden');
        } else throw new Error('No data');
    } catch (error) {
        console.error(error);
        if (errorDiv) { errorDiv.classList.remove('hidden'); errorDiv.textContent = `⚠️ Cannot fetch prices. Check server connection. Contact: ${CONTACT.phone}`; }
        container.innerHTML = '<div class="text-center text-gray-500 py-8 col-span-full">Unable to load prices</div>';
    }
}

// ============================================ //
// INDEXEDDB SETUP & CRUD                       //
// ============================================ //
function initDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open('FarmersDiaryDB', 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => { db = request.result; resolve(db); };
        request.onupgradeneeded = (e) => {
            let db = e.target.result;
            if (!db.objectStoreNames.contains('entries')) db.createObjectStore('entries', { keyPath: 'id' });
        };
    });
}

function saveEntryToDB(entry) { return new Promise((resolve, reject) => { let tx = db.transaction(['entries'], 'readwrite'); let store = tx.objectStore('entries'); let request = store.put(entry); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); }); }
function deleteEntryFromDB(id) { return new Promise((resolve, reject) => { let tx = db.transaction(['entries'], 'readwrite'); let store = tx.objectStore('entries'); let request = store.delete(id); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); }); }
function getAllEntries() { return new Promise((resolve, reject) => { let tx = db.transaction(['entries'], 'readonly'); let store = tx.objectStore('entries'); let request = store.getAll(); request.onsuccess = () => resolve(request.result || []); request.onerror = () => reject(request.error); }); }
function getEntryById(id) { return new Promise((resolve, reject) => { let tx = db.transaction(['entries'], 'readonly'); let store = tx.objectStore('entries'); let request = store.get(id); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }

async function saveEntry() {
    let amount = parseFloat(document.getElementById('amount').value);
    if (!amount || amount <= 0) { alert(translations[currentLanguage].noAmountAlert); return; }
    let entry = {
        id: editingEntryId || Date.now(),
        type: document.getElementById('entryType').value,
        category: document.getElementById('category').value,
        amount: amount,
        notes: document.getElementById('notes').value,
        date: document.getElementById('entryDate').value,
        month: document.getElementById('entryDate').value.slice(0,7),
        timestamp: new Date().toISOString()
    };
    await saveEntryToDB(entry);
    showToast(editingEntryId ? translations[currentLanguage].updateSuccess : translations[currentLanguage].saveSuccess);
    editingEntryId = null;
    document.getElementById('amount').value = '';
    document.getElementById('notes').value = '';
    document.getElementById('entryDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('entryType').value = 'income';
    document.getElementById('category').value = 'Crop Sale';
    setSaveButtonText();
    loadEntries();
}

async function editEntry(id) {
    let entry = await getEntryById(id);
    if (!entry) return;
    editingEntryId = id;
    document.getElementById('entryType').value = entry.type;
    document.getElementById('category').value = entry.category;
    document.getElementById('amount').value = entry.amount;
    document.getElementById('notes').value = entry.notes;
    document.getElementById('entryDate').value = entry.date;
    setSaveButtonText();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteEntry(id) {
    if (confirm(translations[currentLanguage].deleteConfirm)) {
        await deleteEntryFromDB(id);
        if (editingEntryId === id) { editingEntryId = null; setSaveButtonText(); }
        loadEntries();
        showToast(translations[currentLanguage].deleteSuccess);
    }
}

async function loadEntries() {
    let entries = await getAllEntries();
    let filtered = [...entries];
    if (currentFilterMonth) filtered = filtered.filter(e => e.month === currentFilterMonth);
    filtered.sort((a,b) => new Date(b.date) - new Date(a.date));
    const t = translations[currentLanguage];
    const container = document.getElementById('entriesList');
    if (!container) return;
    if (filtered.length === 0) { container.innerHTML = `<div class="text-center text-gray-500 py-8">${t.noEntriesText}</div>`; updateSummary(entries); return; }
    container.innerHTML = filtered.map(entry => `
        <div class="entry-item">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="${entry.type === 'income' ? 'income-badge' : 'expense-badge'}">${entry.type === 'income' ? t.incomeText : t.expenseText}</span>
                        <span class="font-bold">${entry.category}</span>
                        <span class="text-xs text-gray-400">${entry.date}</span>
                    </div>
                    ${entry.notes ? `<p class="text-xs text-gray-500 mt-1">📝 ${escapeHtml(entry.notes)}</p>` : ''}
                </div>
                <div class="text-right">
                    <div class="font-bold ${entry.type === 'income' ? 'text-green-700' : 'text-red-600'}">₹${entry.amount.toLocaleString()}</div>
                    <div class="flex gap-1 mt-1">
                        <button onclick="editEntry(${entry.id})" class="text-blue-600 text-xs"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteEntry(${entry.id})" class="text-red-600 text-xs"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    updateSummary(entries);
}

function updateSummary(entries) {
    let today = new Date().toISOString().split('T')[0], currentMonth = new Date().toISOString().slice(0,7);
    let todayIncome = 0, todayExpense = 0, monthIncome = 0, monthExpense = 0;
    entries.forEach(e => {
        if (e.date === today) { if (e.type === 'income') todayIncome += e.amount; else todayExpense += e.amount; }
        if (e.month === currentMonth) { if (e.type === 'income') monthIncome += e.amount; else monthExpense += e.amount; }
    });
    document.getElementById('todayIncome').innerText = `₹${todayIncome.toLocaleString()}`;
    document.getElementById('todayExpense').innerText = `₹${todayExpense.toLocaleString()}`;
    document.getElementById('monthIncome').innerText = `₹${monthIncome.toLocaleString()}`;
    document.getElementById('monthProfit').innerText = `₹${(monthIncome - monthExpense).toLocaleString()}`;
}

function filterByMonth() { currentFilterMonth = document.getElementById('monthFilter').value; loadEntries(); }
function clearFilter() { document.getElementById('monthFilter').value = new Date().toISOString().slice(0,7); currentFilterMonth = null; loadEntries(); }
function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, function(m) { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
async function clearAllData() { if (confirm(translations[currentLanguage].clearConfirm)) { let tx = db.transaction(['entries'], 'readwrite'); tx.objectStore('entries').clear(); await tx.done; loadEntries(); showToast('✅ All data cleared!'); closeSettings(); } }

// ============================================ //
// PDF REPORT (Income/Expense Summary)          //
// ============================================ //
async function downloadPDFReport() {
    let entries = await getAllEntries();
    const t = translations[currentLanguage];
    if (entries.length === 0) { showToast('No entries to generate PDF'); return; }
    let totalIncome = 0, totalExpense = 0;
    entries.forEach(e => { if (e.type === 'income') totalIncome += e.amount; else totalExpense += e.amount; });
    let html = `
        <html><head><meta charset="UTF-8"><title>Farmer's Report</title>
        <style>body{font-family: sans-serif; padding:20px;} .header{text-align:center; margin-bottom:20px;} table{width:100%; border-collapse:collapse;} th,td{border:1px solid #ddd; padding:8px; text-align:left;} th{background:#f2f2f2;} .summary{display:flex; justify-content:space-between; margin-bottom:20px;} .card{background:#f0fdf4; padding:10px; border-radius:8px; text-align:center; flex:1; margin:0 5px;}</style>
        </head><body>
        <div class="header"><h2>Krishnagiri Farmer's Diary</h2><p>${new Date().toLocaleDateString()}</p></div>
        <div class="summary"><div class="card"><h3>${t.totalIncomeLabel}</h3><p>₹${totalIncome.toLocaleString()}</p></div>
        <div class="card"><h3>${t.totalExpenseLabel}</h3><p>₹${totalExpense.toLocaleString()}</p></div>
        <div class="card"><h3>${t.netBalanceLabel}</h3><p>₹${(totalIncome - totalExpense).toLocaleString()}</p></div></div>
        <table><tr><th>${t.dateLabel}</th><th>${t.typeLabel}</th><th>Category</th><th>Amount (₹)</th><th>Notes</th></tr>
        ${entries.map(e => `<tr><td>${e.date}</td><td>${e.type === 'income' ? t.incomeText : t.expenseText}</td><td>${e.category}</td><td>₹${e.amount.toLocaleString()}</td><td>${e.notes || '-'}</td></tr>`).join('')}
        </table></body></html>`;
    let element = document.createElement('div'); element.innerHTML = html;
    document.body.appendChild(element);
    html2pdf().set({ margin: 0.5, filename: `farmers_report_${new Date().toISOString().slice(0,10)}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } }).from(element).save().then(() => { document.body.removeChild(element); showToast(t.pdfSaved); });
}

// ============================================ //
// INITIALIZATION                               //
// ============================================ //
async function init() {
    let savedLang = localStorage.getItem('app_language');
    if (savedLang && ['tamil','telugu','english'].includes(savedLang)) currentLanguage = savedLang;
    let savedMarket = localStorage.getItem('preferred_market');
    if (savedMarket === 'hosur' || savedMarket === 'krishnagiri') { currentMarket = savedMarket; document.getElementById('marketSelect').value = savedMarket; }
    let savedServer = localStorage.getItem('api_server_url');
    if (savedServer) currentServerUrl = savedServer;
    document.getElementById('serverUrl').value = currentServerUrl;
    await initDB();
    applyTranslations();
    await loadEntries();
    await fetchRealMarketPrices();
    setInterval(fetchRealMarketPrices, 30 * 60 * 1000);
}

window.setLanguage = setLanguage; window.setMarket = setMarket; window.fetchRealMarketPrices = fetchRealMarketPrices;
window.saveEntry = saveEntry; window.editEntry = editEntry; window.deleteEntry = deleteEntry;
window.filterByMonth = filterByMonth; window.clearFilter = clearFilter; window.clearAllData = clearAllData;
window.downloadPDFReport = downloadPDFReport; window.updateApiServerUrl = (url) => { currentServerUrl = url; localStorage.setItem('api_server_url', url); };
init();
