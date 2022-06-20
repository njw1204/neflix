import {
  motion,
  Transition,
  useAnimation,
  useViewportScroll,
  Variants,
} from "framer-motion";
import { darken, rgba, transparentize } from "polished";
import React, { useEffect, useRef, useState } from "react";
import { Link, useMatch, useNavigate } from "react-router-dom";
import styled, { DefaultTheme, useTheme } from "styled-components";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useRecoilState } from "recoil";
import { themeIdState } from "../stores/theme-mode";
import { FieldErrors, useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  position: fixed;
  display: flex;
  align-items: center;
  padding: 0 50px;
  width: 100%;
  height: 70px;
  overflow-x: auto;
  overflow-y: hidden;
  background: ${(props) =>
    `linear-gradient(to bottom, ${rgba(
      props.theme.darkColor.darkest,
      1
    )} 5%, rgba(0, 0, 0, 0))`};
  background-size: 100% 100%;
  z-index: 10;
`;

const Logo = styled(Link)`
  margin-right: 40px;
  flex: none;
`;

const LogoIcon = styled(motion.svg)`
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.accentColor};

  path {
    stroke: ${(props) => props.theme.accentColor};
    stroke-width: 4px;
  }
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  flex: 1 0 auto;
`;

const MenuItem = styled.div<{ active: boolean }>`
  position: relative;
  margin-left: 25px;
  flex: none;
  color: ${(props) =>
    props.active
      ? props.theme.lightColor.lighter
      : props.theme.lightColor.darker};
  font-size: 14px;
  transition: color 0.4s;
  font-weight: ${(props) => (props.active ? "bold" : undefined)};

  &:hover {
    color: ${(props) =>
      props.active ? undefined : props.theme.lightColor.darkest};
  }
`;

const MenuIndicator = styled(motion.div)`
  position: absolute;
  left: 50%;
  margin-left: -25px;
  width: 50px;
  height: 5px;
  bottom: -8px;
  border-radius: 5px;
  background-color: ${(props) => darken(0.1, props.theme.accentColor)};
`;

const Search = styled(motion.form)<{ open: boolean }>`
  display: flex;
  align-items: center;
  flex: none;
  margin-left: 20px;
  padding: 4px;
  height: 34px;
  border-style: solid;
  border-color: ${(props) =>
    props.open ? props.theme.lightColor.lighter : "transparent"};
  border-width: 1px;
  background-color: ${(props) =>
    props.open
      ? transparentize(0.3, props.theme.darkColor.darkest)
      : "transparent"};
`;

const SearchButton = styled(motion.svg)`
  margin: 0;
  padding: 0;
  width: 24px;
  height: 24px;
  flex: none;
  fill: ${(props) => props.theme.lightColor.lighter};
  cursor: pointer;
`;

const SearchInput = styled(motion.input)<{ open: boolean }>`
  margin: 0;
  padding: 0;
  width: ${(props) => (props.open ? "180px" : "0")};
  height: 24px;
  border: 0;
  flex: none;
  color: ${(props) => props.theme.lightColor.lighter};
  background-color: transparent;

  &:focus {
    outline: none;
  }
`;

const ThemeToggleButton = styled.div`
  display: flex;
  align-items: center;
  flex: none;
  margin-left: 16px;
  width: 32px;
  height: 32px;
  cursor: pointer;

  &:hover {
    scale: 1.2;
  }
