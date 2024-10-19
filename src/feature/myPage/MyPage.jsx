import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore"; // Firebase v9 모듈식 접근
import { db } from "../../firebase";

// component
import Navigation from "../../component/Navigation";
import Button from "../../ui/Button"; // 새로운 Button 컴포넌트
import PostList from "../post/PostList";
import CommentList from "../comment/CommentList"; // 댓글 리스트 컴포넌트 추가
import FixedTop from "../../component/FixedTop";

// import mypageIcon from "../../images/mypage.png";
import likeIcon from "../../images/favorite.png";
import commentIcon from "../../images/reply.png";
import viewIcon from "../../images/visibility.png";
import userIcon from "../../images/user.jpg";


// styled components
const Wrapper = styled.div`
  width: calc(100% - 40px);
  height: calc(100vh);
  margin-top: 48px;
  background-color:#fff;

`;

const ContentArea = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const ProfileHeader = styled.div`
  width: 100%;
  margin: 0;
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: #fff;
`;

const UserImgBox = styled.div`
  width: 106px;
  height: 106px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
`;

const UserImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;

const UserName = styled.p`
  font-size: 20px;
  font-weight: bold;
  color: #171725;
`;

const UserState = styled.p`
  font-size: 14px;
  color: #828282;
`;

const Stats = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
`;

const StatCover = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 33.33%;
  gap: 4px;
  cursor: pointer;
`;

const StatNumb = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #2c2c2c;
`;

const StatText = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #444;
`;

const Rail = styled.div`
  width: 100%;
  height: 2px;
  background-color: #ccc;
  margin: 10px auto;
  position: relative;
`;

const MovingBar = styled.div`
  width: 33.33%;
  height: 2px;
  background-color: #2c2c2c;
  position: absolute;
  left: ${(props) => props.position}%;
  transition: left 0.3s ease;
`;

const MyPostContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
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

const ProfileIcon = styled.img` // 변경된 부분: img 태그로 변경하여 이미지 소스 적용
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ccc;
  margin-right: 8px;
`;

const AuthorName = styled.p`
  font-size: 14px;
  color: #444;
`;

const PostTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
`;

const PostDate = styled.p`
  font-size: 12px;
  color: #888;
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

function MyPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); // 포스팅 데이터
  const [comments, setComments] = useState([]); // 댓글 데이터
  const [likedPosts, setLikedPosts] = useState([]); // 좋아요 누른 포스트 데이터
  const [currentView, setCurrentView] = useState(0); // 0: 포스팅, 1: 댓글, 2: 좋아요 누른 글
  const [barPosition, setBarPosition] = useState(0); // 막대의 위치

  useEffect(() => {
    // 포스팅 데이터 가져오기
    const fetchPosts = async () => {
      try {
        const postSnapshot = await getDocs(collection(db, "posts"));
        const postData = postSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(postData); // 포스팅 데이터 상태 업데이트
      } catch (error) {
        console.error("Error fetching posts: ", error);
      }
    };

    // 댓글 데이터 가져오기
    const fetchComments = async () => {
      try {
        const commentSnapshot = await getDocs(collection(db, "comments"));
        const commentData = commentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setComments(commentData); // 댓글 데이터 상태 업데이트
      } catch (error) {
        console.error("Error fetching comments: ", error);
      }
    };

    // 좋아요 누른 포스트 가져오기
    const fetchLikedPosts = async () => {
      try {
        const likedQuery = query(collection(db, "posts"), where("likedByUser", "==", true)); // likedByUser 필드를 사용해 필터링
        const likedSnapshot = await getDocs(likedQuery);
        const likedData = likedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setLikedPosts(likedData); // 좋아요 누른 포스트 데이터 상태 업데이트
      } catch (error) {
        console.error("Error fetching liked posts: ", error);
      }
    };

    fetchPosts();
    fetchComments();
    fetchLikedPosts();
  }, []);

  // StatCover 클릭 시 막대의 위치 및 보기 변경
  const handleStatClick = (index) => {
    setBarPosition(index * 33.33); // 클릭에 따라 위치 변경
    setCurrentView(index); // 클릭에 따라 보기를 변경
  };

  return (
    <Wrapper>
      <FixedTop />
      <ContentArea>
        <ProfileHeader>
          <UserImgBox>
            <UserImg src={userIcon} alt="User Icon" />
          </UserImgBox>
          <UserInfoContainer>
            <UserName>허재호</UserName>
            <UserState>행복한 사람이 되자!</UserState>
            <Button
              title="프로필 편집"
              background="#fff"
              color="#2c2c2c"
              width="144px"
              height="32px"
              fontSize="12px"
              border="1px solid #ccc"
            />
          </UserInfoContainer>
        </ProfileHeader>

        <Stats>
          <StatCover onClick={() => handleStatClick(0)}>
            <StatNumb>{posts.length}</StatNumb>
            <StatText>포스팅</StatText>
          </StatCover>
          <StatCover onClick={() => handleStatClick(1)}>
            <StatNumb>{comments.length}</StatNumb>
            <StatText>댓글</StatText>
          </StatCover>
          <StatCover onClick={() => handleStatClick(2)}>
            <StatNumb>{likedPosts.length}</StatNumb>
            <StatText>관심글</StatText>
          </StatCover>
        </Stats>

        <Rail>
          <MovingBar position={barPosition} />
        </Rail>

        <MyPostContainer>
          {currentView === 0 && (
            posts.map((post) => (
              <PostItemWrapper key={post.id} onClick={() => navigate("/post/" + post.id, { state: post })}>
                <AuthorInfo>
                  <AuthorProfile>
                    <ProfileIcon src={userIcon} alt="User Icon"/>
                    <AuthorName>{post.userIP || "허재호"}</AuthorName>
                    <PostDate>
                    {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : "Unknown date"}
                  </PostDate>
                  </AuthorProfile>
                </AuthorInfo>
                <PostTitle>{post.title}</PostTitle>
                <PostContent>{post.content.slice(0, 100)}...</PostContent>
                {post.images && post.images.length > 0 && (
                  <PostRepresentImage src={post.images[0]} alt="Post Image" />
                )}
                <InfoBar>
                  <InfoItem>
                    <img src={likeIcon} alt="like icon" style={{ width: "24px", marginRight: "8px" }} />
                    {post.likes || 0}
                  </InfoItem>
                  <InfoItem>
                    <img src={commentIcon} alt="reply icon" style={{ width: "24px", marginRight: "8px" }} />
                    {post.comments ? post.comments.length : 0}
                  </InfoItem>
                  <InfoItem>
                    <img src={viewIcon} alt="view icon" style={{ width: "24px", marginRight: "8px" }} />
                    {post.views || 0}
                  </InfoItem>
                </InfoBar>
              </PostItemWrapper>
            ))
          )}
          {currentView === 1 && <CommentList comments={comments} />}
          {currentView === 2 && <PostList posts={likedPosts} onClickItem={(p) => navigate("/post/" + p.id, { state: p })} />}
        </MyPostContainer>
      </ContentArea>
      <Navigation />
    </Wrapper>
  );
}

export default MyPage;
