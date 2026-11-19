import {
  finnNesteStegForLivetsSluttfase,
  finnNesteStegForOpplæringspenger,
  finnNesteStegForPleiepenger,
  nesteStegErLivetssluttfase,
  nesteStegErOpplæringspenger,
  nesteStegErVurderingForPleiepenger,
  stegForSakstype,
} from '../statusUtils';
import StatusResponse from '../../types/SykdomsstegStatusResponse';
import {
  dokumentSteg,
  langvarigSykdomSteg,
  livetsSluttfaseSteg,
  opplæringspengerDokumentSteg,
  sluttfaseDokumentSteg,
  StepId,
  tilsynOgPleieSteg,
  toOmsorgspersonerSteg,
} from '../../types/Step';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

const lagStatus = (overstyring: Partial<StatusResponse> = {}): StatusResponse => ({
  kanLøseAksjonspunkt: false,
  harDataSomIkkeHarBlittTattMedIBehandling: false,
  harUklassifiserteDokumenter: false,
  manglerDiagnosekode: false,
  manglerGodkjentLegeerklæring: false,
  manglerVurderingAvKontinuerligTilsynOgPleie: false,
  manglerVurderingAvToOmsorgspersoner: false,
  nyttDokumentHarIkkekontrollertEksisterendeVurderinger: false,
  manglerVurderingAvLangvarigSykdom: false,
  ikkeSammenMedBarnet: false,
  ...overstyring,
});

