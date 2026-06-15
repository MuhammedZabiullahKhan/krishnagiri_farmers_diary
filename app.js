// Krishnagiri Farmer's Diary - Complete Application
// 100% Translations (Tamil, Telugu, English)
// Individual PDF per entry (Fixed - opens print dialog to save as PDF)
// Full CRUD, Market prices from Hosur & Krishnagiri
// Created by Shri Muhammed Zabiullah Khan | PrimeSys Solutions

let db;
let currentLanguage = 'tamil';
let editingEntryId = null;
let currentFilterMonth = null;
let currentMarket = 'hosur';

// Fixed Server URL - Your Render backend
const currentServerUrl = 'https://krishnagiri-farmers-diary.onrender.com';

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
        "Raw Banana": "అరటికాయ", "Amaranth Leaves": "తోటకూర", "Amla": "ఉసిరికాయ",
        "Ash gourd": "బూడిద గుమ్మడికాయ", "Baby Corn": "చిన్న మొక్కజొన్న", "Banana Flower": "అరటి పువ్వు",
        "Capsicum": "క్యాప్సికమ్", "Bitter Gourd": "కాకరకాయ", "Bottle Gourd": "అనపకాయ",
        "Butter Beans": "బట్టర్ బీన్స్", "Broad Beans": "చిక్కుడు కాయ", "Cabbage": "క్యాబేజీ",
        "Carrot": "క్యారెట్", "Cauliflower": "కాలీఫ్లవర్", "Cluster beans": "గోరు చిక్కుడు",
        "Coconut": "కొబ్బరి", "Colocasia Leaves": "చమగూర", "Colocasia": "చామదుంప",
        "Coriander Leaves": "కొత్తిమీర", "Corn": "మొక్కజొన్న", "Cucumber": "దోసకాయ",
        "Curry Leaves": "కరివేపాకు", "Dill Leaves": "సోయా కూర", "Drumsticks": "మునగకాయ",
        "Brinjal": "వంకాయ", "Brinjal (Big)": "పెద్ద వంకాయ", "Elephant Yam": "పెండలం",
        "Fenugreek Leaves": "మెంతి కూర", "French Beans": "ఫ్రెంచ్ బీన్స్", "Garlic": "వెల్లుల్లి",
        "Ginger": "అల్లం", "Onion Green": "పచ్చి ఉల్లిపాయ", "Green Peas": "పచ్చి బటానీలు",
        "Ivy Gourd": "దొండకాయ", "Lemon": "నిమ్మకాయ", "Mango Raw": "మామిడికాయ",
        "Mint Leaves": "పుదీనా", "Mushroom": "పుట్టగొడుగు", "Mustard Leaves": "ఆవ ఆకు",
        "Ladies Finger": "బెండకాయ", "Pumpkin": "గుమ్మడికాయ", "Radish": "ముల్లంగి",
        "Ridge Gourd": "బీరకాయ", "Shallot": "చిన్న ఉల్లిపాయ", "Snake Gourd": "పొట్లకాయ",
        "Sorrel Leaves": "పులిచ కూర", "Spinach": "పాలకూర", "Sweet Potato": "చిలగడదుంప"
    },
    english: {}
};

function translateVegetable(name, lang) {
    if (lang === 'tamil' && vegetableNames.tamil[name]) return vegetableNames.tamil[name];
    if (lang === 'telugu' && vegetableNames.telugu[name]) return vegetableNames.telugu[name];
    return name;
}

