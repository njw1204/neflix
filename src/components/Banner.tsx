import { rgba, lighten } from "polished";
import styled from "styled-components";
import { getImageFullUrl, Movie } from "../apis/movie";

const BannerContainer = styled.div<{ coverImage?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 70px 50px;
  height: 100vh;
  min-height: 720px;
  background-image: linear-gradient(
      77deg,
      ${(props) => rgba(props.theme.black, 0.8)},
      ${(props) => rgba(props.theme.black, 0.05)}
    ),
    url(${(props) => props.coverImage});
  background-size: cover;
  background-position: center top;
`;

const BannerTitle = styled.div`
  margin-bottom: 20px;
  width: 50%;
  font-size: 48px;
  font-weight: ${(props) => (props.theme.id === "light" ? "bold" : undefined)};
  text-shadow: 2px 2px 4px
    ${(props) => rgba(props.theme.darkColor.darkest, 0.7)};
  transition: color 0.4s;
  cursor: pointer;

  &:hover {
    color: ${(props) =>
      props.theme.id === "light"
        ? lighten(0.25, props.theme.lightColor.darkest)
        : props.theme.lightColor.darkest};
  }
`;

const BannerOverview = styled.div`
  margin-bottom: 70px;
  width: 50%;
  font-size: 20px;
  font-weight: ${(props) => (props.theme.id === "light" ? "bold" : undefined)};
  text-shadow: 2px 2px 4px
    ${(props) => rgba(props.theme.darkColor.darkest, 0.7)};
  overflow-y: auto;
  transition: color 0.4s;
  cursor: pointer;

  &:hover {
    color: ${(props) =>
      props.theme.id === "light"
        ? lighten(0.25, props.theme.lightColor.darkest)
        : props.theme.lightColor.darkest};
  }
`;

export interface BannerProps {
  movie: Movie;
  onClick?: (movie: Movie) => any;
}

function Banner({ movie, onClick }: BannerProps) {
  return (
    <BannerContainer coverImage={getImageFullUrl(movie.backdrop_path || "")}>
      <div style={{ height: 120 }} />
      <BannerTitle>{movie.title}</BannerTitle>
      <BannerOverview>{movie.overview}</BannerOverview>
    </BannerContainer>
  );
}

export default Banner;
