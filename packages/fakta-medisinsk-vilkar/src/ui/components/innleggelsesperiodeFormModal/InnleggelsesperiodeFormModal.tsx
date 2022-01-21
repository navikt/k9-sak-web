import { Period } from '@navikt/k9-period-utils';
import { Box, Form, Margin } from '@navikt/k9-react-components';
import { PeriodpickerList } from '@navikt/k9-form-utils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { InnleggelsesperiodeDryRunResponse } from '../../../api/api';
import AddButton from '../add-button/AddButton';
import DeleteButton from '../delete-button/DeleteButton';
import { FieldName } from '../innleggelsesperiodeoversikt/Innleggelsesperiodeoversikt';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import styles from './innleggelsesperiodeFormModal.less';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

interface InnleggelsesperiodeFormModal {
    defaultValues: {
        [FieldName.INNLEGGELSESPERIODER]: Period[];
    };
    setModalIsOpen: (isOpen: boolean) => void;
    onSubmit: (formState) => void;
    isLoading: boolean;
    endringerPåvirkerAndreBehandlinger: (innleggelsesperioder: Period[]) => Promise<InnleggelsesperiodeDryRunResponse>;
}

const InnleggelsesperiodeFormModal = ({
    defaultValues,
    setModalIsOpen,
    onSubmit,
    isLoading,
    endringerPåvirkerAndreBehandlinger,
}: InnleggelsesperiodeFormModal): JSX.Element => {
    const formMethods = useForm({
        defaultValues,
    });

    const {
        formState: { isDirty },
        getValues,
    } = formMethods;

    const [showWarningMessage, setShowWarningMessage] = React.useState(false);

    const handleSubmit = (formState) => {
        onSubmit(formState);
        setModalIsOpen(false);
        setShowWarningMessage(false);
    };

    const handleCloseModal = () => {
        // eslint-disable-next-line no-alert
        if ((isDirty && window.confirm('Du vil miste alle endringer du har gjort')) || !isDirty) {
            setModalIsOpen(false);
            setShowWarningMessage(false);
        }
    };

    return (
        <Modal
            isOpen
            closeButton
            onRequestClose={handleCloseModal}
            contentLabel="Legg til innleggelsesperiode"
            className={styles.innleggelsesperiodeFormModal}
        >
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <FormProvider {...formMethods}>
                <Form onSubmit={formMethods.handleSubmit(handleSubmit)} shouldShowSubmitButton={false}>
                    <ModalFormWrapper title="Innleggelsesperioder">
                        <Box marginTop={Margin.large}>
                            <PeriodpickerList
                                name="innleggelsesperioder"
                                legend="Innleggelsesperioder"
                                fromDatepickerProps={{
                                    ariaLabel: 'Fra',
                                    calendarSettings: { position: 'fullscreen' },
                                }}
                                toDatepickerProps={{
                                    ariaLabel: 'Til',
                                    calendarSettings: { position: 'fullscreen' },
                                }}
                                afterOnChange={() => {
                                    const initialiserteInnleggelsesperioder = getValues().innleggelsesperioder.map(
                                        ({ period }: AnyType) => new Period(period.fom, period.tom)
                                    );
                                    const erAllePerioderGyldige = initialiserteInnleggelsesperioder.every((periode) =>
                                        periode.isValid()
                                    );
                                    if (erAllePerioderGyldige) {
                                        endringerPåvirkerAndreBehandlinger(initialiserteInnleggelsesperioder).then(
                                            ({ førerTilRevurdering }) => setShowWarningMessage(førerTilRevurdering)
                                        );
                                    }
                                }}
                                defaultValues={defaultValues[FieldName.INNLEGGELSESPERIODER] || []}
                                validators={{
                                    overlaps: (periodValue: Period) => {
                                        const innleggelsesperioderFormValue = getValues()
                                            .innleggelsesperioder.filter(
                                                (periodWrapper: AnyType) => periodWrapper.period !== periodValue
                                            )
                                            .map(({ period }: AnyType) => new Period(period.fom, period.tom));
                                        const { fom, tom } = periodValue;
                                        const period = new Period(fom, tom);
                                        if (period.overlapsWithSomePeriodInList(innleggelsesperioderFormValue)) {
                                            return 'Innleggelsesperiodene kan ikke overlappe';
                                        }
                                        return null;
                                    },
                                    hasEmptyPeriodInputs: (periodValue: Period) => {
                                        const { fom, tom } = periodValue;
                                        if (!fom) {
                                            return 'Fra-dato er påkrevd';
                                        }
                                        if (!tom) {
                                            return 'Til-dato er påkrevd';
                                        }
                                        return null;
                                    },
                                    fomIsBeforeOrSameAsTom: (periodValue: Period) => {
                                        const { fom, tom } = periodValue;
                                        const period = new Period(fom, tom);

                                        if (period.fomIsBeforeOrSameAsTom() === false) {
                                            return 'Fra-dato må være tidligere eller samme som til-dato';
                                        }
                                        return null;
                                    },
                                }}
                                renderBeforeFieldArray={(fieldArrayMethods) => (
                                    <>
                                        <Box marginTop={Margin.large} marginBottom={Margin.medium}>
                                            <AddButton
                                                label="Legg til innleggelsesperiode"
                                                onClick={() => fieldArrayMethods.append({ fom: '', tom: '' })}
                                                id="leggTilInnleggelsesperiodeKnapp"
                                            />
                                        </Box>
                                        <Box marginTop={Margin.medium}>
                                            <div className={styles.innleggelsesperiodeFormModal__pickerLabels}>
                                                <Element
                                                    className={styles.innleggelsesperiodeFormModal__firstLabel}
                                                    aria-hidden
                                                >
                                                    Fra
                                                </Element>
                                                <Element aria-hidden>Til</Element>
                                            </div>
                                        </Box>
                                    </>
                                )}
                                renderContentAfterElement={(index, numberOfItems, fieldArrayMethods) => (
                                    <DeleteButton onClick={() => fieldArrayMethods.remove(index)} />
                                )}
                            />
                            {showWarningMessage && (
                                <Box marginTop={Margin.large}>
                                    <AlertStripeAdvarsel>
                                        Endringene du har gjort på innleggelsesperiodene vil føre til en ny revurdering
                                        av en annen behandling. Påvirker alle søkere.
                                    </AlertStripeAdvarsel>
                                </Box>
                            )}
                        </Box>
                        <Box marginTop={Margin.xLarge}>
                            <div style={{ display: 'flex' }}>
                                <Hovedknapp spinner={isLoading} disabled={isLoading} autoDisableVedSpinner mini>
                                    Bekreft
                                </Hovedknapp>
                                <Knapp
                                    mini
                                    style={{ marginLeft: '1rem' }}
                                    htmlType="button"
                                    onClick={handleCloseModal}
                                    disabled={isLoading}
                                >
                                    Avbryt
                                </Knapp>
                            </div>
                        </Box>
                    </ModalFormWrapper>
                </Form>
            </FormProvider>
        </Modal>
    );
};
export default InnleggelsesperiodeFormModal;