describe('statusUtils', () => {
  describe('finnNesteSteg', () => {
    describe('dokumentsteget', () => {
      it('harUklassifiserteDokumenter=true should give Step.Dokument', () => {
        const nesteSteg = finnNesteStegForPleiepenger({ harUklassifiserteDokumenter: true } as StatusResponse);
        expect(nesteSteg!.id).toBe(StepId.Dokument);
      });

      it('manglerDiagnosekode=true should give Step.Dokument', () => {
        const nesteSteg = finnNesteStegForPleiepenger({ manglerDiagnosekode: true } as StatusResponse);
        expect(nesteSteg!.id).toBe(StepId.Dokument);
      });

      it('manglerGodkjentLegeerklæring=true should give Step.Dokument', () => {
        const nesteSteg = finnNesteStegForPleiepenger({ manglerGodkjentLegeerklæring: true } as StatusResponse);
        expect(nesteSteg!.id).toBe(StepId.Dokument);
      });
    });

    describe('tilsynOgPleie-steget', () => {
      it('manglerVurderingAvKontinuerligTilsynOgPleie should give Step.TilsynOgPleie', () => {
        const nesteSteg = finnNesteStegForPleiepenger({
          manglerVurderingAvKontinuerligTilsynOgPleie: true,
        } as StatusResponse);
        expect(nesteSteg!.id).toBe(StepId.TilsynOgPleie);
      });
    });

    describe('toOmsorgspersoner-steget', () => {
      it('manglerVurderingAvToOmsorgspersoner should give Step.TilsynOgPleie', () => {
        const nesteSteg = finnNesteStegForPleiepenger({ manglerVurderingAvToOmsorgspersoner: true } as StatusResponse);
        expect(nesteSteg!.id).toBe(StepId.ToOmsorgspersoner);
      });
    });
  });

  describe('stegForSakstype', () => {
    it('gir stegene for opplæringspenger', () => {
      expect(stegForSakstype(fagsakYtelsesType.OPPLÆRINGSPENGER)).toEqual([
        opplæringspengerDokumentSteg,
        langvarigSykdomSteg,
      ]);
    });

    it('gir stegene for pleiepenger til nærstående', () => {
      expect(stegForSakstype(fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE)).toEqual([
        sluttfaseDokumentSteg,
        livetsSluttfaseSteg,
      ]);
    });

    it('gir stegene for pleiepenger for sykt barn', () => {
      expect(stegForSakstype(fagsakYtelsesType.PLEIEPENGER_SYKT_BARN)).toEqual([
        dokumentSteg,
        tilsynOgPleieSteg,
        toOmsorgspersonerSteg,
      ]);
    });

    it('gir standardsteg når sakstypen mangler', () => {
      expect(stegForSakstype(undefined)).toEqual([dokumentSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg]);
    });
  });

  describe('finnNesteStegForPleiepenger', () => {
    it('går til tilsyn og pleie når nye dokumenter ikke er kontrollert mot eksisterende vurderinger', () => {
      expect(
        finnNesteStegForPleiepenger(lagStatus({ nyttDokumentHarIkkekontrollertEksisterendeVurderinger: true })),
      ).toBe(tilsynOgPleieSteg);
    });

    it('prioriterer uklassifiserte dokumenter over manglende vurderinger', () => {
      expect(
        finnNesteStegForPleiepenger(
          lagStatus({
            harUklassifiserteDokumenter: true,
            manglerVurderingAvKontinuerligTilsynOgPleie: true,
            manglerVurderingAvToOmsorgspersoner: true,
          }),
        ),
      ).toBe(dokumentSteg);
    });

    it('prioriterer manglende diagnosekode over manglende vurderinger', () => {
      expect(
        finnNesteStegForPleiepenger(
          lagStatus({
            manglerDiagnosekode: true,
            manglerVurderingAvKontinuerligTilsynOgPleie: true,
            manglerVurderingAvToOmsorgspersoner: true,
          }),
        ),
      ).toBe(dokumentSteg);
    });

    it('prioriterer manglende legeerklæring over manglende vurderinger', () => {
      expect(
        finnNesteStegForPleiepenger(
          lagStatus({
            manglerGodkjentLegeerklæring: true,
            manglerVurderingAvKontinuerligTilsynOgPleie: true,
            manglerVurderingAvToOmsorgspersoner: true,
          }),
        ),
      ).toBe(dokumentSteg);
    });

    it('prioriterer tilsyn og pleie over vurdering av to omsorgspersoner', () => {
      expect(
        finnNesteStegForPleiepenger(
          lagStatus({
            manglerVurderingAvKontinuerligTilsynOgPleie: true,
            manglerVurderingAvToOmsorgspersoner: true,
          }),
        ),
      ).toBe(tilsynOgPleieSteg);
    });

    it('går til tilsyn og pleie når aksjonspunkt kan løses uten montering', () => {
      expect(finnNesteStegForPleiepenger(lagStatus({ kanLøseAksjonspunkt: true }))).toBe(tilsynOgPleieSteg);
    });

    it('returnerer null når aksjonspunkt kan løses ved montering', () => {
      expect(finnNesteStegForPleiepenger(lagStatus({ kanLøseAksjonspunkt: true }), true)).toBeNull();
    });

    it('returnerer null når ingen flagg er satt', () => {
      expect(finnNesteStegForPleiepenger(lagStatus())).toBeNull();
    });
  });

  describe('finnNesteStegForLivetsSluttfase', () => {
    it('går til dokumentsteget ved uklassifiserte dokumenter', () => {
      expect(finnNesteStegForLivetsSluttfase(lagStatus({ harUklassifiserteDokumenter: true }))).toBe(
        sluttfaseDokumentSteg,
      );
    });

    it('går til dokumentsteget ved manglende godkjent legeerklæring', () => {
      expect(finnNesteStegForLivetsSluttfase(lagStatus({ manglerGodkjentLegeerklæring: true }))).toBe(
        sluttfaseDokumentSteg,
      );
    });

    it('går til livets sluttfase ved manglende vurdering', () => {
      expect(finnNesteStegForLivetsSluttfase(lagStatus({ manglerVurderingAvILivetsSluttfase: true }))).toBe(
        livetsSluttfaseSteg,
      );
    });

    it('går til livets sluttfase når nye dokumenter ikke er kontrollert mot eksisterende vurderinger', () => {
      expect(
        finnNesteStegForLivetsSluttfase(lagStatus({ nyttDokumentHarIkkekontrollertEksisterendeVurderinger: true })),
      ).toBe(livetsSluttfaseSteg);
    });

    it('prioriterer uklassifiserte dokumenter over vurderingsflagg', () => {
      expect(
        finnNesteStegForLivetsSluttfase(
          lagStatus({ harUklassifiserteDokumenter: true, manglerVurderingAvILivetsSluttfase: true }),
        ),
      ).toBe(sluttfaseDokumentSteg);
    });

    it('prioriterer manglende legeerklæring over vurderingsflagg', () => {
      expect(
        finnNesteStegForLivetsSluttfase(
          lagStatus({ manglerGodkjentLegeerklæring: true, manglerVurderingAvILivetsSluttfase: true }),
        ),
      ).toBe(sluttfaseDokumentSteg);
    });

    it('går til livets sluttfase når aksjonspunkt kan løses uten montering', () => {
      expect(finnNesteStegForLivetsSluttfase(lagStatus({ kanLøseAksjonspunkt: true }))).toBe(livetsSluttfaseSteg);
    });

    it('går til dokumentsteget når aksjonspunkt kan løses ved montering', () => {
      expect(finnNesteStegForLivetsSluttfase(lagStatus({ kanLøseAksjonspunkt: true }), true)).toBe(
        sluttfaseDokumentSteg,
      );
    });

    it('går til dokumentsteget når ingen flagg er satt', () => {
      expect(finnNesteStegForLivetsSluttfase(lagStatus())).toBe(sluttfaseDokumentSteg);
    });
  });

  describe('finnNesteStegForOpplæringspenger', () => {
    it('går til dokumentsteget ved uklassifiserte dokumenter', () => {
      expect(finnNesteStegForOpplæringspenger(lagStatus({ harUklassifiserteDokumenter: true }))).toBe(
        opplæringspengerDokumentSteg,
      );
    });

    it('går til dokumentsteget ved manglende godkjent legeerklæring', () => {
      expect(finnNesteStegForOpplæringspenger(lagStatus({ manglerGodkjentLegeerklæring: true }))).toBe(
        opplæringspengerDokumentSteg,
      );
    });

    it('går til langvarig sykdom ved manglende vurdering', () => {
      expect(finnNesteStegForOpplæringspenger(lagStatus({ manglerVurderingAvLangvarigSykdom: true }))).toBe(
        langvarigSykdomSteg,
      );
    });

    it('går til langvarig sykdom når nye dokumenter ikke er kontrollert mot eksisterende vurderinger', () => {
      expect(
        finnNesteStegForOpplæringspenger(lagStatus({ nyttDokumentHarIkkekontrollertEksisterendeVurderinger: true })),
      ).toBe(langvarigSykdomSteg);
    });

    it('prioriterer uklassifiserte dokumenter over manglende vurdering', () => {
      expect(
        finnNesteStegForOpplæringspenger(
          lagStatus({ harUklassifiserteDokumenter: true, manglerVurderingAvLangvarigSykdom: true }),
        ),
      ).toBe(opplæringspengerDokumentSteg);
    });

    it('prioriterer manglende legeerklæring over manglende vurdering', () => {
      expect(
        finnNesteStegForOpplæringspenger(
          lagStatus({ manglerGodkjentLegeerklæring: true, manglerVurderingAvLangvarigSykdom: true }),
        ),
      ).toBe(opplæringspengerDokumentSteg);
    });

    it('går til langvarig sykdom når aksjonspunkt kan løses uten montering', () => {
      expect(finnNesteStegForOpplæringspenger(lagStatus({ kanLøseAksjonspunkt: true }))).toBe(langvarigSykdomSteg);
    });

    it('går til dokumentsteget når aksjonspunkt kan løses ved montering', () => {
      expect(finnNesteStegForOpplæringspenger(lagStatus({ kanLøseAksjonspunkt: true }), true)).toBe(
        opplæringspengerDokumentSteg,
      );
    });

    it('går til dokumentsteget når ingen flagg er satt', () => {
      expect(finnNesteStegForOpplæringspenger(lagStatus())).toBe(opplæringspengerDokumentSteg);
    });
  });

  describe('nesteStegErVurderingForPleiepenger', () => {
    it('returnerer true når neste steg er vurdering', () => {
      expect(nesteStegErVurderingForPleiepenger(lagStatus({ manglerVurderingAvKontinuerligTilsynOgPleie: true }))).toBe(
        true,
      );
    });

    it('returnerer false når neste steg er dokumentasjon', () => {
      expect(nesteStegErVurderingForPleiepenger(lagStatus({ harUklassifiserteDokumenter: true }))).toBe(false);
    });
  });

  describe('nesteStegErLivetssluttfase', () => {
    it('returnerer true når neste steg er livets sluttfase', () => {
      expect(nesteStegErLivetssluttfase(lagStatus({ manglerVurderingAvILivetsSluttfase: true }))).toBe(true);
    });

    it('returnerer false når neste steg er dokumentasjon', () => {
      expect(nesteStegErLivetssluttfase(lagStatus({ harUklassifiserteDokumenter: true }))).toBe(false);
    });
  });

  describe('nesteStegErOpplæringspenger', () => {
    it('returnerer true når neste steg er langvarig sykdom', () => {
      expect(nesteStegErOpplæringspenger(lagStatus({ manglerVurderingAvLangvarigSykdom: true }))).toBe(true);
    });

    it('returnerer false når neste steg er dokumentasjon', () => {
      expect(nesteStegErOpplæringspenger(lagStatus({ harUklassifiserteDokumenter: true }))).toBe(false);
    });
  });
});
