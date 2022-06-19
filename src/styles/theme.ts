import { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  id: "default",
  accentColor: "#e51013",
  darkColor: {
    darkest: "#141414",
    darker: "#181818",
    lighter: "#2f2f2f",
  },
  lightColor: {
    darkest: "#b3b3b3",
    darker: "#e5e5e5",
    lighter: "#f5f6fa",
  },
  black: "#000000",
  white: "#ffffff",
};

export const lightTheme: DefaultTheme = {
  id: "light",
  accentColor: "#e51013",
  darkColor: {
    darkest: "#f5f6fa",
    darker: "#e5e5e5",
    lighter: "#b3b3b3",
  },
  lightColor: {
    darkest: "#2f2f2f",
    darker: "#181818",
    lighter: "#141414",
  },
  black: "#ffffff",
  white: "#000000",
};
