export interface IGlobalState {
  loading: boolean;
}

export interface IGlobalStore extends IGlobalState {
  setState(
    type: keyof IGlobalState,
    value: IGlobalState[keyof IGlobalState]
  ): void;
  resetState(
    type: keyof IGlobalState,
    value?: IGlobalState[keyof IGlobalState]
  ): void;
}
