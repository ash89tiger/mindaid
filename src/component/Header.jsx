import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import backIcon from "../images/back.png";

const Wrapper = styled.div`
  width: 100%;
  margin: 0;
  padding: 20px 16px;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  position: sticky;
  left: 0;
  z-index: 1;
`;

const BackIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 16px;
  cursor: pointer;
`;

const HeaderTitleText = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: var(--main-textColor);

  text-align: center;
  flex-grow: 1; 
  margin: 0;
`;

function Header({ backLink, headerTitle }) {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (backLink === -1) {
      navigate(-1);
    } else {
      navigate(backLink);
    }
  };

  return (
    <Wrapper>
      <BackIcon onClick={handleBackClick} src={backIcon} alt="Back Icon" />
      <HeaderTitleText>{headerTitle}</HeaderTitleText>
    </Wrapper>
  );
}

export default Header;
