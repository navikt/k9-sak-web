---
applyTo: "**"
excludeAgent: "cloud-agent"
---

# Generelle review-instruksjoner

Gjelder GitHub Copilot code review for alle filer i dette repoet. Flagg for menneskelig reviewer — ikke blokker.

## Generelle sjekker

- **Branch-navn**: forventet prefiks `feature/`, `fix/`, `chore/`, `docs/`
- **Relevans**: rimelig omfang, ingen urelaterte endringer

## Domene-spesifikke flaggingspunkter

### NAIS-konfig
Endringer i `nais*.yaml`/`naiserator.yaml`: `accessPolicy`, `env` (secrets, SCOPE, credentials), `azure.application`/`tokenx`, ressursgrenser, replicas

### Autentisering/autorisasjon
Tokens, OIDC, SAML, `@BeskyttetRessurs`, `@ProtectedWithClaims`, ABAC-evaluering, tilgangssjekker, endrede API-endepunkter

### ProsessTask/jobbstyring
Nye/endrede `ProsessTask`, cron-uttrykk, retry-logikk, feilhåndtering i async tasks

### Integrasjonspunkter
Klienter mot eksterne systemer (Økonomi/OS, Infotrygd, PDL, Dokarkiv), Kafka (topic, serialisering, feilhåndtering), REST/SOAP-klienter

### Miljøvariabler/hemmeligheter
Variabler med `SCOPE`, `CLIENT_ID`, `CLIENT_SECRET`, `CREDENTIAL`; Vault/Azure Key Vault-refs; hardkodede URLer/tokens/credentials (→ sikkerhetsflagg)

### Sensitive data i output
FNR, aktørId, tokens eller request-verdier eksponert via logg, exception-meldinger eller valideringsannotasjoner (`${validatedValue}` i `@Pattern`/`@Size` o.l.) → sikkerhetsflagg

### GitHub Actions
Endringer i `.github/workflows/`: bygg/test/deploy, fjerning/svekkelse av teststeg, deployment-targets, upinnede action-versjoner

### Test/deployment-sikringer
Fjerning av test-assertions/testfiler, `@Disabled`/`skipTests`, endrede deployment-guards/approval-gates
