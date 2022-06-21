import { useQuery } from "react-query";
import {
  useLocation,
  useMatch,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import styled from "styled-components";
import {
  getMovieDetail,
  Movie,
  searchMovies,
  searchTvs,
  getTvDetail,
} from "../apis/movie";
import Loader from "../components/Loader";
import { SearchShowcaseContainer } from "../components/ShowcaseContainer";
import Slider from "../components/Slider";
import VideoModal from "../components/VideoModal";
import Wrapper from "../components/Wrapper";
import { chunkArrayInGroups } from "../utils/common-util";

const SearchTitle = styled.h2`
  margin-top: 60px;
  padding: 30px 50px;
  color: ${(props) => props.theme.lightColor.darkest};
  font-size: 18px;
  font-weight: normal;
`;

const SearchKeyword = styled.span`
  display: inline-block;
  margin-left: 12px;
  color: ${(props) => props.theme.lightColor.lighter};
  font-weight: bold;
`;

const NoData = styled.div`
  padding: 0 50px;
  font-size: 18px;
`;

interface SearchDetailRouteState {
  search?: Movie;
  layoutId?: string;
}

function Search() {
  const navigate = useNavigate();
  const location = useLocation() as { state: SearchDetailRouteState };
  // const locationStateSearch = location.state?.search ?? undefined;
  const locationStateLayoutId = location.state?.layoutId ?? undefined;
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const searchMovieDetailRouteMatch = useMatch("/search/movie/:id");
  const searchTvDetailRouteMatch = useMatch("/search/tv/:id");

  const {
    data: searchingMoviesSearchResult,
    isLoading: isLoadingSearchingMovies,
  } = useQuery(["search", "movies", keyword], () => searchMovies(keyword), {
    refetchOnWindowFocus: false,
  });
  const { data: searchingTvsSearchResult, isLoading: isLoadingSearchingTvs } =
    useQuery(["search", "tvs", keyword], () => searchTvs(keyword), {
      refetchOnWindowFocus: false,
    });
  const { data: movieDetail } = useQuery(
    ["movie", searchMovieDetailRouteMatch?.params.id],
    () => getMovieDetail(searchMovieDetailRouteMatch?.params.id || ""),
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: tvDetail } = useQuery(
    ["tv", searchTvDetailRouteMatch?.params.id],
    () => getTvDetail(searchTvDetailRouteMatch?.params.id || ""),
    {
      refetchOnWindowFocus: false,
    }
  );

  const isLoading = isLoadingSearchingMovies || isLoadingSearchingTvs || false;
  const searchCount =
    (Number(searchingMoviesSearchResult?.results.length) || 0) +
    (Number(searchingTvsSearchResult?.results.length) || 0);

  const navigateToSearchDetailRoute = (search: Movie, layoutId: string) => {
    const state: SearchDetailRouteState = { search, layoutId };

    if (search.is_tv) {
      navigate(`tv/${search.id}?keyword=${encodeURIComponent(keyword)}`, {
        state,
      });
    } else {
      navigate(`movie/${search.id}?keyword=${encodeURIComponent(keyword)}`, {
        state,
      });
    }
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Now Loading...</Loader>
      ) : (
        <>
          <SearchTitle>
            <span>검색 결과:</span>
            <SearchKeyword>
              {keyword} ({searchCount}건)
            </SearchKeyword>
          </SearchTitle>
          <SearchShowcaseContainer>
            {searchCount < 1 ? (
              <NoData>입력하신 검색어와 일치하는 결과가 없습니다. 😢</NoData>
            ) : null}
            {Number(searchingMoviesSearchResult?.results.length)
              ? chunkArrayInGroups(
                  searchingMoviesSearchResult?.results ?? [],
                  6
                ).map((chunk, index) => (
                  <Slider
                    key={index}
                    id="searchmovies"
                    title={index === 0 ? "Movies" : undefined}
                    data={chunk}
                    pageOffset={6}
                    onClick={navigateToSearchDetailRoute}
                  />
                ))
              : null}
            <br />
            {Number(searchingTvsSearchResult?.results.length)
              ? chunkArrayInGroups(
                  searchingTvsSearchResult?.results ?? [],
                  6
                ).map((chunk, index) => (
                  <Slider
                    key={index}
                    id="searchseries"
                    title={index === 0 ? "Series" : undefined}
                    data={chunk}
                    pageOffset={6}
                    onClick={navigateToSearchDetailRoute}
                  />
                ))
              : null}
          </SearchShowcaseContainer>
          <VideoModal
            onRequestClose={() =>
              navigate(`/search?keyword=${encodeURIComponent(keyword)}`)
            }
            data={
              (searchMovieDetailRouteMatch ? movieDetail : tvDetail) ??
              undefined
            }
            layoutId={locationStateLayoutId}
            show={
              Boolean(searchMovieDetailRouteMatch?.params.id) ||
              Boolean(searchTvDetailRouteMatch?.params.id)
            }
          />
        </>
      )}
    </Wrapper>
  );
}

export default Search;
