import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-inline: 20px;
  padding-block: 12px;
  background-color: #ffffff;

  &:last-child {
    margin-bottom: 114px;
  }
`;

const PostHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TitleText = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #333333;
`;

const UserImgBox = styled.div`
  width: 20px;
  height: 20px;
  overflow: hidden;
  position: relative;
  border-radius: 10px;
  margin-block: 10px;
`;

const UserImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const UserNameText = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #333333;
`;

const DateText = styled.p`
  font-size: 12px;
  font-weight: bold;
  color: #666666;
`;

const PostImgBox = styled.div`
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  margin-block: 10px;
`;

const PostImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  text-align: center;
`;

const DecoIcon = styled(Icon)`
  margin-left: auto;
`;

function PostItem({ post, onClick }) {
  return (
    <Wrapper onClick={onClick}>
      <PostHeader>
        <UserImgBox>
          <UserImg src="/sampleImg1.png" alt="user profile" />
        </UserImgBox>
        <UserNameText>김리뷰</UserNameText>
        {post.month < 10 && (
          <DateText>
            {post.year}.0{post.month}.{post.day}
          </DateText>
        )}
        {post.month >= 10 && (
          <DateText>
            {post.year}.{post.month}.{post.day}
          </DateText>
        )}
        <DecoIcon src="/decoButton.png" alt="deco button" />
      </PostHeader>
      <TitleText>{post.title} ···</TitleText>
      <PostImgBox>
        {typeof post.postImage === "string" && <PostImg src={post.postImage} alt="post" />}
        {Array.isArray(post.postImage) && <PostImg src={post.postImage[0]} alt="post" />}
      </PostImgBox>
    </Wrapper>
  );
}

export default PostItem;
