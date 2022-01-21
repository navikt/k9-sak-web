import { post } from '@navikt/k9-http-utils';
import { Period } from '@navikt/k9-period-utils';
import { CancelToken } from 'axios';
import { Vurderingsversjon } from '../types/Vurdering';
import Vurderingstype from '../types/Vurderingstype';
import { PerioderMedEndringResponse } from '../types/PeriodeMedEndring';
import { RequestPayload } from '../types/RequestPayload';
import { HttpErrorHandler } from '../types/HttpErrorHandler';

type VurderingsversjonMedType = Partial<Vurderingsversjon> & {
    type: Vurderingstype;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

export async function postNyVurdering(
    href: string,
    behandlingUuid: string,
    vurderingsversjonMedType: VurderingsversjonMedType,
    httpErrorHandler: HttpErrorHandler,
    cancelToken?: CancelToken,
    dryRun?: boolean
): Promise<AnyType> {
    try {
        const { perioder, resultat, tekst, dokumenter, type } = vurderingsversjonMedType;
        return post(
            href,
            {
                behandlingUuid,
                type,
                perioder,
                resultat,
                tekst,
                tilknyttedeDokumenter: dokumenter.map((dokument) => dokument.id),
                dryRun: dryRun || false,
            },
            httpErrorHandler,
            { cancelToken }
        );
    } catch (error) {
        throw new Error(error);
    }
}

export async function postNyVurderingDryRun(
    href: string,
    behandlingUuid: string,
    vurderingsversjonMedType: VurderingsversjonMedType,
    httpErrorHandler: HttpErrorHandler,
    cancelToken?: CancelToken
): Promise<PerioderMedEndringResponse> {
    return postNyVurdering(href, behandlingUuid, vurderingsversjonMedType, httpErrorHandler, cancelToken, true);
}

export async function postEndreVurdering(
    href: string,
    behandlingUuid: string,
    vurderingsid: string,
    vurderingsversjon: Partial<Vurderingsversjon>,
    httpErrorHandler: HttpErrorHandler,
    cancelToken?: CancelToken,
    dryRun?: boolean
): Promise<AnyType> {
    try {
        const { perioder, resultat, tekst, dokumenter, versjon } = vurderingsversjon;
        return post(
            href,
            {
                behandlingUuid,
                id: vurderingsid,
                versjon,
                tekst,
                resultat,
                perioder,
                tilknyttedeDokumenter: dokumenter.map((dokument) => dokument.id),
                dryRun: dryRun || false,
            },
            httpErrorHandler,
            { cancelToken }
        );
    } catch (error) {
        throw new Error(error);
    }
}

export async function postEndreVurderingDryRun(
    href: string,
    behandlingUuid: string,
    vurderingsid: string,
    vurderingsversjon: Vurderingsversjon,
    httpErrorHandler: HttpErrorHandler,
    cancelToken?: CancelToken
): Promise<PerioderMedEndringResponse> {
    return postEndreVurdering(
        href,
        behandlingUuid,
        vurderingsid,
        vurderingsversjon,
        httpErrorHandler,
        cancelToken,
        true
    );
}

interface InnleggelsesperioderRequestBody extends RequestPayload {
    perioder: Period[];
}

export interface InnleggelsesperiodeDryRunResponse {
    førerTilRevurdering: boolean;
}

export async function postInnleggelsesperioder(
    href: string,
    body: InnleggelsesperioderRequestBody,
    httpErrorHandler: HttpErrorHandler,
    cancelToken?: CancelToken,
    dryRun?: boolean
): Promise<AnyType> {
    return post(href, { ...body, dryRun: dryRun || false }, httpErrorHandler, { cancelToken });
}

export async function postInnleggelsesperioderDryRun(
    href: string,
    body: InnleggelsesperioderRequestBody,
    httpErrorHandler: HttpErrorHandler,
    cancelToken?: CancelToken
): Promise<InnleggelsesperiodeDryRunResponse> {
    return postInnleggelsesperioder(href, body, httpErrorHandler, cancelToken, true);
}