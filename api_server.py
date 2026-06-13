from flask import Flask, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

URL = "https://vegetablemarketprice.com/market/hosur/today"

def fetch_prices():
    """Scrape vegetable prices from the webpage"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(URL, headers=headers, timeout=10)
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
        print(f"Scraping error: {e}")
        return {}

@app.route('/api/prices', methods=['GET'])
def get_prices():
    """API endpoint for frontend to fetch prices"""
    try:
        prices = fetch_prices()
        
        if prices and len(prices) > 0:
            return jsonify({
                'success': True,
                'prices': prices,
                'last_updated': datetime.now().isoformat(),
                'source': 'Hosur Vegetable Market',
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
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("=" * 60)
    print("🚀 HOSUR MARKET PRICE API SERVER")
    print("=" * 60)
    print(f"📍 Scraping from: {URL}")
    print(f"🌐 Server running on port {port}")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=port, debug=False)