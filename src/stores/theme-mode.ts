import { atom, selector } from "recoil";
import { DefaultTheme } from "styled-components";
import { lightTheme, theme } from "../styles/theme";

export const themeIdState = atom<DefaultTheme["id"]>({
  key: "themeId",
  default: theme.id,
});

export const themeSelector = selector({
  key: "theme",
  get: ({ get }) => {
    const themeId = get(themeIdState);

    if (themeId === lightTheme.id) {
      return lightTheme;
    } else {
      return theme;
    }
  },
});
