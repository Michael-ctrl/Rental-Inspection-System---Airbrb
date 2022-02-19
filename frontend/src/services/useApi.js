import { useReducer } from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case "IN_PROGRESS":
      return {
        ...state,
        inProgress: true,
        error: null,
      };
    case "SUCCESS":
      return {
        ...state,
        inProgress: false,
        error: null,
        data: action.data,
      };
    case "ERROR":
      return {
        ...state,
        inProgress: false,
        error: action.data,
      };
    default:
      return {
        ...state,
        inProgress: false,
        error: "Dispatch Error",
      };
  }
};

function useAPI(func, initialState = {}) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    inProgress: false,
    error: null,
    data: null,
  });

  const makeRequest = async (params) => {
    dispatch({ type: "IN_PROGRESS" });
    try {
      const result = await func(params);
      dispatch({ type: "SUCCESS", data: result });
    } catch (e) {
      console.log("error is", e);
      dispatch({ type: "ERROR", data: e.toString() });
    }
  };

  return [state, makeRequest];
}

export default useAPI;
