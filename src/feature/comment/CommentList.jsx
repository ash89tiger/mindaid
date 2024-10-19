import React from "react";
import styled from "styled-components";
import CommentItem from "../comment/CommentItem"; // 경로 수정

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 12px 0px 8px 0px;
  margin-bottom: 12px;
`;

function CommentList({ postInfo = {}, comments = [] }) { // 기본값 설정
  return (
    <Wrapper>
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} postInfo={postInfo} />
      ))}
    </Wrapper>
  );
}


export default CommentList;
