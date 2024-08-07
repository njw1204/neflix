import { AnimatePresence, motion, Variants } from "framer-motion";
import { lighten, rgba } from "polished";
import { useState } from "react";
import styled from "styled-components";
import { getImageFullUrl, Movie } from "../apis/movie";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { FALLBACK_IMAGE_URL } from "../enums/common-enum";
import React from "react";

const cardBoxShadow =
  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";

const SliderContainer = styled.section<{ titleExists: boolean }>`
  position: relative;
  height: ${(props) => (props.titleExists ? "215px" : "160px")};
`;

const SliderTitle = styled.h2`
  margin: 0 50px 0;
  height: 55px;
  font-size: 28px;
  text-shadow: 2px 2px 4px
    ${(props) => rgba(props.theme.darkColor.darkest, 0.7)};
`;

const SliderRow = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  left: 50px;
  right: 50px;
`;

const SliderItem = styled(motion.article)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border-radius: 6px;
  cursor: pointer;
`;

const SliderImageContainer = styled.div`
  width: 100%;
  height: 160px;
  border-radius: 6px;
  background-color: ${(props) => props.theme.darkColor.lighter};
`;

const SliderImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
  object-fit: cover;
`;

const SliderItemInfo = styled(motion.div)`
  position: absolute;
  top: 155px;
  display: none;
  padding: 6px 8px;
  width: 100%;
  border-radius: 0 0 6px 6px;
  background-color: ${(props) => lighten(0.03, props.theme.darkColor.darker)};
  font-size: 12px;
  opacity: 0;
  overflow-y: hidden;

  h2 {
    margin: 0;
    padding: 0;
    font-size: 12px;
    font-weight: normal;
  }
`;

const SliderPrevButton = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 160px;
  color: ${(props) => props.theme.lightColor.lighter};
  opacity: 0.4;
  cursor: pointer;
  z-index: 2;

  svg {
    transition: transform 0.2s;
  }

  &:hover {
    background-color: ${(props) => rgba(props.theme.lightColor.darkest, 0.3)};
    opacity: 0.8;

    svg {
      transform: scale(1.5);
    }
  }
`;

const SliderNextButton = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 160px;
  color: ${(props) => props.theme.lightColor.lighter};
  opacity: 0.3;
  cursor: pointer;
  z-index: 2;

  svg {
    transition: transform 0.15s;
  }

  &:hover {
    background-color: ${(props) => rgba(props.theme.lightColor.darkest, 0.3)};
    opacity: 0.8;

    svg {
      transform: scale(1.5);
    }
  }
