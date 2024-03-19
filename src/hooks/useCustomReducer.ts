import { useReducer } from "react";

export default function useCustomReducer<S>(initialState: S) {
  const reducer = (
    state: S,
    action: { type: "set" | "reset"; payload: S },
  ): S => {
    switch (action.type) {
      case "set":
        return { ...state, ...action.payload };
      case "reset":
        return { ...action.payload, ...initialState };
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  return { state, dispatch };
}
