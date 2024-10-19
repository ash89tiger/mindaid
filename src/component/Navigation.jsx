import React from "react";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationItem from "./NavigationItem";

// 이미지
import feedIcon from "../images/home.png";
import feedIconActive from "../images/home_.png"; // 활성화된 feed 아이콘
import searchIcon from "../images/search.png";
import searchIconActive from "../images/search_.png"; // 활성화된 search 아이콘
import writeIcon from "../images/write.png"; // write는 항상 동일한 아이콘 사용
import mypageIcon from "../images/mypage.png";
import mypageIconActive from "../images/mypage_.png"; // 활성화된 mypage 아이콘

// 스타일
const NavigationFrame = styled.div`
  width: calc(100% - 40px);
  display: flex;
  justify-content: space-between;
  position: fixed;
  background-color: white;
  box-shadow: 0px -4px 4px rgba(0, 0, 0, 0.04);
  bottom: 0;
  left: auto;
  padding: 0px 40px;
`;

function Navigation() {
  const navi = useNavigate();
  const location = useLocation(); // 현재 위치 가져오기

  return (
    <NavigationFrame>
      <NavigationItem
        onClick={() => navi("/")}
        imageUrl={location.pathname === "/" ? feedIconActive : feedIcon} // 경로가 "/"이면 활성화된 아이콘을 표시
      />
      <NavigationItem
        onClick={() => navi("/search")}
        imageUrl={location.pathname === "/search" ? searchIconActive : searchIcon} // 경로가 "/search"이면 활성화된 아이콘을 표시
      />
      <NavigationItem
        onClick={() => navi("/write")}
        imageUrl={writeIcon} // write는 항상 동일한 아이콘 사용
      />
      <NavigationItem
        onClick={() => navi("/mypage")}
        imageUrl={location.pathname === "/mypage" ? mypageIconActive : mypageIcon} // 경로가 "/mypage"이면 활성화된 아이콘을 표시
      />
    </NavigationFrame>
  );
}

export default Navigation;
