import { AnimatePresence, motion } from "framer-motion";
import { darken, lighten, rgba } from "polished";
import { MdPlayArrow } from "react-icons/md";
import styled, { createGlobalStyle } from "styled-components";
import { getImageFullUrl, MovieDetail } from "../apis/movie";
import Loader from "./Loader";

const modalBoxShadow = "0 5px 15px rgba(0, 0, 0, 0.5)";

const PreventScroll = createGlobalStyle`
  html,
  body {
    overflow: hidden;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => rgba(props.theme.darkColor.darkest, 0.66)};
  z-index: 100;
`;

const ModalDialog = styled(motion.section)`
  position: relative;
  margin: 30px auto;
  width: 960px;
  max-width: calc(100% - 40px);
  min-height: 320px;
  max-height: calc(100% - 60px);
  border-radius: 8px;
  background-color: ${(props) => props.theme.darkColor.lighter};
  box-shadow: ${modalBoxShadow};
  overflow: auto;
`;

const VideoBackground = styled.div<{ coverImage?: string }>`
  height: 400px;
  background-image: linear-gradient(
      to top,
      ${(props) => props.theme.darkColor.lighter},
      transparent 10%
    ),
    url(${(props) => props.coverImage});
  background-size: cover;
  background-position: center top;
`;

const VideoPlayButton = styled.button.attrs({ type: "button" })`
  position: relative;
  top: -110px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: -40px;
  padding: 10px 30px;
  border: 1px solid #000;
  border-radius: 8px;
  color: #000;
  background-color: #fff;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => darken(0.15, "#fff")};
  }
`;

export interface VideoModalProps {
  layoutId?: string;
  data?: MovieDetail;
  show: boolean;
  onRequestClose: (layoutId?: string) => any;
}

function VideoModal({ layoutId, data, show, onRequestClose }: VideoModalProps) {
  return (
    <AnimatePresence>
      {show ? (
        <>
          <Overlay
            onClick={() => onRequestClose(layoutId)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", duration: 0.2 }}
          >
            <PreventScroll />
            <ModalDialog
              onClick={(event) => event.stopPropagation()}
              layoutId={layoutId}
              tabIndex={-1}
            >
              {data ? (
                <div>
                  <VideoBackground
                    coverImage={getImageFullUrl(data.backdrop_path)}
                  />
                  <div style={{ padding: "16px 24px" }}>
                    {data.youtube_video_key ? (
                      <a
                        href={`https://www.youtube.com/watch?v=${data.youtube_video_key}`}
                      >
                        <VideoPlayButton>
                          <MdPlayArrow size={24} /> 재생
                        </VideoPlayButton>
                      </a>
                    ) : null}
                    <h2 style={{ margin: 0, padding: 0 }}>{data.title}</h2>
                    <div style={{ display: "flex", gap: "32px" }}>
                      <div style={{ flex: "2 0" }}>
                        <div style={{ fontStyle: "italic", fontSize: 14 }}>
                          {data.tagline}
                        </div>
                        <p style={{ marginTop: 28 }}>{data.overview}</p>
                      </div>
                      <div style={{ flex: "1 0" }}>
                        <div>
                          <span>⭐</span>{" "}
                          <span>{data.vote_average.toFixed(1)}</span>{" "}
                          <span style={{ fontSize: 14 }}>
                            (Votes: {data.vote_count})
                          </span>
                        </div>
                        {data.genres?.length ? (
                          <>
                            <hr />
                            <div>
                              <span>장르:</span>{" "}
                              <span>
                                {(data.genres || [])
                                  .map((genre) => genre.name)
                                  .join(", ")}
                              </span>
                            </div>
                          </>
                        ) : null}
                        {data.runtime ? (
                          <>
                            <hr />
                            <div>
                              <span>길이:</span> <span>{data.runtime}분</span>
                            </div>
                          </>
                        ) : null}
                        <hr />
                        <div>
                          <span>출시:</span> <span>{data.release_date}</span>
                        </div>
                        {data.homepage ? (
                          <>
                            {" "}
                            <hr />
                            <div>
                              <span>링크:</span>{" "}
                              <span>
                                <a
                                  href={data.homepage}
                                  style={{ color: lighten(0.1, "#e51013") }}
                                >
                                  {data.homepage}
                                </a>
                              </span>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Loader />
              )}
            </ModalDialog>
          </Overlay>
        </>
      ) : null}
    </AnimatePresence>
  );
}

export default VideoModal;
