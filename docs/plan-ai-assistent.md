# WebBox — AI-assistent met backend

> **Status:** goedgekeurd plan, nog niets van geïmplementeerd.
> **Opgesteld:** 24 augustus 2026.
> **Bestandsverwijzingen** in dit document wijzen naar de *huidige* structuur (`js/`, `index.html`). Fase 0 verplaatst die naar `client/`.

## Context

WebBox is nu een puur statische HTML/CSS/JS-editor op GitHub Pages waarin studenten van DWD en WDF 126 oefeningen kunnen maken. Er is geen server, geen login, en alles in de repo is publiek.

Er komt een AI-assistent bij die twee dingen doet:

- **coaching** — tips, uitleg en hints tijdens het werken; nooit hele stukken code, nooit oplossingen;
- **feedback** — een kwantitatieve beoordeling van ingediend werk.

Daarnaast komt er een Node-backend voor login met quota per student, logging van wie welke oefening probeert, een statistiekendashboard, privé modeloplossingen, en een examenmodus die oefeningen en hulp tijdelijk verbergt.

Deze vier behoeften hangen samen: ze vragen allemaal dat de server bepaalt wat een student te zien krijgt. Dit plan werkt het geheel uit in vier fases, waarbij fase 3 (de assistent zelf) het doel is en de rest het fundament.

---

## Architectuurbeslissing: weg van GitHub Pages

De belangrijkste consequentie van de eisen: **de app verhuist naar één eigen domein waar Express zowel de statische frontend als `/api` serveert.**

Waarom dit geen keuze is maar een gevolg:

| Eis | Waarom GitHub Pages het niet kan |
|---|---|
| Examenmodus | De repo is publiek. Een student opent github.com/rogiervdl/webbox en leest alle oefeningen. Verbergen in de UI is theater. |
| Privé modeloplossingen | Idem — een bestand in de repo is per definitie leesbaar. |
| Sessiecookies | Frontend op `rogiervdl.github.io` + backend elders = cross-site cookie, `SameSite=None`, geblokkeerd door Safari en Firefox. Same-origin lost dit volledig op. |

**Doelopstelling op Railway:**

```
https://webbox.<domein>/            → Express serveert de statische frontend (ongewijzigde RMP-app)
https://webbox.<domein>/api/…       → JSON-API
https://preview.webbox.<domein>/    → tweede domein op dezelfde service, aparte origin voor het preview-iframe (zie Veiligheid)
```

Eén Railway-service met twee custom domains. Railway regelt HTTPS automatisch; tot het domein rond is werkt de `*.up.railway.app`-URL. De `ANTHROPIC_API_KEY` en de sessie-secret komen in de Railway-variabelen, niet in de repo.

Railway deployt via de GitHub-koppeling op elke push. Uiteindelijk wordt de repo privé en verdwijnt GitHub Pages — laat geen tweede vindplaats van de oefeningen bestaan, want dat holt de examenmodus meteen weer uit. Dat is echter de *eindtoestand*; zie de overgangsstrategie hieronder.

**Database:** Railway Postgres (één klik, automatische back-ups) met de `pg`-driver. Dat is hier veiliger dan SQLite op een volume: een volume bindt je aan één replica en back-uppen moet je dan zelf regelen, terwijl het over activiteitsgegevens van studenten gaat. SQLite blijft een legitiem lichter alternatief als je de back-up zelf wil doen.

**GDPR:** kies een EU-regio op Railway. Verder is dit vooral administratief: voor Office 365 en Google Workspace heeft Odisee centraal een verwerkersovereenkomst, voor Railway en Anthropic niet. Eén mail naar de functionaris gegevensbescherming met opname in het verwerkingsregister dicht dat gat. Dat gesprek blijft kort omdat de toepassing enkel pseudonieme r-nummers bewaart — geen namen, geen e-mailadressen — en omdat de Claude API ingediende data niet gebruikt om modellen te trainen.

---

## Overgangsstrategie — de oude versie blijft draaien tot half september

De huidige versie moet bereikbaar blijven tot het einde van de tweede zittijd. Al het werk gebeurt daarom op een aparte branch, en de twee versies draaien een tijd naast elkaar op verschillende plekken.

| | Oude versie | Nieuwe versie |
|---|---|---|
| Branch | `gh-pages` — onaangeroerd | nieuwe branch, vertakt van `gh-pages` |
| Draait op | GitHub Pages, huidige URL | Railway, eigen domein |
| Repo | publiek (vereist voor Pages) | zelfde repo, andere branch |
| Login / AI | geen | wel |