// ============================================ //
// COMPLETE UI TRANSLATIONS (100%)              //
// ============================================ //
const translations = {
    tamil: {
        settingsTitle: "அமைப்புகள்", languageTitle: "🌐 மொழி", marketTitle: "🏪 சந்தை", themeTitle: "🎨 வண்ண தீம்",
        dataTitle: "🗑️ தரவு", clearWarning: "எச்சரிக்கை: அனைத்து பதிவுகளும் நிரந்தரமாக நீங்கும்",
        settingsBtnText: "அமைப்புகள்", refreshBtnText: "புதுப்பி", filterBtn: "வடிகட்டு", clearFilterBtn: "அழி",
        todayIncomeLabel: "இன்றைய வருமானம்", todayExpenseLabel: "இன்றைய செலவு", monthIncomeLabel: "மாத வருமானம்", monthBalanceLabel: "மாத இருப்பு",
        marketTitleText: "📊 இன்றைய சந்தை விலைகள்", addEntryTitle: "➕ புதிய பதிவு", historyTitle: "📋 என் பதிவுகள்",
        appTitle: "கிருஷ்ணகிரி விவசாயி நாட்குறிப்பு", subtitleText: "விவசாயி நாட்குறிப்பு",
        saveBtnText: "💾 பதிவு சேமி", updateBtnText: "🔄 பதிவு புதுப்பி", noEntriesText: "இன்னும் பதிவுகள் இல்லை",
        deleteConfirm: "இந்த பதிவை நீக்க வேண்டுமா?", deleteSuccess: "✅ பதிவு நீக்கப்பட்டது!",
        updateSuccess: "✅ பதிவு புதுப்பிக்கப்பட்டது!", saveSuccess: "✅ பதிவு சேமிக்கப்பட்டது!",
        noAmountAlert: "⚠️ தயவுசெய்து தொகையை உள்ளிடவும்!", clearConfirm: "⚠️ அனைத்து பதிவுகளையும் நீக்க வேண்டுமா?",
        pdfBtnText: "PDF", pdfSaved: "✅ PDF சேமிக்கப்பட்டது!", pdfTitle: "விவசாயி பதிவு",
        viewBtn: "காண்க", editBtn: "திருத்து", deleteBtn: "நீக்கு",
        dateLabel: "தேதி", typeLabel: "வகை", amountLabel: "தொகை", notesLabel: "குறிப்பு", categoryLabel: "வகை",
        incomeText: "வருமானம்", expenseText: "செலவு"
    },
    telugu: {
        settingsTitle: "సెట్టింగ్స్", languageTitle: "🌐 భాష", marketTitle: "🏪 మార్కెట్", themeTitle: "🎨 రంగు",
        dataTitle: "🗑️ డేటా", clearWarning: "హెచ్చరిక: అన్ని ఎంట్రీలు శాశ్వతంగా తొలగించబడతాయి",
        settingsBtnText: "సెట్టింగ్స్", refreshBtnText: "రిఫ్రెష్", filterBtn: "ఫిల్టర్", clearFilterBtn: "క్లియర్",
        todayIncomeLabel: "నేటి ఆదాయం", todayExpenseLabel: "నేటి ఖర్చు", monthIncomeLabel: "నెలవారీ ఆదాయం", monthBalanceLabel: "నెలవారీ బ్యాలెన్స్",
        marketTitleText: "📊 నేటి మార్కెట్ ధరలు", addEntryTitle: "➕ కొత్త ఎంట్రీ", historyTitle: "📋 నా ఎంట్రీలు",
        appTitle: "కృష్ణగిరి రైతు డైరీ", subtitleText: "రైతు డైరీ",
        saveBtnText: "💾 ఎంట్రీ సేవ్", updateBtnText: "🔄 ఎంట్రీ అప్డేట్", noEntriesText: "ఇంకా ఎంట్రీలు లేవు",
        deleteConfirm: "ఈ ఎంట్రీని తొలగించాలా?", deleteSuccess: "✅ ఎంట్రీ తొలగించబడింది!",
        updateSuccess: "✅ ఎంట్రీ అప్డేట్ చేయబడింది!", saveSuccess: "✅ ఎంట్రీ సేవ్ చేయబడింది!",
        noAmountAlert: "⚠️ దయచేసి మొత్తాన్ని నమోదు చేయండి!", clearConfirm: "⚠️ అన్ని ఎంట్రీలను తొలగించాలా?",
        pdfBtnText: "PDF", pdfSaved: "✅ PDF విజయవంతంగా సేవ్ చేయబడింది!", pdfTitle: "రైతు రికార్డు",
        viewBtn: "చూడండి", editBtn: "సవరించు", deleteBtn: "తొలగించు",
        dateLabel: "తేదీ", typeLabel: "రకం", amountLabel: "మొత్తం", notesLabel: "గమనిక", categoryLabel: "వర్గం",
        incomeText: "ఆదాయం", expenseText: "ఖర్చు"
    },
    english: {
        settingsTitle: "Settings", languageTitle: "🌐 Language", marketTitle: "🏪 Market", themeTitle: "🎨 Theme",
        dataTitle: "🗑️ Data", clearWarning: "Warning: Deletes all entries permanently",
        settingsBtnText: "Settings", refreshBtnText: "Refresh", filterBtn: "Filter", clearFilterBtn: "Clear",
        todayIncomeLabel: "Today's Income", todayExpenseLabel: "Today's Expense", monthIncomeLabel: "Month Income", monthBalanceLabel: "Month Balance",
        marketTitleText: "📊 Today's Market Prices", addEntryTitle: "➕ Add New Entry", historyTitle: "📋 My Entries",
        appTitle: "Krishnagiri Farmer's Diary", subtitleText: "Farmer's Diary",
        saveBtnText: "💾 Save Entry", updateBtnText: "🔄 Update Entry", noEntriesText: "No entries yet",
        deleteConfirm: "Delete this entry?", deleteSuccess: "✅ Entry deleted!",
        updateSuccess: "✅ Entry updated!", saveSuccess: "✅ Entry saved!",
        noAmountAlert: "⚠️ Please enter amount!", clearConfirm: "⚠️ Delete all entries?",
        pdfBtnText: "PDF", pdfSaved: "✅ PDF saved successfully!", pdfTitle: "Farmer's Record",
        viewBtn: "View", editBtn: "Edit", deleteBtn: "Delete",
        dateLabel: "Date", typeLabel: "Type", amountLabel: "Amount", notesLabel: "Notes", categoryLabel: "Category",
        incomeText: "Income", expenseText: "Expense"
    }
};

