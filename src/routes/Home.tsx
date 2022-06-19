import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../apis/movie";
import Slider from "../components/Slider";
import Loader from "../components/Loader";
import Banner from "../components/Banner";

const Wrapper = styled.div`
  padding-bottom: 200px;
  overflow-x: hidden;
`;

const HomeSliderContainer = styled.div`
  position: relative;
  top: -125px;
  margin-bottom: -125px;

  & > * {
    margin-top: 54px;

    &:first-child {
      margin-top: 0;
    }
  }
`;

function Home() {
  const {
    data: nowPlayingMoviesSearchResult,
    isLoading: isLoadingNowPlayingMovies,
  } = useQuery(["movies", "nowPlaying"], getMovies);
  const { data: popularMoviesSearchResult, isLoading: isLoadingPopularMovies } =
    useQuery(["movies", "popular"], getPopularMovies);
  const {
    data: topRatedMoviesSearchResult,
    isLoading: isLoadingTopRatedMovies,
  } = useQuery(["movies", "topRated"], getTopRatedMovies);
  const {
    data: upcomingMoviesSearchResult,
    isLoading: isLoadingUpcomingMovies,
  } = useQuery(["movies", "upcoming"], getUpcomingMovies);
  const isLoading =
    isLoadingNowPlayingMovies ||
    isLoadingPopularMovies ||
    isLoadingTopRatedMovies ||
    isLoadingUpcomingMovies ||
    false;
  const featuredMovie = nowPlayingMoviesSearchResult?.results[0];
  const nowPlayingMovies = nowPlayingMoviesSearchResult?.results.slice(1);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Now Loading...</Loader>
      ) : (
        <>
          {featuredMovie ? <Banner movie={featuredMovie} /> : null}
          <HomeSliderContainer>
            <Slider
              title="Now Playing Movies"
              data={nowPlayingMovies ?? []}
              pageOffset={6}
            />
            <Slider
              title="Popular Movies"
              data={popularMoviesSearchResult?.results ?? []}
              pageOffset={6}
            />
            <Slider
              title="Top Rated Movies"
              data={topRatedMoviesSearchResult?.results ?? []}
              pageOffset={6}
            />
            <Slider
              title="Upcoming Movies"
              data={upcomingMoviesSearchResult?.results ?? []}
              pageOffset={6}
            />
          </HomeSliderContainer>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
