import ActionType from '../actionTypes';
import vilkårsvurderingReducer from '../reducer';

describe('vilkårsvurderingReducer', () => {
    const vurderingsoversikt = {} as any;

    let state = {} as any;

    describe('when showing vurderingsoversikt', () => {
        beforeAll(() => {
            state = vilkårsvurderingReducer(state, { type: ActionType.VIS_VURDERINGSOVERSIKT, vurderingsoversikt });
        });

        it('should put the specified new vurderingsoversikt on state', () => {
            expect(state.vurderingsoversikt).toEqual(vurderingsoversikt);
        });

        it('should set isLoading to false', () => {
            expect(state.isLoading).toBe(false);
        });

        it('should set visVurderingDetails to false', () => {
            expect(state.visVurderingDetails).toBe(false);
        });

        it('should set skalViseRadForNyVurdering to false', () => {
            expect(state.skalViseRadForNyVurdering).toBe(false);
        });

        it('should set visVurderingsoversiktFeilet to false', () => {
            expect(state.vurderingsoversiktFeilet).toBe(false);
        });
    });

    describe('when vurderingsoversikt has failed', () => {
        beforeAll(() => {
            state = vilkårsvurderingReducer(state, { type: ActionType.VURDERINGSOVERSIKT_FEILET });
        });

        it('should set vurderingsoversiktFeilet to true', () => {
            expect(state.vurderingsoversiktFeilet).toBe(true);
        });

        it('should set isLoading to false', () => {
            expect(state.isLoading).toBe(false);
        });
    });

    describe('when showing ny vurdering form', () => {
        beforeAll(() => {
            state = vilkårsvurderingReducer(state, { type: ActionType.VIS_NY_VURDERING_FORM });
        });

        it('should reset any previously selected vurderingselement on state', () => {
            expect(state.valgtVurderingselement).toBe(null);
        });

        it('should set isLoading to false', () => {
            expect(state.isLoading).toBe(false);
        });

        it('should set skalViseRadForNyVurdering to true when there are no periods in resterendeVurderingsperioder', () => {
            expect(state.skalViseRadForNyVurdering).toBe(true);
        });

        describe('when there are periods in resterendeVurderingsperioder', () => {
            const anotherState = vilkårsvurderingReducer(state, {
                type: ActionType.VIS_NY_VURDERING_FORM,
                resterendeVurderingsperioder: [{} as any],
            });

            it('should set skalViseRadForNyVurdering to false', () => {
                expect(anotherState.skalViseRadForNyVurdering).toBe(false);
            });
        });
    });

    describe('when pending', () => {
        beforeAll(() => {
            state = vilkårsvurderingReducer(state, { type: ActionType.PENDING });
        });

        it('should set isLoading to true', () => {
            expect(state.isLoading).toBe(true);
        });

        it('should set vurderingsoversiktFeilet to false', () => {
            expect(state.vurderingsoversiktFeilet).toBe(false);
        });
    });

    describe('when cancelling in form', () => {
        beforeAll(() => {
            state = vilkårsvurderingReducer(state, { type: ActionType.AVBRYT_FORM });
        });

        it('should set visVurderingDetails to false', () => {
            expect(state.isLoading).toBe(true);
        });

        it('should reset any previously selected vurderingselement on state', () => {
            expect(state.valgtVurderingselement).toBe(null);
        });

        it('should set skalViseRadForNyVurdering to false', () => {
            expect(state.skalViseRadForNyVurdering).toBe(false);
        });
    });
});
