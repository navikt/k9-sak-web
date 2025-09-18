Combined
========

Denne katalog skal innehalde kombinerte genererte typer frå ulike backends, når disse er meint å representere ein og samme type på tvers av backends.

På denne måten kan vi ha felles kode som opererer på data frå ulike backends på ein typesikker måte ved å bruke disse kombinerte typer som input.

Strukturen er at ein bruker katalogstrukturen til å etterlikne pakkenamn strukturen som dei genererte typane kjem med etter beste evne. Viss dei ulike backends har ulike pakkenamn for samme type, foretrekk strukturen frå k9-sak, evt det som gjev mest meining logisk sett for bruk i frontend.

Eksempel: `FagsakYtelseType`.

Denne har i ulike backends disse namn (utenom `no.nav.` prefiks):
- `k9.kodeverk.behandling.FagsakYtelseType`
- `k9.klage.kodeverk.behandling.FagsakYtelseType`
- `foreldrepenger.tilbakekreving.behandlingslager.fagsak.FagsakYtelseType`
- `ung.kodeverk.behandling.FagsakYtelseType`
- `sif.tilbakekreving.behandlingslager.fagsak.FagsakYtelseType`

Vi legger denne derfor i katalog `combined/kodeverk/behandling/` for å etterlikne dei mest brukte pakkenamna den består av, og det som gjev mest logisk struktur for bruk i frontend.
