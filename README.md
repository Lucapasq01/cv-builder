# CV Builder

Applicazione React + TypeScript per creare e visualizzare il tuo curriculum in tempo reale.

## Funzionalità

- Modifica in tempo reale con anteprima affiancata
- Esportazione del CV in formato PDF
- Caricamento e visualizzazione della foto profilo

## Requisiti

- Node.js (versione >= 18 consigliata)
- npm o pnpm o yarn

## Installazione

```bash
npm install
```

## Script disponibili

- `npm run dev` avvia l'applicazione in modalità sviluppo su `http://localhost:5173`
- `npm run build` crea la build di produzione nella cartella `dist`
- `npm run preview` avvia un server locale per verificare la build
- `npm run lint` esegue ESLint sui file TypeScript/TSX

## Struttura del progetto

- `src/App.tsx`: logica principale del form e anteprima del CV
- `src/components/CVPreview.tsx`: componente responsabile della renderizzazione del CV
- `src/components/FormSection.tsx`: layout riutilizzabile per le sezioni del form
- `src/types/cv.ts`: tipizzazioni delle varie sezioni del curriculum
- `src/utils/id.ts`: generazione ID unici per gli elementi dinamici

## Personalizzazione

Aggiorna i componenti e gli stili in `src/` per adattare il CV alle tue preferenze. Gli stili principali si trovano in `src/App.css`.