`;

const ProfileIcon = styled(motion.img)`
  margin-left: 18px;
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 6px;
`;

const navVariants: Variants = {
  initial: {
    backgroundSize: "100% 100%",
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
  scrolled: {
    backgroundSize: "100% 2000%",
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
};

const logoIconVariants: Variants = {
  initial: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [1, 0, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
    },
  },
};

const searchVariants: Variants = {
  on: ({ theme }: { theme: DefaultTheme }) => ({
    borderColor: rgba(theme.lightColor.lighter, 1),
    backgroundColor: rgba(theme.darkColor.darkest, 0.6),
    transition: {
      backgroundColor: {
        duration: 0,
      },
    },
  }),
  off: ({ theme }: { theme: DefaultTheme }) => ({
    borderColor: rgba(theme.lightColor.lighter, 0),
    backgroundColor: rgba(theme.darkColor.darkest, 0),
    transition: {
      delay: 0.3,
      backgroundColor: {
        duration: 0,
      },
    },
  }),
};

const searchInputVariants: Variants = {
  on: {
    width: 180,
  },
  off: {
    width: 0,
    transition: {
      type: "tween",
    },
  },
};

interface SearchForm {
  keyword: string;
}

function Header() {
  const theme = useTheme();
  const navigate = useNavigate();
  const homeMatch =
    [useMatch("/"), useMatch("/movie/:movieId")].find((match) => match) ?? null;
  const tvMatch =
    [useMatch("/tv"), useMatch("/tv/:tvId")].find((match) => match) ?? null;
  const { scrollY } = useViewportScroll();
  const navAnimation = useAnimation();
  const [themeId, setThemeId] = useRecoilState(themeIdState);
  const [searchOpen, setSearchOpen] = useState(false);
  const { register, handleSubmit } = useForm<SearchForm>({
    defaultValues: {
      keyword: "",
    },
  });
  const { ref: keywordInputRegisterRef, ...keywordInputRegisterRest } =
    register("keyword", {
      required: true,
      minLength: 2,
      validate: (value) => Boolean(value.trim()),
    });
  const keywordInputRef = useRef<HTMLInputElement>();
  const keywordInputAnimation = useAnimation();

  useEffect(() => {
    const callback = (transition?: Transition) => {
      if (scrollY.get() > 20) {
        navAnimation.start("scrolled", transition);
      } else {
        navAnimation.start("initial", transition);
      }
    };

    const unsubscribe = scrollY.onChange(() => callback());
    callback({
      duration: 0,
    });

    return () => {
      unsubscribe();
    };
  }, [navAnimation, scrollY]);

  useEffect(() => {
    if (searchOpen) {
      keywordInputRef.current?.focus();
    } else {
      keywordInputRef.current?.blur();
    }
  }, [searchOpen]);

  const toggleTheme = () => {
    setThemeId((prevThemeId) => {
      if (prevThemeId === "default") {
        return "light";
      }

      return "default";
    });
  };

  const onClickSearchButton = () => {
    setSearchOpen((prevSearchOpen) => !prevSearchOpen);
  };

  const onKeyDownSearchInput = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      setSearchOpen(false);
    }
  };

  const onSubmitSearchForm = (data: SearchForm) => {
    navigate(`/search?keyword=${encodeURIComponent(data.keyword)}`);
  };

  const onInvalidSearchForm = (errors: FieldErrors<SearchForm>) => {
    const rotate = [];
    const scale = [];

    for (let i = 0; i < 15; i++) {
      rotate.push(i % 2 === 0 ? 10 : -10);
      scale.push(i % 3 === 0 ? 1.5 : 1.3);
    }

    rotate.push(0);
    scale.push(1);

    keywordInputAnimation.start({
      rotate,
      scale,
      transition: {
        type: "tween",
        duration: 0.5,
      },
    });
  };

  return (
    <Nav variants={navVariants} animate={navAnimation}>
      <Logo to="/">
        <LogoIcon
          variants={logoIconVariants}
          initial="initial"
          whileHover="active"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 276.742"
          width="1024"
          height="276.742"
        >
          <motion.path d="M 140.803 258.904 C 125.399 261.609 109.724 262.42 93.509 264.58 L 44.051 119.724 L 44.051 270.797 C 28.647 272.418 14.594 274.58 0 276.742 L 0 0 L 41.08 0 L 97.292 157.021 L 97.292 0 L 140.803 0 L 140.803 258.904 Z M 225.934 101.346 C 242.691 101.346 268.365 100.535 283.769 100.535 L 283.769 143.775 C 264.58 143.775 242.15 143.775 225.934 144.586 L 225.934 208.908 C 251.339 207.287 276.743 205.123 302.416 204.312 L 302.416 245.929 L 182.692 255.39 L 182.692 0 L 302.416 0 L 302.416 43.241 L 225.934 43.241 L 225.934 101.346 Z M 533.484 98.374 L 592.671 98.374 L 592.671 141.614 L 533.484 141.614 L 533.484 239.718 L 491.051 239.718 L 491.051 0 L 611.859 0 L 611.859 43.241 L 533.484 43.241 L 533.484 98.374 Z M 682.125 201.881 C 706.719 202.42 731.581 204.315 755.635 205.664 L 755.635 248.365 C 716.989 245.931 678.342 243.502 638.885 242.689 L 638.885 0 L 682.125 0 L 682.125 201.881 Z M 792.119 251.338 C 805.902 252.15 820.496 252.961 834.549 254.58 L 834.549 0 L 792.119 0 L 792.119 251.338 Z M 1024 0 L 969.137 131.615 L 1024 276.742 C 1007.783 274.58 991.568 271.607 975.352 268.904 L 944.274 188.91 L 912.657 262.42 C 896.979 259.715 881.845 258.904 866.173 256.742 L 921.845 129.992 L 871.576 0 L 918.058 0 L 946.435 72.699 L 976.705 0 L 1024 0 Z" />
        </LogoIcon>
      </Logo>
      <Menu>
        <MenuItem active={Boolean(homeMatch)}>
          <Link to="/">
            홈 {homeMatch && <MenuIndicator layoutId="menuIndicator" />}
          </Link>
        </MenuItem>
        <MenuItem active={Boolean(tvMatch)}>
          <Link to="/tv">
            시리즈 {tvMatch && <MenuIndicator layoutId="menuIndicator" />}
          </Link>
        </MenuItem>
      </Menu>
      <Search
        onSubmit={handleSubmit(onSubmitSearchForm, onInvalidSearchForm)}
        open={searchOpen}
        variants={searchVariants}
        custom={{ theme }}
        animate={searchOpen ? "on" : "off"}
      >
        <SearchButton
          onClick={onClickSearchButton}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path
            fill="currentColor"
            d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
          />
        </SearchButton>
        <SearchInput
          {...keywordInputRegisterRest}
          ref={(element) => {
            keywordInputRegisterRef(element);
            keywordInputRef.current = element ?? undefined;
          }}
          onKeyDown={onKeyDownSearchInput}
          open={searchOpen}
          variants={searchInputVariants}
          placeholder="Search here..."
        />
      </Search>
      <ThemeToggleButton onClick={toggleTheme}>
        {themeId === "light" ? (
          <MdDarkMode size={24} />
        ) : (
          <MdLightMode size={24} />
        )}
      </ThemeToggleButton>
      <ProfileIcon
        animate={keywordInputAnimation}
        src="https://i.imgur.com/bySkNvX.png"
        alt="Profile"
      />
    </Nav>
  );
}

export default Header;
