from flask import Flask, jsonify, request
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Market URLs
MARKET_URLS = {
    'hosur': 'https://vegetablemarketprice.com/market/hosur/today',
    'krishnagiri': 'https://vegetablemarketprice.com/market/krishnagiri/today'
}

def fetch_prices(url):
    """Scrape vegetable prices from the given webpage"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        all_rows = soup.find_all('tr')
        prices = {}
        
        for row in all_rows:
            row_text = row.get_text(separator='|', strip=True)
            
            if '₹' in row_text and '|' in row_text:
                parts = row_text.split('|')
                parts = [p.strip() for p in parts if p.strip()]
                
                if len(parts) >= 3:
                    vegetable = parts[0]
                    vegetable = vegetable.split('(')[0].strip()
                    
                    wholesale = None
                    for p in parts[1:]:
                        if '₹' in p and '-' not in p:
                            wholesale = p.replace('₹', '').strip()
                            break
                    
                    if vegetable and wholesale:
                        try:
                            price_val = int(float(wholesale))
                            if price_val > 0 and price_val < 5000:
                                prices[vegetable] = price_val
                        except:
                            pass
        
        return prices
        
    except Exception as e:
        print(f"Scraping error for {url}: {e}")
        return {}

@app.route('/api/prices', methods=['GET'])
def get_prices():
    """API endpoint for frontend to fetch prices for selected market"""
    market = request.args.get('market', 'hosur').lower()
    
    # Get the correct URL for the selected market
    url = MARKET_URLS.get(market)
    if not url:
        return jsonify({
            'success': False,
            'error': f'Invalid market: {market}'
        }), 400
    
    try:
        prices = fetch_prices(url)
        
        if prices and len(prices) > 0:
            market_name = 'Hosur' if market == 'hosur' else 'Krishnagiri'
            return jsonify({
                'success': True,
                'prices': prices,
                'last_updated': datetime.now().isoformat(),
                'source': f'{market_name} Vegetable Market',
                'market': market,
                'count': len(prices)
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Could not fetch prices from market website',
                'message': 'The vegetable market website may be temporarily unavailable'
            }), 503
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

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
    print(f"📡 API endpoints:")
    print(f"   - /api/prices?market=hosur")
    print(f"   - /api/prices?market=krishnagiri")
    print(f"   - /api/health")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=port, debug=False)