function applyTranslations() {
    const t = translations[currentLanguage];
    const ids = ['settingsTitle', 'languageTitle', 'marketTitle', 'themeTitle', 'dataTitle', 'clearWarning', 'settingsBtnText', 'refreshBtnText', 'filterBtn', 'clearFilterBtn', 'todayIncomeLabel', 'todayExpenseLabel', 'monthIncomeLabel', 'monthBalanceLabel', 'marketTitleText', 'addEntryTitle', 'historyTitle', 'appTitle', 'subtitleText', 'noEntriesText'];
    ids.forEach(id => { let el = document.getElementById(id); if(el) el.textContent = t[id]; });
    setSaveButtonText();
    loadEntries();
}

function setSaveButtonText() {
    let btn = document.getElementById('saveBtnText');
    if(btn) btn.textContent = editingEntryId ? translations[currentLanguage].updateBtnText : translations[currentLanguage].saveBtnText;
}

function showToast(msg) { let toast = document.createElement('div'); toast.className = 'toast'; toast.textContent = msg; document.body.appendChild(toast); setTimeout(() => toast.remove(), 2000); }

function setLanguage(lang) { 
    currentLanguage = lang; 
    localStorage.setItem('app_language', lang); 
    applyTranslations(); 
    fetchRealMarketPrices(); 
    showToast(lang === 'tamil' ? '✅ தமிழுக்கு மாற்றப்பட்டது' : (lang === 'telugu' ? '✅ తెలుగుకు మార్చబడింది' : '✅ Switched to English')); 
}

function setMarket(market) { 
    currentMarket = market; 
    localStorage.setItem('preferred_market', market); 
    document.getElementById('marketSelect').value = market; 
    fetchRealMarketPrices(); 
    showToast(currentLanguage === 'tamil' ? `${market === 'hosur' ? 'ஹொசூர்' : 'கிருஷ்ணகிரி'} சந்தைக்கு மாறியது` : `Switched to ${market === 'hosur' ? 'Hosur' : 'Krishnagiri'} market`); 
}

