import { atom, selector } from "recoil";
import { DefaultTheme } from "styled-components";
import { lightTheme, theme } from "../styles/theme";

function getLocalStorageThemeId(): DefaultTheme["id"] | null {
  try {
    const id = window.localStorage.getItem("neflixThemeId") || null;

    if (id === "default" || id === "light") {
      return id;
    }
  } catch (e) {
    console.log(e);
  }

  return null;
}

export const themeIdState = atom<DefaultTheme["id"]>({
  key: "themeId",
  default: getLocalStorageThemeId() || theme.id,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        try {
          window.localStorage.setItem("neflixThemeId", newValue);
        } catch (e) {
          console.log(e);
        }
      });
    },
  ],
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
