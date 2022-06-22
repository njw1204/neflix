import { useQuery } from "react-query";
import Slider from "../components/Slider";
import Loader from "../components/Loader";
import Banner from "../components/Banner";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import VideoModal from "../components/VideoModal";
import Wrapper from "../components/Wrapper";
import { MainShowcaseContainer } from "../components/ShowcaseContainer";
import {
  getAiringTodayTvs,
  getOnTheAirTvs,
  getPopularTvs,
  getTopRatedTvs,
  getTvDetail,
  Movie,
} from "../apis/movie";
import { useCallback, useMemo } from "react";

interface TvDetailRouteState {
  tv?: Movie;
  layoutId?: string;
}

function Tv() {
  const navigate = useNavigate();
  const location = useLocation() as { state: TvDetailRouteState };
  // const locationStateTv = location.state?.tv ?? undefined;
  const locationStateLayoutId = location.state?.layoutId ?? undefined;
  const tvDetailRouteMatch = useMatch("/tv/:tvId");

  const { data: onTheAirTvsSearchResult, isLoading: isLoadingOnTheAirTvs } =
    useQuery(["tvs", "onTheAir"], getOnTheAirTvs, {
      refetchOnWindowFocus: false,
    });
  const {
    data: airingTodayTvsSearchResult,
    isLoading: isLoadingAiringTodayTvs,
  } = useQuery(["tvs", "airingToday"], getAiringTodayTvs, {
    refetchOnWindowFocus: false,
  });
  const { data: popularTvsSearchResult, isLoading: isLoadingPopularTvs } =
    useQuery(["tvs", "popular"], getPopularTvs, {
      refetchOnWindowFocus: false,
    });
  const { data: topRatedTvsSearchResult, isLoading: isLoadingTopRatedTvs } =
    useQuery(["tvs", "topRated"], getTopRatedTvs, {
      refetchOnWindowFocus: false,
    });
  const { data: tvDetail } = useQuery(
    ["tv", tvDetailRouteMatch?.params.tvId],
    () => getTvDetail(tvDetailRouteMatch?.params.tvId || ""),
    {
      refetchOnWindowFocus: false,
    }
  );

  const isLoading =
    isLoadingOnTheAirTvs ||
    isLoadingAiringTodayTvs ||
    isLoadingPopularTvs ||
    isLoadingTopRatedTvs ||
    false;
  const featuredTv = onTheAirTvsSearchResult?.results[0];
  const onTheAirTvs = useMemo(
    () => onTheAirTvsSearchResult?.results.slice(1),
    [onTheAirTvsSearchResult?.results]
  );

  const navigateToTvDetailRoute = useCallback(
    (tv: Movie, layoutId: string) => {
      const state: TvDetailRouteState = { tv, layoutId };
      navigate(`${tv.id}`, { state });
    },
    [navigate]
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Now Loading...</Loader>
      ) : (
        <>
          {featuredTv ? <Banner movie={featuredTv} /> : null}
          <MainShowcaseContainer>
            <Slider
              id="ontheairtvs"
              title="On The Air"
              data={onTheAirTvs ?? []}
              pageOffset={6}
              onClick={navigateToTvDetailRoute}
            />
            <Slider
              id="airingtodaytvs"
              title="Airing Today"
              data={airingTodayTvsSearchResult?.results ?? []}
              pageOffset={6}
              onClick={navigateToTvDetailRoute}
            />
            <Slider
              id="populartvs"
              title="Popular Series"
              data={popularTvsSearchResult?.results ?? []}
              pageOffset={6}
              onClick={navigateToTvDetailRoute}
            />
            <Slider
              id="topratedtvs"
              title="Top Rated Series"
              data={topRatedTvsSearchResult?.results ?? []}
              pageOffset={6}
              onClick={navigateToTvDetailRoute}
            />
          </MainShowcaseContainer>
          <VideoModal
            onRequestClose={() => navigate("/tv")}
            data={tvDetail ?? undefined}
            layoutId={locationStateLayoutId}
            show={Boolean(tvDetailRouteMatch?.params.tvId)}
          />
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
