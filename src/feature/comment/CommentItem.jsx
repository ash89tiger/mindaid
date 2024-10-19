import React, { useState } from "react";
import styled from "styled-components";
import likeIcon from "../../images/favorite.png";
import likeActiveIcon from "../../images/favorite_.png";
import commentIcon from "../../images/reply.png";
import userIcon from "../../images/user.jpg";


const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 12px 20px 8px 20px;
  margin-bottom: 12px;
`;

const CommentUserInfo = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

// 프로필 이미지를 회색 원으로 설정
const UserImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ccc;
  object-fit: contain;
`;

const UserTextInfo = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 12px;
  gap: 8px;
`;

const BalanceUtilFrame = styled.div`
  width: fit-content;
  display: flex;
  margin-left: auto;
  cursor: pointer;
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const UserName = styled.p`
  font-size: 12px;
  font-weight: bold;
`;

const UserWriteTime = styled.p`
  font-size: 12px;
  color: #888;
`;

const CommentFrame = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
`;

const CommentContents = styled.p`
  font-size: 14px;
  color: #333;
  width: calc(100% - 40px);
`;

const InfoBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  gap: 16px;
  margin-top: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #555;

  img {
    width: 16px;
    height: 16px;
  }
`;

function CommentItem({ comment }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes || 0); // 댓글의 좋아요 수
  const [replyCount] = useState(comment.replies ? comment.replies.length : 0); // 대댓글 수

  const handleLikeClick = () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
    setLikeCount((prevLikeCount) => (isLiked ? prevLikeCount - 1 : prevLikeCount + 1));
  };

  // 작성 시간을 포맷팅하여 표시
  const formattedDate = comment.createdAt
    ? new Date(comment.createdAt.seconds * 1000).toLocaleDateString()
    : "Unknown date";

  return (
    <Wrapper>
      <CommentUserInfo>
        <UserImage src={userIcon} alt="User Icon"/> {/* 회색 원을 기본 이미지로 표시 */}
        <UserTextInfo>
          <UserName>허재호</UserName>
          <UserWriteTime>{formattedDate}</UserWriteTime> {/* 작성 시간 표시 */}
        </UserTextInfo>
        <BalanceUtilFrame>
        <SettingsButton>⋮</SettingsButton>
        </BalanceUtilFrame>
      </CommentUserInfo>

      <CommentFrame>
        <CommentContents>{comment.content}</CommentContents>
      </CommentFrame>

      {/* 좋아요 및 대댓글 정보를 가로로 표시 */}
      <InfoBar>
        <InfoItem onClick={handleLikeClick}>
          <img src={isLiked ? likeActiveIcon : likeIcon} alt="like icon" />
          <span>{likeCount}</span>
        </InfoItem>
        <InfoItem>
          <img src={commentIcon} alt="reply icon" />
          <span>{replyCount}</span>
        </InfoItem>
      </InfoBar>
    </Wrapper>
  );
}

export default CommentItem;
