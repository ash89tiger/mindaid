import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"; // Firestore 모듈화
import { db } from "../../firebase";

import Navigator from "../../component/Navigation";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import FixedTop from "../../component/FixedTop";

import likeIcon from "../../images/favorite.png";
import likeActiveIcon from "../../images/favorite_.png";
import commentIcon from "../../images/reply.png";
import viewIcon from "../../images/visibility.png";
import userIcon from "../../images/user.jpg";
import closeIcon from "../../images/close.png"; // 삭제 아이콘
import searchIcon from "../../images/search__.png";


const Wrapper = styled.div`
  width: calc(100%);
  height: calc(100%);
  padding-top: 64px;
  /* padding: 0px 20px ; */
  background-color:#fff;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 999px;
  border: 1px solid #ccc;
  padding: 4px 4px 4px 24px;
  margin: auto;
  width: calc(100% - 40px);
  /* margin-bottom: 12px; */
  margin: 0px 20px 20px 20px;
`;

const SearchText = styled.div`
  display: flex;
  align-items: center;
  height: auto;
  width: 100%;
  margin-top: 14px;
`;

const PostContainer = styled.div`
  width: calc(100% - 40px);
  margin: auto;
`;

const PostItemWrapper = styled.div`
  padding: 20px;
  border-bottom: 1px solid #ddd;
`;

const AuthorInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
`;

const AuthorProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  object-fit: contain;
`;

const AuthorName = styled.p`
  font-size: 14px;
  color: #444;
`;

const PostDate = styled.p`
  font-size: 12px;
  color: #888;
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const PostTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
`;

const PostContent = styled.p`
  font-size: 14px;
  color: #333;
`;

const PostRepresentImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-top: 12px;
  border-radius: 8px;
`;

const TagSection = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
`;

const Tag = styled.div`
  background-color: #f2f2f2;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  color: #555;
`;

const InfoBar = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  gap: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #888;
`;

const HistoryContainer = styled.div`  display: flex;
flex-direction: column;
align-items: flex-start;
gap: 16px;
width: calc(100% - 40px);
margin: auto;`

;

const HistoryText = styled.h3`  font-size: 16px;
  font-weight: 500;`

;

const HistoryList = styled.ul`  list-style: none;
padding: 0;
display: flex;
flex-wrap: wrap;
gap: 10px;
width: 100%;`

;

const HistoryItem = styled.li`  background-color: #fff;
color: #7369F4;
padding: 8px 16px;
border-radius: 999px;
border: 1px solid #ccc;
display: flex;
align-items: center;
font-size: 12px;
font-weight: 500;
white-space: nowrap;`

;

const DeleteButton = styled.button`  color: #939393;
border: none;
cursor: pointer;
background: url(${closeIcon}) no-repeat center;
background-size: 16px 16px;
width: 24px;
height: 24px;
margin-left: 10px;`

;

function SearchPage() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // 검색 필터링된 데이터 상태 추가
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState([]); // 검색 히스토리 추가
  const navigate = useNavigate();

  // Firestore에서 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const tempData = [];
      const collectionName = "dummyData";
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        snapshot.forEach((doc) => {
          tempData.push({ id: doc.id, ...doc.data() });
        });
        setData(tempData);
        setFilteredData(tempData); // 초기 데이터 설정
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      try {
        const querySnapshot = await getDocs(collection(db, "posts")); // "posts" 컬렉션 가져오기
        const tempData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(tempData); // 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    
    fetchData();
  }, []);

  const handleLike = async (postId, currentLikes) => {
    const postRef = doc(db, "dummyData", postId);
    try {
      await updateDoc(postRef, {
        likes: currentLikes + 1,
      });
      setData((prevData) =>
        prevData.map((post) =>
          post.id === postId ? { ...post, likes: currentLikes + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error updating like: ", error);
    }
  };

  const handleSearch = () => {
    if (search && !history.includes(search)) {
      setHistory([...history, search]);
    }

    // 검색어가 포함된 포스트만 필터링하여 보여줌
    const filtered = data.filter((post) => {
      const lowerSearch = search.toLowerCase();
      return (
        post.title.toLowerCase().includes(lowerSearch) || // 제목에서 검색
        post.content.toLowerCase().includes(lowerSearch) || // 본문에서 검색
        (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(lowerSearch))) // 태그에서 검색
      );
    });

    setFilteredData(filtered); // 필터링된 데이터를 설정
    setSearch(""); // 검색창 비우기
  };

  const handleDeleteHistory = (item) => {
    setHistory(history.filter((h) => h !== item));
  };

  return (
    <Wrapper>
      <FixedTop />
      <SearchContainer>
        <SearchText>
          <Input
            placeholder={"검색어를 입력하세요."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fontSize="14px"
            height="14px"
            lineheight="14px"
          />
        </SearchText>
        <Button
          onClick={handleSearch} // 검색 버튼 클릭 시 검색어 히스토리 추가 및 필터링
          icon={searchIcon}
          height="48px"
          width="48px"
          imgWidth="36px"
          imgHeight="36px"
        />
      </SearchContainer>

      {/* 검색 히스토리 */}
      <HistoryContainer>
        <HistoryText>최근 검색어</HistoryText>
        <HistoryList>
          {history.map((item) => (
            <HistoryItem key={item}>
              {item}
              <DeleteButton onClick={() => handleDeleteHistory(item)} />
            </HistoryItem>
          ))}
        </HistoryList>
      </HistoryContainer>

      {/* 검색 결과 */}
      <PostContainer>
        {filteredData.map((post) => {
          const postDate = post.createdAt
            ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
            : "Unknown date";

          return (
            <PostItemWrapper
              key={post.id}
              onClick={() => navigate("/post/" + post.id, { state: post })}
            >
              <AuthorInfo>
                <AuthorProfile>
                  <ProfileIcon src={userIcon} alt="User Icon" />
                  <AuthorName>{post.userIP || "허재호"}</AuthorName>
                  <PostDate>{postDate}</PostDate>
                </AuthorProfile>
                <SettingsButton>⋮</SettingsButton>
              </AuthorInfo>

              <PostTitle>{post.title}</PostTitle>
              <PostDate>{postDate}</PostDate>
              <PostContent>{post.content.slice(0, 100)}...</PostContent>
              {post.images && post.images.length > 0 && (
                <PostRepresentImage src={post.images[0]} alt="Post Image" />
              )}

              {post.tags && post.tags.length > 0 && (
                <TagSection>
                  {post.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagSection>
              )}

              <InfoBar>
                <InfoItem>
                  <img
                    src={post.likes ? likeActiveIcon : likeIcon}
                    alt="like icon"
                    style={{
                      width: "24px",
                      marginRight: "8px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post.id, post.likes || 0);
                    }}
                  />
                  {post.likes || 0}
                </InfoItem>
                <InfoItem>
                  <img
                    src={commentIcon}
                    alt="reply icon"
                    style={{ width: "24px", marginRight: "8px" }}
                  />
                  {post.comments ? post.comments.length : 0}
                </InfoItem>
                <InfoItem>
                  <img
                    src={viewIcon}
                    alt="view icon"
                    style={{ width: "24px", marginRight: "8px" }}
                  />
                  {post.views || 0}
                </InfoItem>
              </InfoBar>
            </PostItemWrapper>
          );
        })}
      </PostContainer>

      <Navigator />
    </Wrapper>
  );
}

export default SearchPage;
