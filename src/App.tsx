import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled, { ThemeProvider } from "styled-components";
import Header from "./components/Header";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Tv from "./routes/Tv";
import { themeSelector } from "./stores/theme-mode";
import GlobalStyle from "./styles/global";

const Container = styled.div`
  margin-bottom: 10px;
`;

function App() {
  const theme = useRecoilValue(themeSelector);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="movie/:movieId" element={<div>Movie</div>} />
            </Route>
            <Route path="/tv" element={<Tv />}>
              <Route path=":tvId" element={<div>Tv</div>} />
            </Route>
            <Route path="/search" element={<Search />}>
              <Route path="movie/:id" element={<div>Search Movie</div>} />
              <Route path="tv/:id" element={<div>Search Tv</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