`;

const sliderRowVariants: Variants = {
  initial: ({ prev }: { prev: boolean }) => ({
    x: prev
      ? -Math.max(document.body.scrollWidth, window.innerWidth) - 8
      : Math.max(document.body.scrollWidth, window.innerWidth) + 8,
  }),
  animate: {
    x: 0,
    transition: {
      type: "tween",
      duration: 0.6,
    },
  },
  exit: ({ prev }: { prev: boolean }) => ({
    x: prev
      ? Math.max(document.body.scrollWidth, window.innerWidth) + 8
      : -Math.max(document.body.scrollWidth, window.innerWidth) - 8,
    transition: {
      type: "tween",
      duration: 0.6,
    },
  }),
};

const sliderItemVariants: Variants = {
  initial: {
    zIndex: 0,
    scale: 1,
  },
  hover: {
    zIndex: 1,
    scale: 1.4,
    y: -50,
    boxShadow: cardBoxShadow,
    transition: {
      type: "tween",
      delay: 0.3,
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const sliderItemInfoVariants: Variants = {
  initial: {
    display: "none",
    opacity: 0,
  },
  hover: {
    display: "block",
    opacity: 1,
    boxShadow: cardBoxShadow,
    transition: {
      type: "tween",
      delay: 0.3,
      duration: 0,
    },
  },
};

export interface SliderProps {
  id: string;
  title?: string;
  data: Movie[];
  pageOffset: number;
  onClick: (data: Movie, layoutId: string) => any;
}

function Slider({ id, title, data, pageOffset, onClick }: SliderProps) {
  const [sliderPage, setSliderPage] = useState(0);
  const [sliderMoving, setSliderMoving] = useState(false);
  const [sliderMovingPrev, setSliderMovingPrev] = useState(false);

  let maxSliderPage = Math.ceil(data.length / pageOffset) - 1;
  if (maxSliderPage > 1 && data.length % pageOffset !== 0) {
    maxSliderPage -= 1;
  }

  const onErrorSliderImage = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.currentTarget.src = FALLBACK_IMAGE_URL;
  };

  const onClickSliderPrev = () => {
    if (!sliderMoving && data.length > 0) {
      setSliderMoving(true);
      setSliderMovingPrev(true);
      setSliderPage((prevSliderPage) =>
        prevSliderPage === 0 ? maxSliderPage : prevSliderPage - 1
      );
    }
  };

  const onClickSliderNext = () => {
    if (!sliderMoving && data.length > 0) {
      setSliderMoving(true);
      setSliderMovingPrev(false);
      setSliderPage((prevSliderPage) =>
        prevSliderPage < maxSliderPage ? prevSliderPage + 1 : 0
      );
    }
  };

  const onExitCompleteSlider = () => {
    setSliderMoving(false);
    setSliderMovingPrev(false);
  };

  return (
    <SliderContainer titleExists={Boolean(title)}>
      {title ? <SliderTitle>{title}</SliderTitle> : null}
      {maxSliderPage > 1 ? (
        <SliderPrevButton onClick={onClickSliderPrev}>
          <MdOutlineNavigateBefore size={32} />
        </SliderPrevButton>
      ) : null}
      <AnimatePresence
        custom={{ prev: sliderMovingPrev }}
        initial={false}
        onExitComplete={onExitCompleteSlider}
      >
        <SliderRow
          key={sliderPage}
          variants={sliderRowVariants}
          custom={{ prev: sliderMovingPrev }}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {data
            .slice(sliderPage * pageOffset, (sliderPage + 1) * pageOffset)
            .map((movie, index, arr) => {
              const layoutId = id + movie.id;
              const isFirst = index === 0;
              const isLast = index === arr.length - 1;

              return (
                <motion.div key={movie.id} layoutId={layoutId}>
                  <SliderItem
                    onClick={() => onClick(movie, layoutId)}
                    variants={sliderItemVariants}
                    initial="initial"
                    whileHover="hover"
                    transition={{
                      default: {
                        type: "tween",
                        delay: 0,
                        duration: 0.3,
                      },
                      zIndex: {
                        type: "tween",
                        delay: 0.3,
                        duration: 0,
                      },
                    }}
                    style={
                      isFirst || isLast
                        ? {
                            originX: isFirst ? 0 : 1,
                          }
                        : undefined
                    }
                  >
                    <SliderImageContainer>
                      <SliderImage
                        src={getImageFullUrl(movie.backdrop_path || "", "w780")}
                        alt={movie.title}
                        onError={onErrorSliderImage}
                      />
                    </SliderImageContainer>
                    <SliderItemInfo
                      variants={sliderItemInfoVariants}
                      transition={{
                        default: {
                          type: "tween",
                          delay: 0.3,
                          duration: 0.3,
                        },
                        opacity: {
                          type: "tween",
                          delay: 0,
                          duration: 0.3,
                        },
                      }}
                    >
                      <h2>{movie.title}</h2>
                      <span>⭐ {movie.vote_average.toFixed(1)}</span>
                      {movie.release_date ? (
                        <div style={{ float: "right" }}>
                          ({movie.release_date})
                        </div>
                      ) : null}
                    </SliderItemInfo>
                  </SliderItem>
                </motion.div>
              );
            })}
        </SliderRow>
      </AnimatePresence>
      {maxSliderPage > 1 ? (
        <SliderNextButton onClick={onClickSliderNext}>
          <MdOutlineNavigateNext size={32} />
        </SliderNextButton>
      ) : null}
    </SliderContainer>
  );
}

export default React.memo(Slider);
