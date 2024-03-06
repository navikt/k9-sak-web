import { KodeverkType } from '@k9-sak-web/gui/kodeverk/index.js';
import { Kodeverk } from './Kodeverk';

export type KodeverkResponse = {
  [key in KodeverkType]: Kodeverk[];
};

/*
AktivitetStatus: KodeverkMedNavn[];
ArbeidType: KodeverkMedNavn[];
ArbeidsforholdHandlingType: KodeverkMedNavn[];
Arbeidskategori: KodeverkMedNavn[];
Avslagsårsak: KodeverkMedNavn[];
BehandlingResultatType: KodeverkMedNavn[];
BehandlingStatus: KodeverkMedNavn[];
BehandlingType: KodeverkMedNavn[];
BehandlingÅrsakType: KodeverkMedNavn[];
DokumentTypeId: KodeverkMedNavn[];
FagsakStatus: KodeverkMedNavn[];
FagsakYtelseType: KodeverkMedNavn[];
Fagsystem: KodeverkMedNavn[];
FaktaOmBeregningTilfelle: KodeverkMedNavn[];
HistorikkAktør: KodeverkMedNavn[];
HistorikkAvklartSoeknadsperiodeType: KodeverkMedNavn[];
HistorikkBegrunnelseType: KodeverkMedNavn[];
HistorikkEndretFeltType: KodeverkMedNavn[];
HistorikkEndretFeltVerdiType: KodeverkMedNavn[];
HistorikkOpplysningType: KodeverkMedNavn[];
HistorikkResultatType: KodeverkMedNavn[];
HistorikkinnslagType: KodeverkMedNavn[];
Inntektskategori: KodeverkMedNavn[];
KonsekvensForYtelsen: KodeverkMedNavn[];
Landkoder: KodeverkMedNavn[];
MedlemskapDekningType: KodeverkMedNavn[];
MedlemskapManuellVurderingType: KodeverkMedNavn[];
MedlemskapType: KodeverkMedNavn[];
OppgaveÅrsak: KodeverkMedNavn[];
OpptjeningAktivitetType: KodeverkMedNavn[];
PermisjonsbeskrivelseType: KodeverkMedNavn[];
PersonstatusType: KodeverkMedNavn[];
Region: KodeverkMedNavn[];
RelatertYtelseTilstand: KodeverkMedNavn[];
RevurderingVarslingÅrsak: KodeverkMedNavn[];
SivilstandType: KodeverkMedNavn[];
SkjermlenkeType: KodeverkMedNavn[];
Språkkode: KodeverkMedNavn[];
TilbakekrevingVidereBehandling: KodeverkMedNavn[];
UtenlandsoppholdÅrsak: KodeverkMedNavn[];
VedtakResultatType: KodeverkMedNavn[];
Venteårsak: KodeverkMedNavn[];
VilkårType: KodeverkMedNavn[];
VirksomhetType: KodeverkMedNavn[];
VurderArbeidsforholdHistorikkinnslag: KodeverkMedNavn[];
VurderÅrsak: KodeverkMedNavn[];
ÅrsakTilVurdering: KodeverkMedNavn[]; */
