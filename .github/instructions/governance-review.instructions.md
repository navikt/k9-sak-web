---
applyTo: "**"
excludeAgent: "cloud-agent"
---

# Generelle review-instruksjoner

Disse instruksjonene gjelder for GitHub Copilot code review for alle filer i dette repoet.

## Generelle sjekker

### Branch-navngivning
Flag dersom source branch ikke følger navnekonvensjon. Forventede prefikser:
- `feature/`, `fix/`, `chore/`, `docs/`

### Relevans
Verifiser at endringene er rimelige i omfang og relevante for oppgitt formål.
Flag dersom PRen inneholder urelaterte endringer blandet inn.

## Domene-spesifikke punkter

Flag følgende for menneskelig reviewer. Ikke blokker — fremhev med kommentar.

### NAIS-konfigurasjon
- Endringer i `nais*.yaml` eller `naiserator.yaml` som modifiserer:
  - `accessPolicy` (inbound/outbound-regler)
  - `env`-variabler (spesielt secrets, SCOPE, credentials)
  - `azure.application` eller `tokenx`-konfigurasjon
  - Ressursgrenser eller replicas

### Autentisering og autorisasjon
- Endringer i kode som håndterer tokens, OIDC, SAML, `@BeskyttetRessurs` eller `@ProtectedWithClaims`
- Endringer i ABAC policy-evaluering eller tilgangssjekker
- Nye eller endrede API-endepunkter som endrer tilgangskontroll

### ProsessTask og jobbstyring
- Nye `ProsessTask`-implementasjoner eller endringer i task type-definisjoner
- Endringer i cron-uttrykk eller konfigurering av planlagte jobber
- Endringer i retry-logikk eller feilhåndtering i asynkrone tasks

### Integrasjonspunkter
- Endringer i klienter som kaller eksterne systemer (spesielt Økonomi/OS, Infotrygd, PDL, Dokarkiv)
- Endringer i Kafka-produsenter/konsumenter (topic-navn, serialisering, feilhåndtering)
- Nye eller endrede REST/SOAP-klientkonfigurasjoner

### Miljøvariabler og hemmeligheter
- Nye eller endrede miljøvariabler som inneholder `SCOPE`, `CLIENT_ID`, `CLIENT_SECRET` eller `CREDENTIAL`
- Referanser til Vault eller Azure Key Vault-hemmeligheter
- Hardkodede URLer, tokens eller credentials (flag som sikkerhetsproblem)

### GitHub Actions workflows
- Endringer i `.github/workflows/` som påvirker bygg, test eller deploy-pipelines
- Fjerning eller svekkelse av teststeg
- Endringer i deployment-targets eller betingelser
- Upinnede action-versjoner (bør bruke SHA eller versjonstagg)

### Test- og deployment-sikringer
- Fjerning av test-assertions eller testfiler uten erstatning
- Endringer som hopper over eller deaktiverer tester (`@Disabled`, `skipTests`)
- Modifikasjoner av deployment-guards eller approval-gates
