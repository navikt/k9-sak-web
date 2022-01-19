import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestAksjonspunkter } from "../slice";
import { ReduxState } from "../../rootReducer";

export const useAksjonspunkter = () => {
    const dispatch = useDispatch();

    const { aksjonspunkter, error, loading } = useSelector(
        (state: ReduxState) => state.aksjonspunkter,
    );

    useEffect(() => {
        if (aksjonspunkter.length < 1) {
            dispatch(requestAksjonspunkter());
        }
    }, []);

    return { aksjonspunkter, error, loading };
}

export default useAksjonspunkter;
