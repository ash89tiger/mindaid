import React, { useRef } from 'react';
import styled from "styled-components";

const StyledTextArea = styled.textarea`
  width: ${(props) => props.width};
  height: ${(props) => props.height}px;
  padding: 0;
  font-size: ${(props) => props.fontSize}px;
  line-height: ${(props) => props.lineHeight || `${props.fontSize}px`};
  display: block;
  resize: none;
  border: 1px solid #fff;
  border-radius: ${(props) => props.borderRadius}px;
  outline: none;
  max-height: 260px;
  box-sizing: border-box;

  &::placeholder {
    color: ${(props) => props.placeholderColor || '#888'};
    font-size: ${(props) => props.placeholderFontSize || '16px'};
  }
`;

function Input({
  border,
  width,
  height,
  fontSize,
  lineHeight,
  value,
  onChange,
  placeholder,
  placeholderColor,
  placeholderFontSize
}) {
  const inputTag = useRef(null);

  const longerTextArea = (event, tag) => {
    if (event.keyCode === 13 || event.keyCode === 8) {
      tag.current.style.height = `auto`;
      tag.current.style.height = `${inputTag.current.scrollHeight}px`;
    }
  };

  return (
    <StyledTextArea
      ref={inputTag}
      onKeyUp={(event) => longerTextArea(event, inputTag)}
      borderRadius={border || 6}
      height={height || 20}
      lineHeight={lineHeight || fontSize || 16}
      width={width || '100%'}
      fontSize={fontSize || 16}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      placeholderColor={placeholderColor}
      placeholderFontSize={placeholderFontSize}
    />
  );
}

export default Input;
