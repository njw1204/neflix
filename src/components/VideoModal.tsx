import { AnimatePresence, motion } from "framer-motion";
import { darken, lighten, rgba } from "polished";
import React from "react";
import { MdClose, MdPlayArrow } from "react-icons/md";
import styled from "styled-components";
import { getImageFullUrl, MovieDetail } from "../apis/movie";
import { FALLBACK_IMAGE_URL } from "../enums/common-enum";
import {
  getYoutubeThumbnailUrl,
  getYoutubeVideoUrl,
} from "../utils/common-util";
import Loader from "./Loader";

const modalBoxShadow = "0 5px 15px rgba(0, 0, 0, 0.5)";

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

const ModalContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 101;
`;

const ModalDialog = styled(motion.article)`
  position: relative;
  margin: 40px auto;
  width: 960px;
  max-width: calc(100% - 40px);
  height: calc(100% - 80px);
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
    background-color: ${(props) => darken(0.2, "#fff")};
  }
`;

const VideoModalCloseButton = styled.button.attrs({ type: "button" })`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 20px;
  color: #fff;
  background-color: #000;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
`;

const VideoInfoCategory = styled.span`
  color: ${(props) => props.theme.lightColor.darkest};
`;

const VideoInfoCategoryContainer = styled.div`
  margin-top: 12px;
  word-break: break-all;
`;

const ClipContainer = styled.section`
  margin-top: 32px;
  word-break: break-all;
`;

const ClipContainerTitle = styled.h3`
  margin: 0 0 12px 0;
  padding: 0;
  font-size: 1.3em;
`;

const ClipPlayIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid #fff;
  border-radius: 24px;
  color: #fff;
  background-color: rgba(30, 30, 20, 0.66);
  opacity: 0;
  transition: opacity 0.2s ease-in;
`;

const Clip = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 32px;
  width: 100%;
  height: 130px;
  border-bottom: 1px solid;
  transition: background-color 0.2s ease-in;
  cursor: pointer;

  &:first-child {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);

    ${ClipPlayIcon} {
      opacity: 1;
    }
  }
`;

const ClipNumber = styled.div`
  flex: none;
  width: 30px;
  text-align: center;
  font-size: 24px;
`;

const ClipThumbnail = styled.div<{ coverImage?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 16px;
  flex: none;
  width: 133px;
  height: 100px;
  background-image: url(${(props) => props.coverImage});
  background-size: cover;
`;

const ClipContents = styled.div`
  flex: 1 0;
`;

const ClipTitle = styled.h4`
  margin: 0;
  padding: 0;
`;

const ClipDate = styled.div``;

export interface VideoModalProps {
  layoutId?: string;
  data?: MovieDetail;
  show: boolean;
  onRequestClose: (layoutId?: string) => any;
}

function VideoModal({ layoutId, data, show, onRequestClose }: VideoModalProps) {
  const clips =
    data?.clips?.filter((clip) => clip.site.toLowerCase() === "youtube") || [];

  return (
    <>
      <AnimatePresence>
        {show ? (
          <>
            <Overlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
            />
          </>
        ) : null}
      </AnimatePresence>
      {show ? (
        <>
          <ModalContainer layout onClick={() => onRequestClose(layoutId)}>
            <ModalDialog
              onClick={(event) => event.stopPropagation()}
              layoutId={layoutId}
              tabIndex={-1}
            >
              <div style={{ minWidth: 480 }}>
                {!data ? <Loader>Now Loading...</Loader> : null}
                <VideoBackground
                  coverImage={
                    data
                      ? getImageFullUrl(data?.backdrop_path, "w780") ||
                        FALLBACK_IMAGE_URL
                      : undefined
                  }
                />
                <VideoModalCloseButton onClick={() => onRequestClose(layoutId)}>
                  <MdClose size={24} />
                </VideoModalCloseButton>
                <div style={{ padding: "20px 30px" }}>
                  {data?.youtube_video_key ? (
                    <a href={getYoutubeVideoUrl(data.youtube_video_key)}>
                      <VideoPlayButton>
                        <MdPlayArrow size={24} /> 재생
                      </VideoPlayButton>
                    </a>
                  ) : null}
                  <h2 style={{ margin: 0, padding: 0 }}>{data?.title}</h2>
                  <div style={{ display: "flex", gap: "32px" }}>
                    <div style={{ flex: "2 0" }}>
                      <div style={{ fontStyle: "italic", fontSize: 14 }}>
                        <VideoInfoCategory>{data?.tagline}</VideoInfoCategory>
                      </div>
                      <p style={{ marginTop: 28 }}>{data?.overview}</p>
                    </div>
                    <div style={{ flex: "1 0" }}>
                      {data ? (
                        <>
                          <div>
                            <span>⭐</span>{" "}
                            <span>{data?.vote_average.toFixed(1)}</span>{" "}
                            <span style={{ fontSize: 14 }}>
                              (Votes: {data?.vote_count})
                            </span>
                          </div>
                          <hr />
                        </>
                      ) : null}
                      {data?.genres?.length ? (
                        <>
                          <VideoInfoCategoryContainer>
                            <VideoInfoCategory>장르:</VideoInfoCategory>{" "}
                            <span>
                              {(data.genres || [])
                                .map((genre) => genre.name)
                                .join(", ")}
                            </span>
                          </VideoInfoCategoryContainer>
                        </>
                      ) : null}
                      {data?.runtime ? (
                        <>
                          <VideoInfoCategoryContainer>
                            <VideoInfoCategory>길이:</VideoInfoCategory>{" "}
                            <span>{data.runtime}분</span>
                          </VideoInfoCategoryContainer>
                        </>
                      ) : null}
                      {data?.release_date ? (
                        <>
                          <VideoInfoCategoryContainer>
                            <VideoInfoCategory>출시:</VideoInfoCategory>{" "}
                            <span>{data?.release_date}</span>
                          </VideoInfoCategoryContainer>
                        </>
                      ) : null}
                      {data?.homepage ? (
                        <>
                          <VideoInfoCategoryContainer>
                            <VideoInfoCategory>링크:</VideoInfoCategory>{" "}
                            <span>
                              <a
                                href={data.homepage}
                                style={{
                                  color: lighten(0.1, "#e51013"),
                                }}
                              >
                                {data.homepage}
                              </a>
                            </span>
                          </VideoInfoCategoryContainer>
                        </>
                      ) : null}
                    </div>
                  </div>
                  {clips.length ? (
                    <ClipContainer>
                      <ClipContainerTitle>비디오</ClipContainerTitle>
                      <div>
                        {clips.map((clip, index) => (
                          <Clip
                            key={clip.key}
                            href={getYoutubeVideoUrl(clip.key)}
                          >
                            <ClipNumber>{index + 1}</ClipNumber>
                            <ClipThumbnail
                              coverImage={getYoutubeThumbnailUrl(clip.key)}
                            >
                              <ClipPlayIcon>
                                <MdPlayArrow size={48} />
                              </ClipPlayIcon>
                            </ClipThumbnail>
                            <ClipContents>
                              <ClipTitle>{clip.name}</ClipTitle>
                              <ClipDate>
                                {new Date(
                                  clip.published_at
                                ).toLocaleDateString()}
                              </ClipDate>
                            </ClipContents>
                          </Clip>
                        ))}
                      </div>
                    </ClipContainer>
                  ) : null}
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        </>
      ) : null}
    </>
  );
}

export default React.memo(VideoModal);