// ============================================ //
// MARKET PRICES (LIVE FETCH)                   //
// ============================================ //
async function fetchRealMarketPrices() {
    const container = document.getElementById('marketPricesList');
    const errorDiv = document.getElementById('priceError');
    if (!container) return;
    container.innerHTML = '<div class="text-center text-gray-500 py-8 col-span-full"><i class="fas fa-spinner fa-spin mr-2"></i>Fetching prices...</div>';
    if (errorDiv) errorDiv.classList.add('hidden');
    try {
        const response = await fetch(`${currentServerUrl}/api/prices?market=${currentMarket}`);
        const data = await response.json();
        if (data.success && data.prices && Object.keys(data.prices).length > 0) {
            const entries = Object.entries(data.prices);
            container.innerHTML = entries.map(([veg, price]) => `
                <div class="price-card"><div class="price-value">₹${price}</div><div class="price-name" title="${veg}">${translateVegetable(veg, currentLanguage)}</div></div>
            `).join('');
            const noteEl = document.getElementById('priceNote');
            if (noteEl) {
                const marketName = currentMarket === 'hosur' ? 'Hosur' : 'Krishnagiri';
                if (currentLanguage === 'tamil') noteEl.innerHTML = `📊 ${marketName} சந்தை | ${data.count} பொருட்கள்`;
                else if (currentLanguage === 'telugu') noteEl.innerHTML = `📊 ${marketName} మార్కెట్ | ${data.count} వస్తువులు`;
                else noteEl.innerHTML = `📊 ${marketName} Market | ${data.count} items`;
            }
        } else throw new Error('No data');
    } catch (error) {
        console.error(error);
        if (errorDiv) { errorDiv.classList.remove('hidden'); errorDiv.innerHTML = `⚠️ Cannot fetch prices. Contact: ${CONTACT.phone}`; }
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
        <div class="entry-card">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="${entry.type === 'income' ? 'income-badge' : 'expense-badge'}">${entry.type === 'income' ? '💰 ' + t.incomeText : '💸 ' + t.expenseText}</span>
                        <span class="font-semibold text-sm">${entry.category}</span>
                        <span class="text-xs text-gray-400">${entry.date}</span>
                    </div>
                    ${entry.notes ? `<p class="text-xs text-gray-500 mt-1">📝 ${escapeHtml(entry.notes)}</p>` : ''}
                </div>
                <div class="text-right">
                    <div class="font-bold text-lg ${entry.type === 'income' ? 'text-green-700' : 'text-red-600'}">₹${entry.amount.toLocaleString()}</div>
                    <div class="flex gap-2 mt-2">
                        <button onclick="downloadSinglePDF(${entry.id})" class="bg-purple-600 text-white px-2 py-1 rounded-lg text-xs"><i class="fas fa-file-pdf"></i> ${t.pdfBtnText}</button>
                        <button onclick="editEntry(${entry.id})" class="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs"><i class="fas fa-edit"></i> ${t.editBtn}</button>
                        <button onclick="deleteEntry(${entry.id})" class="bg-red-500 text-white px-2 py-1 rounded-lg text-xs"><i class="fas fa-trash"></i> ${t.deleteBtn}</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    updateSummary(entries);
}

// Individual PDF per entry - FIXED VERSION (uses print dialog)
async function downloadSinglePDF(entryId) {
    let entry = await getEntryById(entryId);
    if (!entry) return;
    
    const t = translations[currentLanguage];
    let typeText = entry.type === 'income' ? t.incomeText : t.expenseText;
    let typeIcon = entry.type === 'income' ? '💰' : '💸';
    
    // Create a new window for printing/saving as PDF
    const printWindow = window.open('', '_blank');
    
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${t.pdfTitle} - ${entry.category}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Inter', 'Noto Sans Tamil', 'Noto Sans Telugu', Arial, sans-serif;
            background: #f0f2f5;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }
        .invoice-container {
            max-width: 800px;
            width: 100%;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 35px -10px rgba(0,0,0,0.15);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #065f46 0%, #10b981 100%);
            color: white;
            padding: 25px 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        .header p {
            font-size: 12px;
            opacity: 0.9;
        }
        .title {
            background: #f8fafc;
            padding: 12px 30px;
            border-bottom: 2px solid #e2e8f0;
            text-align: center;
        }
        .title h2 {
            color: #065f46;
            font-size: 18px;
        }
        .content {
            padding: 20px 30px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        .info-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e2e8f0;
        }
        .info-table td:first-child {
            font-weight: 600;
            width: 35%;
            color: #1f2937;
        }
        .info-table td:last-child {
            color: #4b5563;
        }
        .amount {
            font-size: 28px;
            font-weight: 800;
            color: #065f46;
            text-align: center;
            padding: 20px;
            background: #f0fdf4;
            border-radius: 12px;
            margin: 20px 0;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        .badge-income {
            background: #dcfce7;
            color: #166534;
        }
        .badge-expense {
            background: #fee2e2;
            color: #991b1b;
        }
        .footer {
            padding: 15px 30px;
            background: #f1f5f9;
            text-align: center;
            font-size: 11px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        @media print {
            body {
                background: white;
                padding: 0;
                margin: 0;
            }
            .invoice-container {
                box-shadow: none;
                border-radius: 0;
            }
            .no-print {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>${t.appTitle}</h1>
            <p>${t.subtitleText}</p>
        </div>
        <div class="title">
            <h2>${typeIcon} ${typeText} ${t.pdfTitle}</h2>
        </div>
        <div class="content">
            <table class="info-table">
                <tr><td><strong>${t.dateLabel}:</strong></td><td>${entry.date}</td></tr>
                <tr><td><strong>${t.typeLabel}:</strong></td><td><span class="badge ${entry.type === 'income' ? 'badge-income' : 'badge-expense'}">${typeIcon} ${typeText}</span></td></tr>
                <tr><td><strong>${t.categoryLabel}:</strong></td><td>${entry.category}</td></tr>
                <tr><td><strong>${t.amountLabel}:</strong></td><td class="amount">₹${entry.amount.toLocaleString()}</td></tr>
                ${entry.notes ? `<tr><td><strong>${t.notesLabel}:</strong></td><td>${escapeHtml(entry.notes)}</td></tr>` : ''}
            </table>
        </div>
        <div class="footer">
            <p>Generated by Krishnagiri Farmer's Diary | ${CONTACT.phone}</p>
            <p>© 2026 PrimeSys Solutions</p>
        </div>
    </div>
    <script>
        // Auto print and close
        window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 1000);
        };
    <\/script>
</body>
</html>`;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
// INITIALIZATION                               //
// ============================================ //
async function init() {
    let savedLang = localStorage.getItem('app_language');
    if (savedLang && ['tamil','telugu','english'].includes(savedLang)) currentLanguage = savedLang;
    let savedMarket = localStorage.getItem('preferred_market');
    if (savedMarket === 'hosur' || savedMarket === 'krishnagiri') { currentMarket = savedMarket; document.getElementById('marketSelect').value = savedMarket; }
    await initDB();
    applyTranslations();
    await loadEntries();
    await fetchRealMarketPrices();
    setInterval(fetchRealMarketPrices, 30 * 60 * 1000);
}

// Make functions global
window.setLanguage = setLanguage;
window.setMarket = setMarket;
window.fetchRealMarketPrices = fetchRealMarketPrices;
window.saveEntry = saveEntry;
window.editEntry = editEntry;
window.deleteEntry = deleteEntry;
window.downloadSinglePDF = downloadSinglePDF;
window.filterByMonth = filterByMonth;
window.clearFilter = clearFilter;
window.clearAllData = clearAllData;

// Start the app
init();
