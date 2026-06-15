from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

MARKET_URLS = {
    'hosur': 'https://vegetablemarketprice.com/market/hosur/today',
    'krishnagiri': 'https://vegetablemarketprice.com/market/krishnagiri/today'
}

def fetch_prices(url):
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(response.content, 'html.parser')
        rows = soup.find_all('tr')
        prices = {}
        for row in rows:
            cells = row.find_all('td')
            if len(cells) >= 3:
                veg_name = cells[0].get_text(strip=True).split('(')[0].strip()
                price_text = cells[1].get_text(strip=True).replace('₹', '').strip()
                try:
                    price = int(float(price_text))
                    if price > 0 and price < 5000:
                        prices[veg_name] = price
                except: pass
        return prices
    except Exception as e:
        print(f"Scrape error: {e}")
        return {}

@app.route('/api/prices', methods=['GET'])
def get_prices():
    market = request.args.get('market', 'hosur')
    url = MARKET_URLS.get(market, MARKET_URLS['hosur'])
    prices = fetch_prices(url)
    if prices:
        return jsonify({'success': True, 'prices': prices, 'market': market, 'last_updated': datetime.now().isoformat(), 'count': len(prices)})
    return jsonify({'success': False, 'error': 'Could not fetch prices'}), 503

@app.route('/api/health', methods=['GET'])
def health(): return jsonify({'status': 'ok'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
