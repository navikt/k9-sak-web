import { Period } from '@navikt/k9-period-utils';
import Link from './Link';
import Vurderingselement from './Vurderingselement';

export class Vurderingsoversikt {
    vurderingselementer: Vurderingselement[];

    resterendeVurderingsperioder: Period[];

    resterendeValgfrieVurderingsperioder: Period[];

    søknadsperioderTilBehandling: Period[];

    perioderSomKanVurderes: Period[];

    links: Link[];

    pleietrengendesFødselsdato: string;

    harPerioderDerPleietrengendeErOver18år: boolean;

    constructor(data: Partial<Vurderingsoversikt>) {
        try {
            this.perioderSomKanVurderes = data.perioderSomKanVurderes.map(({ fom, tom }) => new Period(fom, tom));
            this.resterendeVurderingsperioder = data.resterendeVurderingsperioder.map(
                ({ fom, tom }) => new Period(fom, tom)
            );
            this.resterendeValgfrieVurderingsperioder = data.resterendeValgfrieVurderingsperioder.map(
                ({ fom, tom }) => new Period(fom, tom)
            );
            this.søknadsperioderTilBehandling = data.søknadsperioderTilBehandling.map(
                ({ fom, tom }) => new Period(fom, tom)
            );
            this.vurderingselementer = data.vurderingselementer.map((vurderingselement) => ({
                ...vurderingselement,
                periode: new Period(vurderingselement.periode.fom, vurderingselement.periode.tom),
            }));
            this.links = data.links;
            this.pleietrengendesFødselsdato = data.pleietrengendesFødselsdato;
            this.harPerioderDerPleietrengendeErOver18år = data.harPerioderDerPleietrengendeErOver18år;
        } catch (error) {
            throw new Error(`Processing Vurderingsoversikt\n${error}`);
        }
    }

    harPerioderÅVise(): boolean {
        return (
            this.harPerioderSomSkalVurderes() === true ||
            this.harVurdertePerioder() === true ||
            this.harValgfriePerioderSomKanVurderes() === true
        );
    }

    harIngenPerioderÅVise(): boolean {
        return (
            this.harPerioderSomSkalVurderes() === false &&
            this.harVurdertePerioder() === false &&
            this.harValgfriePerioderSomKanVurderes() === false
        );
    }

    harPerioderSomSkalVurderes(): boolean {
        return this.resterendeVurderingsperioder && this.resterendeVurderingsperioder.length > 0;
    }

    harValgfriePerioderSomKanVurderes(): boolean {
        return this.resterendeValgfrieVurderingsperioder && this.resterendeValgfrieVurderingsperioder.length > 0;
    }

    harVurdertePerioder(): boolean {
        return this.vurderingselementer && this.vurderingselementer.length > 0;
    }

    finnVurderingsperioderSomOverlapperMedNyeSøknadsperioder(): Period[] {
        return (
            this.vurderingselementer
                .filter(({ periode }) => {
                    const vurdertPeriode = new Period(periode.fom, periode.tom);
                    const overlapperMedEnSøknadsperiode = this.resterendeVurderingsperioder.some(({ fom, tom }) =>
                        vurdertPeriode.overlapsWith(new Period(fom, tom))
                    );
                    return overlapperMedEnSøknadsperiode;
                })
                .map(({ periode }) => periode) || []
        );
    }
}

export default Vurderingsoversikt;
