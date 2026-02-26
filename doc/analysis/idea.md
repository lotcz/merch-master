# Merch Master

## Přehled systému (Executive Summary)

Cílem projektu je SaaS platforma, která umožní uživatelům (tvůrcům, firmám, influencerům) nahrát vlastní grafiku,
aplikovat ji na produkty a během několika sekund vygenerovat plně funkční e-shop pro jejich koncové zákazníky. Systém
řeší kompletní cyklus od designu až po fulfillment (výrobu a odeslání).

### Funkční bloky systému

#### Systémová administrace (System Admin)

Rozhraní pro mě. Zde definuji typy produktů a způsoby generování jejich náhledů. Zadávám také ceny materiálu, dopravy a
výši provize.

#### Administrace pro tvůrce (Creator Dashboard)

Toto je rozhraní, kde uživatel/tvůrce „pracuje“.

Zahrnuje:

- Editor produktů (Customizer): Canvas, kde uživatel nahrává soubory (PNG, SVG).
- Správa obchodu: Nastavení názvu e-shopu, nahrání loga a výběr barevné šablony (branding).
- Wallet & Payouts: Přehled prodejů, nasbírané marže a možnost vyplacení peněz na bankovní účet.
- Export tiskových dat: Automatické generování tiskového PDF v rozlišení 300 DPI s přesnými souřadnicemi umístění loga.
- AI asistence při generování náhledů a vymýšlení názvů a popisů produktů.

##### Automatizovaný E-shop (Client Storefront)

Web, který uvidí koncový zákazník. Dynamic Subdomains: Každý obchod běží na nazev.tvojedomena.cz. Checkout proces:
Integrovaná platební brána ComGate, která peníze automaticky dělí mezi tebe (náklady na výrobu) a tvůrce (marže).

## Uživatelský scénář (User Journey)

- Registrace: Tvůrce se přihlásí
- Tvorba: Vybere „Bílé tričko Basic“, nahraje logo na prsa
- Nastavení ceny: Vidí nákupní cenu 250 Kč, nastaví prodejní na 550 Kč, zisk 300 Kč
- Kontrola produtku: Musím zkontrolovat produkt, zda nejsou použity vulgarity či porušeny autorská práva
- Nastavení e-shopu: zvolí název, barvy, písmo a logo
- Publikace: Klikne na „Spustit obchod“. Systém vytvoří databázový záznam a e-shop je online
- Kontrola e-shopu: Musím zkontrolovat e-shop, zda nejsou použity vulgarity či porušeny autorská práva
- Prodej: Fanoušek si koupí tričko
- Fulfillment: Systém pošle příkaz do tiskárny, tiskárna vyrobí a pošle balík fanouškovi. Tvůrci se v dashboardu připíše
  300 Kč
- Vratka: Koncový zákazník může zboží do 14 dnů vrátit, po tu dobu jsou peníze na mém účtu
- Výplata: Po uplynutí 14 dnů si může tvůrce nechat vyplatit jeho provizi
- Reklamace: Reklamaci zboží řeší Merch Master, tvůrce se netýká

## Přidaná hodnota

### AI Creative Studio

Generování a Marketing. Tady nepůjde jen o to „vytvořit obrázek“, ale o vytvoření celého vizuálního balíčku.

Integrace API (např. DALL-E 3 nebo Midjourney). Uživatel zadá prompt, systém mu vygeneruje 4 varianty
loga přímo na zvoleném produktu.

Auto-Story Generator: Tohle bude tvoje „killer feature“. Jakmile uživatel potvrdí design, systém automaticky
vygeneruje sadu obrázků a krátkých videí (Reels/Stories) pro sociální sítě.

AI Copywriter: Tlačítko „Vygeneruj popisky“, které vytvoří texty pro příspěvky na Instagram, TikTok a popis produktu
na e-shopu v tónu hlasu daného tvůrce.

### Etický a transparentní řetězec (Eco-Edge)

V merchi je dnes „udržitelnost“ často jen prázdné slovo. Ty to udělej jinak – datově.

Eco-Score: Každý produkt bude mít skóre (např. 1–10) na základě materiálu (bio bavlna, recyklovaný polyester) a ujeté
vzdálenosti (lokální tiskárna vs. dovoz).

Certifikáty v detailu: Přímo v košíku uvidí koncový zákazník loga jako GOTS (Global Organic Textile Standard) nebo Fair
Wear.

On-Demand tisk jako ekologie: Marketingově musíš zdůrazňovat, že nevzniká žádný odpad. Nevyrábíš 100 triček, která se
možná vyhodí, ale tiskneš až ve chvíli, kdy o něj má někdo skutečný zájem.

Transparentní marže: Umožni tvůrcům (volitelně) ukázat: „Z tohoto trička jde 50 Kč na výsadbu stromů v ČR.“

### Marketingová pomoc (Růstová platforma)

Většina tvůrců neumí prodávat. Tvůj systém jim musí radit.

Marketingové „Recepty“: Systém bude tvůrci posílat notifikace: „Dnes je mezinárodní den psů, tvůj merch se psy má teď
největší šanci na úspěch. Tady máš vygenerované Storyčko, sdílej ho!“

Integrace s analytikou: Propoj e-shopy s Google Analytics a Facebook Pixelem, ale udělej to „na jedno kliknutí“.
Uživatel jen vloží ID a tvůj systém mu v dashboardu ukáže: „Tento týden ti na web přišlo 500 lidí z TikToku, 5 si jich
něco koupilo.“

Newsletter modul: Jednoduchý nástroj na sběr e-mailů fanoušků. Když tvůrce vydá nový produkt, systém automaticky rozešle
e-mail všem předchozím kupujícím.

## Bezpečnost obsahu

Varování: "Věděli jste, že obrázky stažené z Google nebo Pinterestu obvykle nesmíte prodávat? Používejte naše AI
generování obrázků, kde máte licenci k prodeji v ceně!"

Hybridní proces schvalování, který kombinuje manuální kontrolu a automatizaci:

- Uživatel nahraje design.
- AI zkontroluje vulgarity (text i obraz).
- AI Vision zkontroluje známé postavy/loga.
- Reverse Image Search zkontroluje duplicitu na webu.
- Stav "Ke schválení": Pokud design projde automatikou, svítí v tvé admin sekci zeleně. Pokud je podezřelý, svítí
  červeně.
- Ruční kontrola: Jednou denně projdeš seznam "zelených" designů. Díky AI náhledům to bude otázka 5 minut – jen očima
  potvrdíš, že je vše v pořádku, a klikneš na "Schválit pro prodej".
