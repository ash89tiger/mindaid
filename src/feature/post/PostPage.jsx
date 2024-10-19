import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase";
import FixedTop from "../../component/FixedTop";
import Header from "../../component/Header";
import Button from "../../ui/Button";
import CommentList from "../comment/CommentList";
import Input from "../../ui/Input";
import { Timestamp } from "firebase/firestore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
// import axios from 'axios';

import likeIcon from "../../images/favorite.png";
import likeActiveIcon from "../../images/favorite_.png";
import commentIcon from "../../images/reply.png";
import viewIcon from "../../images/visibility.png";
import createIcon from "../../images/create.png";
import userIcon from "../../images/user.jpg";


// GPT API 호출을 위한 함수

const fetchPlaceholderContent = async (postType, content) => {
  const apiKey = process.env.REACT_APP_GPT_API_KEY;  // 실제 GPT API 키를 사용해야 함
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const prompt =
    postType === "현실적 조언"
      ? `이 본문에서 나오는 고민의 해결책을 10글자 미만의 문장으로 요약해줘: ${content}`
      : `이 글쓴이의 마음을 공감할 수 있는 감성적인 대답을 10글자 미만의 문장으로 만들어줘: ${content}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
};

// 스타일 정의
const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh);
  margin-top: 48px;
  /* margin-bottom: 114px; */
  overflow: auto;
  background-color:#fff;

`;

const ContentArea = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 12px;
`;

const PostTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
`;

const PostDate = styled.p`
  font-size: 14px;
  color: #888;
`;

const PostRepresentImage = styled.img`
  width: 100%;
  height: 200px;
  border-radius: 14px;
  object-fit: contain;
`;

const CommentArea = styled.div`
  padding: 10px 20px;
`;

const UploadComment = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 999px;
  border: 1px solid #ccc;
  padding: 4px 4px 4px 24px;
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

const SettingsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

// 정보바 섹션 스타일
const InfoBar = styled.div`
  display: flex;
  width: auto;
  justify-content: flex-start;
  margin-top: 16px;
  padding: 10px 0;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  gap: 8px;
`;

const InfoItem = styled.div`
  font-size: 14px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 8px;
  background-image: url(${(props) => props.imageUrl});
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 24px 24px;
  padding-left: 32px; 
  height: 24px;
  cursor: pointer;
`;

// 태그 섹션 스타일
const TagSection = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Tag = styled.div`
  /* background-color: #f0f0f0; */
  padding: 8px 12px;
  border-radius: 16px;
  font-size: 12px;
  color: #555;
  &:before {
    content: '#';
    margin-right: 5px;
  }
`;

const CommentText = styled.div`
  display: flex;
  align-items: center;
  height: auto; 
  width: 100%;
  margin-top: 14px;
`

function PostPage() {
  const { state } = useLocation();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [userIP, setUserIP] = useState("");
  const [placeholder, setPlaceholder] = useState("댓글을 입력하세요.");

  // 사용자 IP 가져오기
  const fetchUserIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      setUserIP(data.ip);
    } catch (error) {
      console.error("Error fetching IP:", error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      const postId = state.id;
      try {
        const docRef = doc(db, "posts", postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setPost(postData);
          setLikeCount(postData.likes || 0);

          const gptPlaceholder = await fetchPlaceholderContent(postData.postType, postData.content);
          setPlaceholder(gptPlaceholder); // GPT에서 받은 값을 placeholder로 설정
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
    fetchUserIP();  // 페이지 로드 시 사용자 IP 가져오기
  }, [state.id]);

  const handleLikeClick = async () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    setLikeCount(newLikeCount);

    try {
      await updateDoc(doc(db, "posts", state.id), {
        likes: newLikeCount, // Firestore에서 likeCount 업데이트
      });
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleSubmitComment = async () => {
    if (comment.trim() === "") return;

    const newComment = {
      id: new Date().getTime(),
      content: comment,
      createdAt: Timestamp.now(), // 댓글 작성 시간
      userIP, // 사용자 IP 기록
    };

    try {
      const updatedComments = post.comments ? [...post.comments, newComment] : [newComment];
      await updateDoc(doc(db, "posts", state.id), {
        comments: updatedComments,
      });
      setComment("");
      setPost({ ...post, comments: updatedComments });
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  if (!post) return <div>Loading...</div>;

  const postDate = post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : "Unknown";

  return (
    <Wrapper>
      <FixedTop />
      <Header backLink="/" headerTitle="" />

      <ContentArea>
        {/* 작성자 정보 */}
        <AuthorInfo>
          <AuthorProfile>
            <ProfileIcon src={userIcon} alt="User Icon" />
            <AuthorName>{post.userIP || "허재호"}</AuthorName>
            <PostDate>{`${postDate}`}</PostDate>
          </AuthorProfile>
          <SettingsButton>⋮</SettingsButton> {/* 설정 버튼 */}
        </AuthorInfo>

        {/* 포스트 제목 */}
        <PostTitle>{post.title}</PostTitle>

        {/* 포스트 내용 */}
        <p>{post.content}</p>

        {/* 포스트 이미지 */}
        {Array.isArray(post.images) && post.images.map((image, index) => (
          <PostRepresentImage key={index} src={image} />
        ))}

        {/* 태그 섹션 */}
        <TagSection>
          {post.tags?.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </TagSection>

        {/* 정보바 */}
        <InfoBar>
          <InfoItem
            imageUrl={isLiked ? likeActiveIcon : likeIcon}
            onClick={handleLikeClick}
          >
            {likeCount}
          </InfoItem>
          <InfoItem imageUrl={commentIcon}> {post.comments ? post.comments.length : 0} </InfoItem>
          <InfoItem imageUrl={viewIcon}> {post.views || 0} </InfoItem>
        </InfoBar>
      </ContentArea>

      {/* 댓글 섹션 */}
      <CommentArea>
        <CommentList comments={post.comments || []} />
        {post.comments && post.comments.length === 0 && <p>댓글이 없습니다.</p>}
        <UploadComment>
          <CommentText>
            <Input
              placeholder={placeholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fontSize="14px"
              height="14px"
              lineheight="14px"
            />
          </CommentText>

          <Button
            onClick={handleSubmitComment}
            icon={createIcon}
            height="48px"
            width="48px"
            imgWidth="36px"
            imgHeight="36px"
          />
        </UploadComment>
      </CommentArea>
    </Wrapper>
  );
}

export default PostPage;