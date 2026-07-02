import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { IGlobalState, IGlobalStore } from "./IGlobalStore";

const initialState: IGlobalState = {
  loading: false,
};

const useGlobalStore = create<IGlobalStore>()(
  devtools(
    (set) => ({
      ...initialState,
      setState: (
        type: keyof IGlobalState,
        value: IGlobalState[keyof IGlobalState]
      ) => set({ [type]: value }, false, `global-set-state-${type}`),
      resetState: (
        type: keyof IGlobalState,
        value?: IGlobalState[keyof IGlobalState]
      ) => {
        set(
          {
            [type]:
              initialState[type as keyof IGlobalState] || value || undefined,
          },
          false,
          `global-reset-state-${type}`
        );
      },
    }),
    {
      name: "global-store",
    }
  )
);

export default useGlobalStore;
