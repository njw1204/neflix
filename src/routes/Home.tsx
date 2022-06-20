import { useQuery } from "react-query";
import {
  getMovieDetail,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  Movie,
} from "../apis/movie";
import Slider from "../components/Slider";
import Loader from "../components/Loader";
import Banner from "../components/Banner";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import VideoModal from "../components/VideoModal";
import Wrapper from "../components/Wrapper";
import { MainShowcaseContainer } from "../components/ShowcaseContainer";

interface MovieDetailRouteState {
  movie?: Movie;
  layoutId?: string;
}

function Home() {
  const navigate = useNavigate();
  const location = useLocation() as { state: MovieDetailRouteState };
  // const locationStateMovie = location.state?.movie ?? undefined;
  const locationStateLayoutId = location.state?.layoutId ?? undefined;
  const movieDetailRouteMatch = useMatch("/movie/:movieId");

  const {
    data: nowPlayingMoviesSearchResult,
    isLoading: isLoadingNowPlayingMovies,
  } = useQuery(["movies", "nowPlaying"], getNowPlayingMovies, {
    refetchOnWindowFocus: false,
  });
  const { data: popularMoviesSearchResult, isLoading: isLoadingPopularMovies } =
    useQuery(["movies", "popular"], getPopularMovies, {
      refetchOnWindowFocus: false,
    });
  const {
    data: topRatedMoviesSearchResult,
    isLoading: isLoadingTopRatedMovies,
  } = useQuery(["movies", "topRated"], getTopRatedMovies, {
    refetchOnWindowFocus: false,
  });
  const {
    data: upcomingMoviesSearchResult,
    isLoading: isLoadingUpcomingMovies,
  } = useQuery(["movies", "upcoming"], getUpcomingMovies, {
    refetchOnWindowFocus: false,
  });
  const { data: movieDetail } = useQuery(
    ["movie", movieDetailRouteMatch?.params.movieId],
    () => getMovieDetail(movieDetailRouteMatch?.params.movieId || ""),
    {
      refetchOnWindowFocus: false,
    }
  );

  const isLoading =
    isLoadingNowPlayingMovies ||
    isLoadingPopularMovies ||
    isLoadingTopRatedMovies ||
    isLoadingUpcomingMovies ||
    false;
  const featuredMovie = nowPlayingMoviesSearchResult?.results[0];
  const nowPlayingMovies = nowPlayingMoviesSearchResult?.results.slice(1);

  const navigateToMovieDetailRoute = (movie: Movie, layoutId: string) => {
    const state: MovieDetailRouteState = { movie, layoutId };
    navigate(`movie/${movie.id}`, { state });
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Now Loading...</Loader>
      ) : (
        <>
          {featuredMovie ? <Banner movie={featuredMovie} /> : null}
          <MainShowcaseContainer>
            <Slider
              id="nowplayingmovies"
              title="Now Playing"
              data={nowPlayingMovies ?? []}
              pageOffset={6}
              onClick={navigateToMovieDetailRoute}
            />
            <Slider
              id="popularmovies"
              title="Popular Movies"
              data={popularMoviesSearchResult?.results ?? []}
              pageOffset={6}
              onClick={navigateToMovieDetailRoute}
            />
            <Slider
              id="topratedmovies"
              title="Top Rated Movies"
              data={topRatedMoviesSearchResult?.results ?? []}
              pageOffset={6}
              onClick={navigateToMovieDetailRoute}
            />
            <Slider
              id="upcomingmovies"
              title="Upcoming Movies"
              data={upcomingMoviesSearchResult?.results ?? []}
              pageOffset={6}
              onClick={navigateToMovieDetailRoute}
            />
          </MainShowcaseContainer>
          <VideoModal
            onRequestClose={() => navigate("/")}
            data={movieDetail ?? undefined}
            layoutId={locationStateLayoutId}
            show={Boolean(movieDetailRouteMatch?.params.movieId)}
          />
        </>
      )}
    </Wrapper>
  );
}

export default Home;
