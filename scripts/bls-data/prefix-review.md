# Präfix-Review für Grundnahrungsmittel

**Anleitung:** Lösche die Zeilen, die KEIN Präfix bekommen sollen.
Die verbleibenden Einträge werden dann in die bls-config.json übernommen.

---

## BROTE (Präfix: "Brot: ")

```
B710700: Dinkelbrot
B231000: Haferbrot
B131000: Hafervollkornbrot
B291000: Mehrkornbrot mit Ölsamen
B226800: Roggenbrot
B227300: Roggenbrot
B221000: Roggenbrot
B271000: Roggenmischbrot
B277700: Roggenmischbrot
B275700: Roggenmischbrot
B276700: Roggenmischbrot
B121000: Roggenvollkornbrot
B122000: Roggenvollkornschrotbrot
B8A4000: Sauerteigbrot glutenfrei
B8A5000: Sauerteigbrot mit Kürbiskernen, glutenfrei
B8A7000: Sauerteigbrot mit Sonnenblumenkernen, glutenfrei
B8A6000: Sauerteigbrot mit Ölsamen, glutenfrei
B8A8000: Toastbrot
B107900: Vollkornbrot
B106000: Vollkornbrot
B101000: Vollkornbrot
B8A9000: Vollkornbrot glutenfrei
B8B3000: Vollkornknusperbrot
B311000: Weizenbrot/Weißbrot
B782100: Weizenfladenbrot
B257700: Weizenmischbrot
B256000: Weizenmischbrot
B255700: Weizenmischbrot
B251000: Weizenmischbrot
B259000: Weizenmischbrot mit Kürbiskernen
B254000: Weizenmischtoastbrot
B314000: Weizentoastbrot/Buttertoastbrot
B111000: Weizenvollkornbrot
B111700: Weizenvollkornbrot mit Buttermilch
B111300: Weizenvollkornbrot mit Kürbiskernen
B111400: Weizenvollkornbrot mit Nüssen
B111800: Weizenvollkornbrot mit Quark
B111600: Weizenvollkornbrot mit Sonnenblumenkernen
B111500: Weizenvollkornbrot mit Ölsamen
B111200: Weizenvollkorntoastbrot
B309000: Weißbrot glutenfrei
```
---

## KNÄCKEBROTE (Präfix: "Knäckebrot: ")

```
B6A5200: Dinkelvollkornknäckebrot
B6A6000: Knäckebrot glutenfrei, laktosefrei
B6A4000: Mehrkornvollkornknäckebrot
B6A4100: Mehrkornvollkornknäckebrot mit Ölsamen
B6A2100: Roggenvollkornknäckebrot
B6A3200: Roggenvollkornknäckebrot
B6A1000: Weizenknäckebrot mit Sesam
B6A1100: Weizenvollkornknäckebrot mit Käse, Ölsamen und Tomaten
B6A1200: Weizenvollkornknäckebrot mit Müslizutaten, gesüßt
B6A1300: Weizenvollkornknäckebrot mit Ölsamen
B6A1400: Weizenvollkornknäckebrot mit Ölsamen und Hartkäse
B6A1500: Weizenvollkornknäckebrot mit Ölsamen, Hartkäse und Möhre
B6A1600: Weizenvollkornknäckebrot mit Ölsamen, Hartkäse und Zwiebeln
```

---

## MEHLE (Präfix: "Mehl: ")

```
C421000: Buchweizen Vollkornmehl
C424000: Buchweizenmehl
C235000: Dinkel Vollkornmehl
C234000: Dinkelmehl
C241000: Einkorn Vollkornmehl
C240000: Emmer Vollkornmehl
C219000: Hartweizen Vollkornmehl
C443000: Maismehl
C453000: Reismehl
C221000: Roggen Vollkornmehl
C223100: Roggenmehl
C211000: Weizen Vollkornmehl
C213100: Weizenmehl
C214100: Weizenmehl
```

---

## MILCH (Präfix: "Milch: ")

```
M113200: H-Milch fettarm, 1,5 % Fett, ultrahocherhitzt
M1A3100: H-Milch entrahmt, höchstens 0,5 % Fett, laktosefrei, ultrahocherhitzt
M1A5200: H-Milch fettarm, 1,5 % Fett, laktosefrei, ultrahocherhitzt
M1A7300: H-Vollmilch 3,5 % Fett, laktosefrei, ultrahocherhitzt
M114200: Milch fettarm, 1,5 % Fett, laktosefrei, pasteurisiert
M112300: Rohmilch/Vorzugsmilch, mind. 3,5 % Fett
M111300: Vollmilch frisch, 3,5 % Fett, pasteurisiert
```

---

## MERGE-GRUPPEN (werden zusammengefasst)

Diese Einträge haben denselben Namen aber unterschiedliche BLS-Codes und werden zu einem Eintrag zusammengefasst:

```
Roggenbrot: B221000, B226800, B227300
Roggenmischbrot: B271000, B275700, B276700, B277700
Weizenmischbrot: B251000, B255700, B256000, B257700
Vollkornbrot: B101000, B106000, B107900
Roggenbrötchen: B521100, B526300
Roggenvollkornbrötchen: B421000, B426800
Roggenvollkornknäckebrot: B6A2100, B6A3200
Roggenvollkornbrot: B121000, B122000
Vollkornbrötchen: B401000, B406000
Weizenbrötchen: B511000, B516300
Weizenvollkornbrötchen: B411000, B416000
Weizenmehl: C213100, C214100
Weizenvollkornknäckebrot: B6A1100, B6A1200, B6A1300, B6A1400, B6A1500, B6A1600
Roggenvollkornknäckebrot: B6A3200, B6A2100
H-Milch fettarm laktosefrei: M1A3100, M1A5200, M1A7300, M114200
Weizenvollkornbrot: B111000, B111700, B111300, B111400, B111800, B111600, B111500
Sauerteigbrot glutenfrei: B8A4000, B8A5000, B8A7000, B8A6000
```
