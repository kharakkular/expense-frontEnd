import { useCallback, useReducer } from "react";

const httpReducer = (state, action) => {
    if(action.type === 'SEND'){
        return {
            data: null,
            error: null,
            status: 'pending'
        };
    }
    if(action.type === 'SUCCESS'){
        return {
            data: action.responseData,
            error: null,
            status: 'completed'
        };
    }
    if(action.type === 'ERROR'){
        return {
            data: null,
            error: action.errorMessage,
            status: 'completed'
        };
    }
    
    return state;
};

const useHttp = (requestFunction, startWithPending = false) => {

    const [httpState, dispatch] = useReducer(httpReducer, {
        data: null,
        error: null,
        status: startWithPending ? 'pending' : null
    });

    const sendRequest = useCallback(async (requestData) => {
        dispatch({ type: "SEND"});
        try {
            const responseData = await requestFunction(requestData);
            console.log('Response data from useHttp.js is ', {responseData});
            dispatch({ type: "SUCCESS", responseData });
        } catch (error) {
            dispatch({ type: "ERROR", errorMessage: error.message || 'Something went wrong' });
        }
    }, [requestFunction]);

    return {
        sendRequest, ...httpState
    };
}

export default useHttp;