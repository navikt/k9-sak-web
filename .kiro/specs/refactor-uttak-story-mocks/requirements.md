# Requirements Document

## Introduction

Storybook-filene for uttak-komponenter inneholder mye duplisert mock-data, MSW handlers og hjelpefunksjoner som gjør filene lange og vanskelige å vedlikeholde. Denne refaktoreringen vil flytte gjenbrukbar kode til dedikerte mock-filer for å forbedre vedlikeholdbarhet, redusere duplisering og gjøre det enklere å skrive nye stories.

## Requirements

### Requirement 1: Flytt MSW handlers til dedikert fil

**User Story:** Som utvikler vil jeg ha gjenbrukbare MSW handlers, slik at jeg slipper å duplisere handler-logikk i hver story-fil.

#### Acceptance Criteria

1. WHEN jeg oppretter en ny story THEN skal jeg kunne importere standard MSW handlers fra en dedikert fil
2. WHEN jeg trenger en spesialisert handler THEN skal jeg kunne bruke factory-funksjoner for å tilpasse handlers
3. WHEN jeg ser på story-filer THEN skal MSW handler-logikk være minimal og fokusert på story-spesifikke behov
4. WHEN jeg endrer en standard handler THEN skal endringen reflekteres i alle stories som bruker den

### Requirement 2: Flytt datoberegninger til hjelpefunksjoner

**User Story:** Som utvikler vil jeg ha gjenbrukbare hjelpefunksjoner for datoberegninger, slik at jeg kan lage konsistente testdata med relative datoer.

#### Acceptance Criteria

1. WHEN jeg trenger relative perioder i en story THEN skal jeg kunne bruke en hjelpefunksjon som genererer datoer basert på dagens dato
2. WHEN jeg trenger å splitte perioder i tester THEN skal jeg kunne bruke hjelpefunksjoner for å beregne splitt-datoer
3. WHEN jeg ser på story-filer THEN skal datoberegninger være abstrahert bort fra story-logikken
4. WHEN jeg bruker datohjelpefunksjoner THEN skal de returnere dayjs-objekter for enkel videre manipulering

### Requirement 3: Lag factory-funksjoner for overlappende saker

**User Story:** Som utvikler vil jeg ha factory-funksjoner for overlappende saker, slik at jeg enkelt kan lage testdata for dette scenariet.

#### Acceptance Criteria

1. WHEN jeg trenger mock-data for overlappende perioder THEN skal jeg kunne bruke en factory-funksjon
2. WHEN jeg oppretter overlappende perioder THEN skal factory-funksjonen støtte valgfrie parametere for tilpasning
3. WHEN jeg ser på VurderOverlappendeSak stories THEN skal mock-data være opprettet med factory-funksjoner
4. WHEN jeg trenger ulike tilstander av overlappende saker THEN skal factory-funksjoner støtte både uløste og løste tilstander

### Requirement 4: Organiser mock-filer i logisk struktur

**User Story:** Som utvikler vil jeg ha en klar og logisk filstruktur for mock-data, slik at jeg enkelt finner og vedlikeholder mock-kode.

#### Acceptance Criteria

1. WHEN jeg ser på mock-katalogen THEN skal det være klart hvilken fil som inneholder hvilken type mock-data
2. WHEN jeg trenger MSW handlers THEN skal de være i en fil dedikert til handlers
3. WHEN jeg trenger hjelpefunksjoner THEN skal de være i en fil dedikert til test-utilities
4. WHEN jeg trenger data builders THEN skal de være i uttakStoryMocks.ts (eksisterende fil)

### Requirement 5: Refaktorer eksisterende story-filer

**User Story:** Som utvikler vil jeg at eksisterende story-filer skal bruke de nye mock-filene, slik at vi får konsistens og redusert duplisering.

#### Acceptance Criteria

1. WHEN jeg ser på Uttak.stories.tsx THEN skal den bruke standard MSW handlers fra dedikert fil
2. WHEN jeg ser på VurderOverlappendeSak.stories.tsx THEN skal den bruke datohjelpefunksjoner og factory-funksjoner
3. WHEN jeg ser på VurderDato.stories.tsx THEN skal den bruke standard MSW handlers
4. WHEN jeg ser på OverstyrUttak.stories.tsx THEN skal den bruke factory-funksjoner for handlers med kompleks logikk
5. WHEN jeg kjører eksisterende stories THEN skal de fungere identisk som før refaktoreringen
6. WHEN jeg kjører alle stories samtidig THEN skal hver story ha isolerte testdata som ikke påvirker andre stories

### Requirement 6: Sikre immutability og dataisolasjon

**User Story:** Som utvikler vil jeg at mock-data skal være immutable og isolert, slik at endringer i én test ikke påvirker andre tester.

#### Acceptance Criteria

1. WHEN jeg bruker en factory-funksjon THEN skal den returnere nye objekter hver gang (ikke gjenbruke referanser)
2. WHEN jeg bruker standard mock-data (f.eks. defaultArbeidsgivere) THEN skal den være frosset eller returneres som kopi
3. WHEN jeg endrer mock-data i én story THEN skal det ikke påvirke mock-data i andre stories
4. WHEN jeg bruker datohjelpefunksjoner THEN skal de returnere nye dayjs-objekter hver gang
5. WHEN jeg ser på factory-funksjoner THEN skal de bruke spread operator eller Object.assign for å lage kopier
6. WHEN jeg bruker delte konstanter THEN skal de være primitive verdier eller frosne objekter

### Requirement 6: Dokumenter nye mock-utilities

**User Story:** Som utvikler vil jeg ha god dokumentasjon for mock-utilities, slik at jeg vet hvordan jeg skal bruke dem.

#### Acceptance Criteria

1. WHEN jeg ser på mock-filer THEN skal hver eksportert funksjon ha JSDoc-kommentarer
2. WHEN jeg leser JSDoc THEN skal den forklare hva funksjonen gjør og hvordan den brukes
3. WHEN jeg ser på factory-funksjoner THEN skal parametere være dokumentert med eksempler
4. WHEN jeg trenger å lage nye stories THEN skal dokumentasjonen gi meg nok informasjon til å komme i gang
