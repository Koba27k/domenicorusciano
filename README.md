# Domenico Rusciano — biglietto da visita digitale

Sito statico: tutto quello che va online è nella cartella `dist/`.

Anteprima in locale:

```bash
node preview.cjs
```

poi apri http://127.0.0.1:4173

## Pubblicazione su GitHub Pages

1. Crea un repository su GitHub e fai push del branch `main`.
2. Nel repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Da quel momento ogni push su `main` pubblica `dist/` (workflow `.github/workflows/deploy.yml`).
   Si può rilanciare a mano da **Actions → Pubblica sito → Run workflow**.

## Collegare il dominio

1. **Settings → Pages → Custom domain**: inserisci il dominio (es. `domenicorusciano.it`) e salva.
2. Nel pannello DNS del registrar:
   - dominio principale: quattro record `A` verso
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www`: record `CNAME` verso `<nome-utente-github>.github.io`
3. Quando GitHub conferma il DNS, spunta **Enforce HTTPS**.
4. Rilancia il workflow una volta: l'immagine di anteprima per WhatsApp e social
   (`og:image`) prende automaticamente l'indirizzo del dominio.

Non serve un file `CNAME`: con la pubblicazione tramite Actions il dominio si imposta solo da Settings → Pages.
