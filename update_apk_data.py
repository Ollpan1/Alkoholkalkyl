import urllib.request
import json

print("Fetching products from Systembolaget data source...")
url = "https://susbolaget.emrik.org/v1/products"
req = urllib.request.Request(
    url,
    headers={"User-Agent": "Alkoholkalkyl-App/1.0"}
)

with urllib.request.urlopen(req) as response:
    raw_data = json.loads(response.read().decode('utf-8'))

print(f"Fetched {len(raw_data)} products total.")

products = []
for x in raw_data:
    if x.get('isDiscontinued', False):
        continue
    price = x.get('price', 0)
    volume = x.get('volume', 0)
    alcohol = x.get('alcoholPercentage', 0)

    if not price or price <= 0 or not volume or volume <= 0 or not alcohol or alcohol <= 0:
        continue

    bold = (x.get('productNameBold') or '').strip()
    thin = (x.get('productNameThin') or '').strip()
    if thin:
        if thin.lower() in bold.lower():
            name = bold
        else:
            name = f"{bold} {thin}"
    else:
        name = bold

    if not name:
        name = "Okänd produkt"

    cat1 = x.get('categoryLevel1', '')
    if 'l' in cat1.lower() or 'öl' in cat1.lower():
        typ = 'Öl'
    elif 'vin' in cat1.lower():
        typ = 'Vin'
    elif 'sprit' in cat1.lower():
        typ = 'Sprit'
    elif 'cider' in cat1.lower():
        typ = 'Cider & blanddrycker'
    else:
        typ = cat1 if cat1 else 'Övrigt'
        if typ == 'l':
            typ = 'Öl'

    apk = round((volume * (alcohol / 100)) / price, 2)

    products.append({
        "namn": name,
        "apk": apk,
        "typ": typ,
        "procent": float(alcohol),
        "volym": int(volume),
        "pris": float(price)
    })

# Sort by APK descending
products.sort(key=lambda p: p['apk'], reverse=True)

print(f"Processed {len(products)} valid active products.")

# Save ONLY to systembolaget.json (leave apk.json untouched)
with open("systembolaget.json", "w", encoding="utf-8") as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print("Saved exclusively to systembolaget.json. apk.json left untouched.")
