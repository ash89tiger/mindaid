import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${(props) => props.$background || "#7369F4"};
  height: ${(props) => props.$height || "auto"};
  width: ${(props) => props.$width || "auto"};
  color: ${(props) => props.$color || "#fff"};
  border: ${(props) => props.$border || "1px solid #7369F4"};
  font-size: ${(props) => props.$fontSize || "16px"};
  font-weight: bold;
  padding: 10px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const InputImg = styled.img`
  width: ${(props) => props.$imgWidth || "20px"};
  height: ${(props) => props.$imgHeight || "20px"};
`;

function Button({ background, color, height, width, onClick, icon, border, imgWidth, imgHeight, fontSize, title }) {
  return (
    <StyledButton
      $background={background}
      $color={color}
      $height={height}
      $width={width}
      $border={border}
      $fontSize={fontSize}
      onClick={onClick}
    >
      {icon && <InputImg src={icon} alt="icon" $imgWidth={imgWidth} $imgHeight={imgHeight} />}
      {title && <span>{title}</span>} {/* 텍스트 지원 */}
    </StyledButton>
  );
}

export default Button;
