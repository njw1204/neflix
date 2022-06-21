import { rgba, darken } from "polished";
import styled from "styled-components";
import { getImageFullUrl, Movie } from "../apis/movie";
import { useNavigate } from "react-router-dom";

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
`;

const DetailButton = styled.button.attrs({ type: "button" })`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  padding: 10px 30px;
  border: 1px solid #000;
  border-radius: 8px;
  color: #000;
  background-color: #fff;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.4s;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => darken(0.2, "#fff")};
  }
`;

export interface BannerProps {
  movie: Movie;
}

function Banner({ movie }: BannerProps) {
  const navigate = useNavigate();

  const navigateToDetail = () => {
    navigate(`${movie.is_tv ? "/tv" : "/movie"}/${movie.id}`);
  };

  return (
    <BannerContainer coverImage={getImageFullUrl(movie.backdrop_path || "")}>
      <div style={{ height: 120 }} />
      <BannerTitle onClick={navigateToDetail}>{movie.title}</BannerTitle>
      <BannerOverview onClick={navigateToDetail}>
        {movie.overview}
        <DetailButton>자세히 보기</DetailButton>
      </BannerOverview>
    </BannerContainer>
  );
}

export default Banner;
