import styled from "styled-components";

export const MainShowcaseContainer = styled.div`
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

export const SearchShowcaseContainer = styled.div`
  position: relative;
  top: 0;
  margin-bottom: 0;

  & > * {
    margin-top: 8px;

    &:first-child {
      margin-top: 0;
    }
  }
`;
