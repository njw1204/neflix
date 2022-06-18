import { createGlobalStyle } from "styled-components";
import sanitize from "styled-sanitize";

const GlobalStyle = createGlobalStyle`
  ${sanitize}

  body {
    min-width: 720px;
    font-family: 'Source Sans Pro', sans-serif;
    color: ${(props) => props.theme.lightColor.lighter};
    background-color: ${(props) => props.theme.darkColor.darkest};
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyle;
