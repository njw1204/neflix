import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    id: "default" | "light";
    accentColor: string;
    darkColor: {
      darkest: string;
      darker: string;
      lighter: string;
    };
    lightColor: {
      darkest: string;
      darker: string;
      lighter: string;
    };
    black: string;
    white: string;
  }
}
