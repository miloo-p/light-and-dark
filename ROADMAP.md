# Projekt-Roadmap: Light & Shadow

## Phase 1: Items & Kern-Kollisionen (Gameplay Loop schließen)

- [x] **Items in der Welt platzieren**: Arrays für `coins` (Münzen) und `shadowEnergy` (Flaschen-Ersatz) in der `level1.js` anlegen und über die `World`-Klasse auf dem Canvas rendern.
- [x] **Collectibles einsammeln**: Kollisionsabfrage zwischen `ShadowCharacter` und Items schreiben. Bei Berührung verschwindet das Item aus dem Array.
- [x] **Statusbars updaten**: Einsammeln der Items erhöht die jeweiligen Zähler. Die Coin- und Energy-Statusbars im UI müssen sich entsprechend aktualisieren.
- [x] **Munitions-Limitierung**: Die Funktion `shootProjectile()` darf nur noch auslösen, wenn der Energie-Zähler > 0 ist. Bei jedem Schuss muss Energie abgezogen und die Statusbar aktualisiert werden.
- [x] **Gegner durch Sprung besiegen (Stomp)**: Logik einbauen, dass ein `EnemyStomp` stirbt, wenn der Charakter von oben (mit fallender `speedY`) auf ihn trifft. (_Wichtig: Kein Tod bei seitlicher Berührung!_)
- [x] **Projektil-Kollision**: Trifft ein `shadowProjectile` einen normalen Gegner, stirbt dieser und das Projektil verschwindet.

## Phase 2: Der Bosskampf (Climax)

- [x] **Boss-Aktivierung**: Der Boss (`EnemyEndboss`) bewegt sich erst oder greift erst an, wenn der Charakter eine bestimmte X-Koordinate erreicht hat (Kamera-Trigger).
- [x] **Boss-Kollision & Schaden**: Projektile, die den Boss treffen, ziehen ihm Leben ab, töten ihn aber nicht sofort.
- [x] **Boss-Statusbar**: Eine riesige Statusbar für den Boss am oberen oder unteren Bildschirmrand einblenden, sobald der Kampf beginnt.
- [x] **Sieg-Bedingung**: Wenn die HealthPoints des Bosses 0 erreichen, spielt er seine Sterbe-Animation ab.

## Phase 3: Game Flow & Outro Cinematic

- [ ] **Start-Screen / Landingpage (HTML/CSS)**: Ein Overlay über dem Canvas, das den Titel und die Steuerung (Tasten-Erklärung) anzeigt. Das eigentliche Spiel startet erst nach Klick auf "Start".
- [ ] **Game-Over Screen (Lose)**: Wenn die HP des Charakters auf 0 fallen -> Animation `dead` abspielen, Charakter unbeweglich machen, Game Over Overlay einblenden.
- [ ] **Win-Screen / Outro Cinematic**: Nach dem Boss-Tod blitzt das Canvas weiß auf (Alpha-Fading). Das `dead` Background-Array wird gegen das `vibrant` Array getauscht. Win-Screen einblenden.
- [ ] **Soft-Reset Logik**: Einen "Restart"-Button im Game-Over/Win-Screen einbauen. (_Wichtig: Kein `location.reload()`! Arrays leeren, HP und Koordinaten zurücksetzen._)
- [ ] **Fullscreen-Funktion**: Einen Button integrieren, der das Canvas per JavaScript in den echten Fullscreen-Modus versetzt.

## Phase 4: Audio & Mobile Responsiveness

- [ ] **Soundeffekte & Musik**: Kurze Audios für Sprung, Schuss, Treffer, Item-Einsammeln und Hintergrundmusik einbinden (`new Audio()`).
- [ ] **Mute-Button (Local Storage)**: Einen Button einbauen, der alle Sounds stummschaltet. Status im `localStorage` speichern.
- [ ] **Mobile Touch-Controls**: On-Screen-Buttons (Links, Rechts, Sprung, Attacke) in HTML/CSS bauen. Sichtbarkeit nur via Media Queries; Kontextmenü deaktivieren.
- [ ] **Screen-Orientation Warnung**: CSS-Overlay ("Bitte Gerät drehen"), das im Hochformat (Portrait) auf Handys erscheint.

## Phase 5: Refactoring & Checklisten-Polishing

- [ ] **15-Sekunden Sleep Animation**: Timer im Charakter integrieren. Wechsel in Schlaf-Animation bei Inaktivität.
- [ ] **Die 14-Zeilen-Regel (Clean Code)**: Alle Funktionen prüfen und ggf. in kleinere Hilfsfunktionen auslagern (z.B. `checkEnemyCollisions()`).
- [ ] **JSDoc Kommentare**: Jede Funktion nach dem JSDoc-Standard dokumentieren.
- [ ] **Konsolen-Check**: Alle `console.log()` Ausgaben entfernen; Fehlerfreiheit in den DevTools sicherstellen.
- [ ] **Impressum**: Link zum Impressum mit Dummy-Daten einbauen.

## Phase 6: Polish & Game Juice 🧃

- [ ] **Das Dialog-System (Text Bubbles)**: HTML/CSS-Overlay zur Anzeige von Textblasen über den Charakteren via JavaScript.
- [ ] **Intro Cinematic**: `LightCharacter` fliegt durch das Bild und gibt kurze Story-Einführung via Dialog-Box.
- [ ] **Outro Cinematic ("The Awakening")**: Flashbang-Effekt, Background-Swap zu `vivid/alive`, Auftritt des `LightCharacter`.
- [ ] **Dynamischer Audio-Shift**: Wechsel zu atmosphärischerer Musik nach dem Sieg über den Boss.
- [ ] **Screen Shake (Kamera-Wackeln)**: Kamera-Vibration bei Boss-Angriffen oder dem Sieg.
- [ ] **Hit-Stop (Freeze Frame)**: Kurze Pause des Game-Loops bei entscheidenden Treffern für mehr Wucht.
- [ ] **Erweitertes Partikel-System**: Partikel-Schweif für den `LightCharacter` während der Cinematics.
