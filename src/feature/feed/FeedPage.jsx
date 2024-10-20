import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { collection, getDocs, query, orderBy } from "firebase/firestore"; // Firebase v9 모듈식 접근
import { db } from "../../firebase";

import Navigator from "../../component/Navigation";
import FixedTop from "../../component/FixedTop";

import likeIcon from "../../images/favorite.png";
import viewIcon from "../../images/visibility.png";
import commentIcon from "../../images/reply.png"; // 댓글 아이콘 추가
import logo from "../../images/logo.png";
import userIcon from "../../images/user.jpg";


const Wrapper = styled.div`
  width: calc(100%);
  /* max-height: 898px; */
  padding: 48px 0px 0px 0px;
  background-color:#fff;
  margin: auto;
`;

const Logo = styled.img`
  display: flex;
  max-width: 100%;
  height: auto;
  margin: 0px 20px;
`;

const PostContainer = styled.div`
  width: calc(100%);
  padding : 0px 20px;
  margin: auto;
`;

const PostItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-bottom: 1px solid #ddd;
  gap: 12px;
`;

const PostTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const PostDate = styled.p`
  font-size: 14px;
  color: #888;
`;

const PostContent = styled.p`
  font-size: 16px;
  color: #333;
`;

const PostRepresentImage = styled.img`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  object-fit: contain;
`;

// 작성자 정보 섹션 스타일
const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const AuthorProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProfileIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc; /* 프로필 이미지가 없을 경우 기본 회색 원 */
  object-fit: contain;
`;

const AuthorName = styled.p`
  font-size: 16px;
  font-weight: 500;
`;

const InfoBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 10px;
  gap: 8px;
`;

const InfoItem = styled.div`
  font-size: 20px;
  color: #555;
  display: flex;
  align-items: center;
`;

// 태그 섹션 스타일
const TagSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const Tag = styled.span`
  background-color: #f0f0f0;
  color: #555;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 12px;
  &:before {
    content: '#';
    margin-right: 5px;
  }
`;

// SettingsButton 컴포넌트 (정의 필요)
const SettingsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const PostText = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin: 12px 0px;
`;

function FeedPage() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const collectionName = "posts"; // 컬렉션 이름을 "posts"로 가정
      try {
        // Firestore에서 데이터를 가져오는 올바른 방법 (Firebase v9)
        const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const tempData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(tempData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Wrapper>
      <FixedTop />
      <Logo src={logo} alt="logo" />
      <PostContainer>
        <PostText>오늘의 고민</PostText>
        {data.map((post) => {
          const postDate = post.createdAt
            ? new Date(post.createdAt.seconds * 1000).toLocaleDateString()
            : "Unknown date";

          return (
            <PostItemWrapper key={post.id} onClick={() => navigate("/post/" + post.id, { state: post })}>
              {/* 작성자 정보 표시 */}
              <AuthorInfo>
                <AuthorProfile>
                <ProfileIcon src={userIcon} alt="User Icon" />
                  <AuthorName>{post.userIP || "Unknown User"}</AuthorName>
                  <PostDate>{postDate}</PostDate>
                </AuthorProfile>
                <SettingsButton>⋮</SettingsButton> {/* 설정 버튼 */}
              </AuthorInfo>

              <PostTitle>{post.title}</PostTitle>
              <PostDate>{postDate}</PostDate>
              <PostContent>{post.content.slice(0, 100)}...</PostContent>
              {post.images && post.images.length > 0 && (
                <PostRepresentImage src={post.images[0]} alt="Post Image" />
              )}

              {/* 태그 섹션 추가 */}
              {post.tags && post.tags.length > 0 && (
                <TagSection>
                  {post.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagSection>
              )}

              <InfoBar>
                <InfoItem>
                  <img src={likeIcon} alt="like icon" style={{ width: "24px", marginRight: "8px" }} />
                  {post.likes || 0}
                </InfoItem>
                <InfoItem>
                  <img src={commentIcon} alt="reply icon" style={{ width: "24px", marginRight: "8px" }} />
                  {post.comments ? post.comments.length : 0} {/* 댓글 수 표시 */}
                </InfoItem>
                <InfoItem>
                  <img src={viewIcon} alt="view icon" style={{ width: "24px", marginRight: "8px" }} />
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

export default FeedPage;