Railway koppel je aan de nieuwe branch, dus elke push daarheen deployt de nieuwe versie zonder de oude te raken. Vertak van `gh-pages` en niet van `main` — de 126 oefeningen staan op `gh-pages`.

**Volgorde rond half september:**

1. Nu tot half september: ontwikkelen op de branch, oude versie blijft live.
2. Tweede zittijd afgelopen: nieuwe versie in gebruik nemen, studenten naar het nieuwe domein sturen.
3. Pas daarna: branch samenvoegen, **repo privé maken**, GitHub Pages uitschakelen. Deze drie horen bij elkaar — zolang de repo publiek is, is de examenmodus betekenisloos, dus dit moet gebeurd zijn vóór het eerste examen op de nieuwe versie.

**Twee aandachtspunten bij de overstap:**

- **Bewaard werk gaat niet mee.** De editorinhoud staat nu in `localStorage` onder `webbox-code/…` ([exercises.js:384](../js/modules/exercises.js#L384)) en is gebonden aan de origin. Studenten die op het nieuwe domein beginnen, zien hun oude opslag niet. Tijdens de overgang is dat geen probleem (beide versies draaien), bij de cutover wel. Aangezien er dan toch een backend is, is dit het natuurlijke moment om bewaard werk serverside te zetten in plaats van in `localStorage` — dat lost het probleem op én levert meteen betere dashboardgegevens. Buiten de huidige scope, maar plan het in fase 2.
- **Ongecommitte wijzigingen.** Bij het opstellen van dit plan stonden er nog wijzigingen open in `startcodes/index.json5` en een nieuwe map `startcodes/wdf/herhaling/`. Zet die eerst vast op `gh-pages` voor je vertakt, dan start de branch schoon.

---

## Fase 0 — Repo-herindeling

Het huidige `js-app-rmp`-contract blijft gelden voor de frontend: geen npm, geen bundler, geen ES modules. Dat verandert niet. npm komt er alleen bij voor de backend.

```
webbox/                       ← privé repo
├── client/                   ← de huidige app, ongewijzigd van architectuur
│   ├── index.html
│   ├── js/  css/  img/  vendor/
├── server/                   ← nieuw, Node + Express
│   ├── package.json
│   ├── app.js
│   ├── routes/
│   ├── services/
│   ├── db/
│   └── prompts/
├── content/                  ← verhuisd uit startcodes/
│   ├── index.json5
│   └── wdf/… dwd/…
│       └── <oefening>/
│           ├── index.html  styles.css  scripts.js  readme.md  img/
│           ├── oplossing/          ← nieuw, nooit naar de client
│           └── criteria.md         ← nieuw, nooit naar de client
└── CLAUDE.md                 ← aanvullen: client-regels vs. server-regels
```

`content/` verlaat de webroot. Express serveert er alleen uit wat een geauthenticeerde student mag zien, en nooit `oplossing/` of `criteria.md`.

---

## Fase 1 — Backend-fundament

### Stack

Express 5, `pg`, `@anthropic-ai/sdk`, `json5`, `argon2`, `express-rate-limit`. Geen ORM — de queries zijn eenvoudig genoeg voor plain SQL.

### Datamodel

```sql
users        (id, rnummer, rol, pin_hash, pin_gewijzigd_op, created_at, laatste_login)
                                                        -- rol: student | docent
                                                        -- géén naam, géén e-mailadres
login_pogingen (id, rnummer, ip, gelukt, created_at)    -- voor rate limiting en detectie
sessions     (token_hash, user_id, expires_at)
activity     (id, user_id, vak, module, oefening, event, created_at)
                                                        -- event: geopend | uitgevoerd | bewaard | gedownload
ai_calls     (id, user_id, vak, module, oefening, soort, model,
              input_tokens, output_tokens, cache_read_tokens, kosten_cent, created_at)
                                                        -- soort: coach | feedback
quota        (user_id, periode, coach_gebruikt, feedback_gebruikt)
settings     (sleutel, waarde)                          -- examen_modus, examen_vak, ai_actief
```

`activity` en `ai_calls` zijn append-only — daar bouw je later het dashboard op zonder extra tabellen.

### Authenticatie: r-nummer + pincode

Student logt in met zijn r-nummer en een door de docent gegenereerde pincode. Bewust geen e-mailadres en geen naam: de toepassing houdt enkel een pseudoniem bij, en de sleutel tussen pseudoniem en persoon blijft in Toledo. Namen of andere velden koppelen kan later altijd nog — het datamodel staat dat toe zonder migratiepijn.

- **Aanmaken:** in het dashboard plak je een klaslijst met r-nummers; de backend genereert per student een willekeurige pincode (`crypto.randomInt`, nooit oplopend of afgeleid van het r-nummer), toont die lijst één keer zodat je ze kunt uitdelen, en bewaart alleen de hash.
- **Opslag:** `argon2id`. Ook een korte pincode hoort gehasht — als de database ooit uitlekt, hergebruiken studenten die code mogelijk elders.
- **Validatie:** formaatcontrole op het r-nummer. Domeinvalidatie is niet nodig en zou ook niets toevoegen: niemand registreert zichzelf, dus de importlijst *is* de allowlist, en dat is strenger.
- **Docentaccounts krijgen géén pincode maar een echt wachtwoord** — het dashboard bevat de gegevens van alle studenten en verdient een ander beschermingsniveau.
- **Reset:** knop in het dashboard die een nieuwe pincode genereert.

> **Aandachtspunt — brute force.** Vijf cijfers zijn 100 000 combinaties, en r-nummers zijn opeenvolgend en dus opsombaar. Een limiet *per account* beschermt daar niet tegen: de realistische aanval is niet 100 000 pincodes op één r-nummer, maar één pincode op 500 r-nummers (password spraying), en dan komt de teller per account nooit boven 1. Met 500 studenten heeft één spray 0,5 % kans op een treffer; ~138 sprays, samen ~69 000 verzoeken, geven ~50 % kans — bij 10 verzoeken per seconde onder de twee uur.
>
> De bescherming zit dus in de limieten *per IP* en *globaal*, niet per account. Concreet, en proportioneel voor deze toepassing (de realistische aanvaller is een medestudent, de buit is oefeningenactiviteit of een AI-quotum):
> - max. 5 pogingen per r-nummer per 15 minuten, daarna lockout — vangt de gerichte aanval;
> - max. 20 pogingen per IP per 15 minuten — vangt de spray;
> - max. 100 mislukte pogingen per uur over alle accounts samen, met melding in het dashboard — vangt de gespreide spray; die 69 000 pogingen duren dan 29 dagen en jij ziet ze na een halve dag;
> - vaste vertraging van ~300 ms per poging en dezelfde foutmelding of het r-nummer nu bestaat of niet.
>
> Overweeg zes cijfers in plaats van vijf: dat maakt het tienmaal harder en kost de student één toets extra.

Sessie als `HttpOnly; Secure; SameSite=Lax` cookie, 30 dagen geldig. Omdat frontend en API dezelfde origin krijgen, is dat voldoende — geen CORS-configuratie, geen token in localStorage.

Houd dit achter één interface (`services/auth.js`), zodat je later zonder herschrijven kunt overstappen op Microsoft Entra ID met de Odisee-accounts als je dat ooit wil.

### Middleware-keten

```
requireAuth   → 401 als er geen geldige sessie is
examGuard     → 423 op /api/content en /api/ai zodra settings.examen_modus aan staat
quotaGuard    → 429 als het quotum van deze student op is
logActivity   → schrijft naar activity
```

---

## Fase 2 — Oefeningen via de API

De frontend haalt oefeningen nu rechtstreeks als bestand op. Dat wordt een API-call, maar het contract blijft bewust identiek van vorm zodat [exercises.js](../js/modules/exercises.js) minimaal verandert.

| Endpoint | Geeft terug |
|---|---|
| `GET /api/content/index` | de inhoud van `index.json5`, gefilterd op wat deze student mag zien; `{ subjects: [] }` in examenmodus |
| `GET /api/content/:vak/:module/:oefening` | `{ html, css, js, readme, startfiles, collapsed }` in één response |
| `GET /api/content/:vak/:module/:oefening/asset/*` | afbeeldingen en downloads uit de oefeningmap; pad-normalisatie tegen directory traversal |

De drie parallelle `fetchText()`-calls in `loadExercise()` worden één call. `oplossing/` en `criteria.md` zitten in geen enkele response — de backend leest ze alleen bij het opbouwen van een AI-prompt.

Aanpassingen in [exercises.js](../js/modules/exercises.js):

- `loadIndex()` → `GET /api/content/index` in plaats van `fetch('startcodes/index.json5')`
- `loadExercise()` → één call, `fetchText()` verdwijnt
- `Preview.setBaseUrl()` wijst naar de asset-route
- nieuwe afhandeling van `423 Locked` (examenmodus) en `401` (uitgelogd) → melding in de UI

---

## Fase 3 — De AI-assistent

### Twee scherp gescheiden modi

Dit is de belangrijkste ontwerpkeuze, en meteen de sterkste bescherming tegen het lekken van oplossingen:

| | **Coach** (feedforward) | **Feedback** (beoordeling) |
|---|---|---|
| Vorm | chat, meerdere beurten, streaming | één vraag, één gestructureerd antwoord |
| Ziet de modeloplossing | **nee** | ja |
| Ziet criteria.md | nee | ja |
| Ziet de screenshot | nee | ja |
| Ziet de code van de student | ja | ja |
| Model | `claude-sonnet-5`, effort `medium` | `claude-opus-5`, effort `high` |

De coach kan geen oplossing lekken die hij niet heeft. Dat is een structurele garantie, geen promptbelofte — instructies alleen zijn niet betrouwbaar genoeg voor deze regel.

### Promptopbouw (serverside, `server/prompts/`)

De systeemprompt wordt per oefening samengesteld uit vaste en variabele delen, in deze volgorde — belangrijk voor prompt caching:

```
[stabiel, gecached]   coaching.md              ← afgeplatte inhoud van de base-coaching skill
[stabiel, gecached]   vak-wdf.md / vak-dwd.md  ← afgeplatte inhoud van de course-* skills
[stabiel, gecached]   modus-coach.md / modus-feedback.md
─────────────────── cache_control breakpoint ───────────────────
[per oefening]        readme.md
[per oefening]        criteria.md + oplossing/   (alleen bij feedback)
[per verzoek]         de code van de student, de screenshot, de vraag
```

Over de bestaande Claude-skills: het *formaat* (SKILL.md, progressive disclosure) is eigen aan Claude Code en werkt hier niet, maar de *inhoud* is gewoon markdown en kan rechtstreeks overgenomen worden. Kort ze in tot 2 000–4 000 tokens per vak — er is geen bestandstoegang meer, dus alles wat het model nodig heeft moet in de prompt staan.

Omdat een hele klas dezelfde oefening maakt, is de cache-hit-ratio op het stabiele deel hoog. Controleer dit via `usage.cache_read_input_tokens` — blijft die nul, dan zit er een variabel element in het gecachete deel.

### Endpoints

**`POST /api/ai/coach`** — body `{ vak, module, oefening, vraag, geschiedenis[] }`. Streamt via SSE. De code van de student komt uit de request, niet uit de database.

**`POST /api/ai/feedback`** — body `{ vak, module, oefening, html, css, js }`. Geen streaming; antwoord via structured output met `output_config.format`, zodat het model geen code kán dumpen:

```json
{
  "totaalscore": 14,
  "maximum": 20,
  "criteria": [
    { "naam": "…", "score": 3, "maximum": 4, "toelichting": "…" }
  ],
  "sterk": ["…"],
  "werkpunten": ["…"],
  "volgende_stap": "…"
}
```

De screenshot uit `readme.md` gaat als image-block mee. Zet `thinking: { type: 'adaptive' }` en `fallbacks: 'default'` met beta `server-side-fallback-2026-07-01` (aanbevolen bij `claude-opus-5` om weigeringen op te vangen).

Na elke call: tokens en kosten wegschrijven in `ai_calls`, quota bijwerken.

### Frontend — PiP met tabs

De assistent komt in een Picture-in-Picture-venster. Eén beperking bepaalt het ontwerp: **er kan maar één Document Picture-in-Picture venster tegelijk bestaan.** Een tweede `requestWindow()` sluit het eerste. De opgave gebruikt PiP al, dus opgave en assistent moeten samen in één venster met tabs:

```
┌─ WebBox — 02. lijsten ──────────────┐
│ [ Opgave ] [ Assistent ]            │
├─────────────────────────────────────┤
│  … inhoud van de actieve tab …      │
└─────────────────────────────────────┘
```

Nieuwe en gewijzigde modules (paden na de herindeling van fase 0):

| Bestand | Rol |
|---|---|
| `client/js/modules/pip.js` | **nieuw** — beheert het ene PiP-venster, de tabs, het kopiëren van de stylesheets, en de fallback naar het bestaande `.modal`-patroon. Extraheert `requestPipWindow()` en `fillPipWindow()` uit [exercises.js:218-253](../js/modules/exercises.js#L218-L253). |
| `client/js/modules/assistant.js` | **nieuw** — chat-UI, feedbackknop, calls naar `/api/ai/*`, SSE-afhandeling, renderen van de scorekaart |
| `client/js/modules/auth.js` | **nieuw** — loginstatus, login-/logoutknop in de toolbar, 401-afhandeling |
| [exercises.js](../js/modules/exercises.js) | levert zijn PiP-logica af aan `pip.js`; API-calls i.p.v. bestands-fetches |
| [config.js](../js/config.js) | `Config.api` met de endpoint-paden |
| [index.html](../index.html) | assistent-paneel (verborgen, wordt in het PiP-venster geschoven), loginknop, tweede modal als fallback |
| `client/css/assistant.css` | opmaak van chat en scorekaart, plus een variant voor het PiP-document |

Twee praktische PiP-aandachtspunten: `requestWindow()` vereist een user gesture (de bestaande code lost dat al netjes op door de dialoog vóór de aanvraag te tonen), en stylesheets erven niet over — kopieer `document.styleSheets` naar het PiP-document. Verplaats het bestaande DOM-element naar het PiP-venster in plaats van HTML te herbouwen, dan blijven de event listeners werken; zet het terug bij `pagehide`.

Bouwvolgorde binnen deze fase: eerst de modal-fallback volledig werkend, dan pas PiP eroverheen. Zo is er altijd een werkende UI, ook in Firefox en Safari (die kennen Document PiP niet).

---

## Fase 4 — Quota, examenmodus en dashboard

**Quota** — per student per week, apart voor coach en feedback (bv. 30 coachvragen, 10 feedbackrondes). Instelbaar per rol; docenten onbeperkt. De teller staat in `quota`, de waarheid in `ai_calls`.

**Examenmodus** — één rij in `settings`, omgezet via het dashboard. Als hij aan staat: `/api/content/index` geeft een lege lijst, `/api/content/:…` geeft 423, `/api/ai/*` geeft 423. De frontend toont een examenbanner en verbergt de dropdowns en de assistentknop. Omdat de inhoud nooit publiek staat, is dit een echte blokkade en geen UI-truc. Optioneel per vak, zodat een DWD-examen de WDF-oefeningen niet blokkeert.

**Dashboard** — `/docent`, achter een rolcheck. Zes weergaven volstaan om te beginnen: activiteit per oefening (welke oefeningen worden veel geprobeerd, welke zelden), voortgang per student, AI-verbruik en kosten per week, mislukte loginpogingen, het gebruikersbeheer (klaslijst importeren, pincodes genereren en resetten), en de examenschakelaar.

---

## Veiligheid

Vier punten, in volgorde van belang:

**0. Brute force op de pincode.** Zie het aandachtspunt bij Authenticatie hierboven. Dit is het enige punt in het plan dat niet mag blijven liggen tot later: een inlogeindpunt met een korte pincode, opsombare gebruikersnamen en zonder rem is binnen enkele uren open. De drie limieten — per account, per IP en globaal — horen in dezelfde commit als het inlogeindpunt zelf.

**1. Het preview-iframe draait op de origin van de app.** [index.html:121](../index.html#L121) gebruikt `sandbox="allow-scripts allow-same-origin"` met `srcdoc`. Die combinatie geeft de code van de student de origin van de app. Nu is dat hooguit vervelend; zodra er een ingelogde sessie is, kan code in de preview `fetch('/api/ai/coach', {credentials:'include'})` doen — met de sessie van de student. Een studentcode-fragment van internet kan zo iemands quotum leegtrekken.

Oplossing in de doelopstelling: serveer het preview-document van `preview.webbox.<domein>` en laat het iframe daarheen wijzen in plaats van `srcdoc`. Dan is het een echte andere origin en verandert er functioneel niets voor de student. `allow-same-origin` zomaar weghalen is géén goed alternatief — dat breekt DWD-oefeningen die `localStorage` of `fetch` gebruiken.

**2. API-sleutel.** Blijft serverside in een omgevingsvariabele, komt nooit in de client. Dat is meteen de reden dat BYOK vervalt: met één key van de docent en quota per student hoeven studenten niets in te stellen.

**3. Padvalidatie op de asset-route.** `/api/content/:vak/:module/:oefening/asset/*` leest bestanden van schijf op basis van invoer uit de URL. Normaliseer het pad en controleer dat het resultaat binnen de oefeningmap blijft, en filter expliciet op `oplossing/` en `criteria.md`.

---

## Kosten

Ruwe schatting per verzoek: ±6 000 input-tokens (systeemprompt, opgave, criteria, modeloplossing, code, screenshot) en ±800 output-tokens.

| Gebruik | Model | Per verzoek | 100 studenten × 1 semester |
|---|---|---|---|
| Coach | `claude-sonnet-5` | ~2 cent | ~€60 bij 30 vragen/student |
| Feedback | `claude-opus-5` | ~5 cent | ~€50 bij 10 rondes/student |

Prompt caching drukt het stabiele deel met ongeveer 90 % zodra meerdere studenten aan dezelfde oefening werken; reken in de praktijk op de helft van bovenstaande bedragen. Wil je lager: `claude-haiku-4-5` voor de coach halveert die post nog eens, ten koste van de kwaliteit van de uitleg. Zet het model per modus in een omgevingsvariabele zodat je kunt schuiven zonder code te wijzigen.

---

## Verificatie

**Fase 1–2**
- Uitgelogd: elke `/api/*`-route geeft 401; de frontend toont het loginscherm.
- Inloggen met een geldige pincode lukt; met een foute pincode geeft het exact dezelfde melding als met een onbekend r-nummer.
- Script dat 10 keer na elkaar een foute pincode probeert op één r-nummer: vanaf de zesde poging 429.
- Script dat één pincode probeert op 30 verschillende r-nummers vanaf één IP: vanaf de 21e poging 429 — dit is de spray-test en de belangrijkste van de drie.
- Na 100 mislukte pogingen binnen het uur over alle accounts samen: melding zichtbaar in het dashboard.
- In de database staat nergens een pincode in leesbare vorm, en geen enkele tabel bevat een naam of e-mailadres.
- Ingelogd: oefening laden werkt identiek aan nu — startcode in de drie editors, opgave in PiP, preview draait.
- `curl` rechtstreeks op `/api/content/wdf/a-html-tekst/02-lijsten` bevat geen `oplossing` en geen `criteria`.
- `curl` met `../../` in de asset-route geeft 400, geen bestand.

**Fase 3**
- Coach: vraag "hoe maak ik dit?" op een oefening → antwoord bevat een hint, geen volledige oplossing. Vraag daarna expliciet "geef me de code" → weigering met een tip. Log de prompt en controleer dat de modeloplossing er niet in zit.
- Feedback: dien een bewust half afgewerkte oefening in → score onder het maximum, werkpunten benoemen wat ontbreekt. Dien de modeloplossing zelf in → score op of nabij het maximum. Dien lege editors in → lage score zonder crash.
- Cache: twee opeenvolgende verzoeken op dezelfde oefening; `usage.cache_read_input_tokens` moet bij het tweede groter dan nul zijn.
- PiP: opgave openen, dan assistent openen → één venster, twee tabs, geen tweede venster. In Firefox → modal-fallback.
- `ai_calls` bevat na elke test een rij met kloppende tokenaantallen.

**Fase 4**
- Examenmodus aan → dropdowns leeg, assistentknop weg, `curl` op `/api/content/index` geeft een lege lijst, `/api/ai/coach` geeft 423. Examenmodus uit → alles terug.
- Quotum op → 429 met een begrijpelijke melding in de UI, niet een stille fout.
- Dashboard: activiteit van de testaccounts verschijnt, kosten kloppen met de som uit `ai_calls`.

---

## Volgorde en afhankelijkheden

Fase 0 → 1 → 2 zijn strikt volgordelijk. Fase 3 kan starten zodra fase 2 klaar is. Fase 4 kan grotendeels parallel met fase 3, behalve de examenmodus, die fase 2 nodig heeft.

Wil je sneller iets bruikbaars: fase 3 kan draaien op een minimale backend die alleen de AI proxyt en de content serveert, met login als stub. Login, quota en dashboard schuiven dan naar achteren zonder dat er iets herschreven moet worden — de middleware-keten is er al, hij doet alleen nog niets.
