import React from "react";
import styled from "styled-components";
import PostItem from "../post/PostItem";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background-color: #f2f2f2;
`;

function PostList({ storePosts, posts, onClickItem }) {
  const postData = [];

  if (posts && Object.keys(posts).length > 0) {
    posts.forEach((item) => {
      item.stores?.forEach((store) => {
        store.posts?.forEach((post) => {
          postData.push(post);
        });
      });
    });
  }

  return (
    <Wrapper>
      {storePosts
        ? storePosts.map((post) => (
            <PostItem key={post.id} post={post} onClick={() => onClickItem(post)} />
          ))
        : postData.map((post) => (
            <PostItem key={post.id} post={post} onClick={() => onClickItem(post)} />
          ))}
    </Wrapper>
  );
}

export default PostList;
