from flask import Flask, jsonify, request
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
from datetime import datetime
import os
import re

app = Flask(__name__)
CORS(app)

MARKET_URLS = {
    'hosur': 'https://vegetablemarketprice.com/market/hosur/today',
    'krishnagiri': 'https://vegetablemarketprice.com/market/krishnagiri/today'
}

def fetch_prices(url, market_name):
    """Scrape ALL vegetable prices from the webpage"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        print(f"Fetching {market_name} prices from: {url}")
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Method 1: Find the main table
        tables = soup.find_all('table')
        price_table = None
        
        for table in tables:
            if 'Vegetable' in table.get_text() or 'Price' in table.get_text():
                price_table = table
                break
        
        if not price_table:
            # Fallback: find all rows directly
            all_rows = soup.find_all('tr')
        else:
            all_rows = price_table.find_all('tr')
        
        prices = {}
        
        for row in all_rows:
            cells = row.find_all('td')
            if len(cells) >= 2:
                # Get vegetable name
                veg_cell = cells[0].get_text(strip=True)
                # Remove "Image" text and Tamil text in brackets
                veg_name = re.sub(r'Image$', '', veg_cell)
                veg_name = re.sub(r'\s*\([^)]*\)', '', veg_name)
                veg_name = veg_name.strip()
                
                # Get price (look for ₹ symbol)
                price_text = None
                for cell in cells[1:]:
                    cell_text = cell.get_text(strip=True)
                    if '₹' in cell_text:
                        # Extract number
                        price_match = re.search(r'₹(\d+(?:\.\d+)?)', cell_text)
                        if price_match:
                            price_text = price_match.group(1)
                            break
                
                if veg_name and price_text and len(veg_name) > 2:
                    try:
                        price_val = int(float(price_text))
                        if 1 <= price_val <= 5000:
                            prices[veg_name] = price_val
                    except:
                        pass
        
        # Also try parsing row by row text as fallback
        if len(prices) < 10:
            all_rows = soup.find_all('tr')
            for row in all_rows:
                row_text = row.get_text(separator='|', strip=True)
                if '₹' in row_text and '|' in row_text:
                    parts = row_text.split('|')
                    parts = [p.strip() for p in parts if p.strip()]
                    if len(parts) >= 2:
                        veg_name = parts[0]
                        veg_name = re.sub(r'\s*\([^)]*\)', '', veg_name)
                        veg_name = re.sub(r'Image$', '', veg_name).strip()
                        
                        for p in parts[1:]:
                            if '₹' in p and '-' not in p:
                                price_match = re.search(r'₹(\d+)', p)
                                if price_match:
                                    try:
                                        price_val = int(price_match.group(1))
                                        if 1 <= price_val <= 5000 and veg_name and len(veg_name) > 2:
                                            prices[veg_name] = price_val
                                    except:
                                        pass
                                break
        
        print(f"✅ {market_name}: Found {len(prices)} vegetables")
        return prices
        
    except Exception as e:
        print(f"Scraping error for {market_name}: {e}")
        return {}

@app.route('/api/prices', methods=['GET'])
def get_prices():
    market = request.args.get('market', 'hosur').lower()
    
    if market not in MARKET_URLS:
        return jsonify({'success': False, 'error': f'Invalid market: {market}'}), 400
    
    url = MARKET_URLS[market]
    market_name = 'Hosur' if market == 'hosur' else 'Krishnagiri'
    
    try:
        prices = fetch_prices(url, market_name)
        
        if prices and len(prices) > 0:
            # Sort by name for consistency
            sorted_prices = dict(sorted(prices.items()))
            return jsonify({
                'success': True,
                'prices': sorted_prices,
                'last_updated': datetime.now().isoformat(),
                'source': f'{market_name} Vegetable Market',
                'market': market,
                'count': len(sorted_prices)
            })
        else:
            return jsonify({
                'success': False,
                'error': f'Could not fetch prices from {market_name} market',
                'message': 'The website may be temporarily unavailable'
            }), 503
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat(),
        'markets_supported': list(MARKET_URLS.keys())
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("=" * 60)
    print("🚀 KRISHNAGIRI FARMER'S DIARY API SERVER")
    print("=" * 60)
    print(f"📍 Hosur URL: {MARKET_URLS['hosur']}")
    print(f"📍 Krishnagiri URL: {MARKET_URLS['krishnagiri']}")
    print(f"🌐 Server running on port {port}")
    print("=" * 60)
    app.run(host='0.0.0.0', port=port, debug=False)
