import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db, storage } from "../../firebase"; // firebase 설정
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import FixedTop from "../../component/FixedTop";
import Header from "../../component/Header";
import refreshIcon from "../../images/refresh.png";
import closeIcon from "../../images/close.png";
import imageIcon from "../../images/image.png";

// GPT API 설정
const apiKey = process.env.REACT_APP_GPT_API_KEY;
const endpoint = "https://api.openai.com/v1/chat/completions";

// 스타일 컴포넌트
const Wrapper = styled.div`
  width: calc(100%);
  /* height: calc(100%); */
  padding: 0px;
  margin: 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background-color:#fff;

`;

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 48px;
  margin-bottom: 64px;
  overflow-y: auto;
`;

const ToggleContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const ToggleCover = styled.div`
  width: calc(100% - 40px);
  height: 50px;
  position: relative;
  border: 1px solid #eeeeee;
  border-radius: 25px;
  padding: 5px;
`;

const Toggle = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
`;

const ToggleButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => (props.active ? "#FFFFFF" : "#585858")};
  transition: all 0.3s;
  cursor: pointer;
  z-index: 1;
`;

const BlueBar = styled.div`
  position: absolute;
  width: calc(50% - 5px);
  height: 40px;
  border-radius: 25px;
  background-color: #3182f7;
  transition: transform 0.3s;
  transform: ${(props) => (props.active ? "translateX(0)" : "translateX(100%)")};
`;

const PostContentInput = styled.textarea`
  width: calc(100% - 40px);
  min-height: 176px;
  max-height: 360px;
  height: auto;
  padding: 20px 32px;
  font-weight: 500;
  font-size: 500;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  overflow-y: auto;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: calc(100% - 40px);
`;

const TitleText = styled.h3`
  font-size: 16px;
  font-weight: 500;
`;

const TitleTool = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const TitleResult = styled.h3`
  min-height: 42px;
  width: calc(100% - 42px);
  padding: 12px 32px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  font-weight: 500;
  resize: none;
  overflow-y: auto;
`;

const TitleButton = styled.button`
  cursor: pointer;
  background: url(${(props) => props.imageUrl}) no-repeat center;
  background-size: 24px 24px;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 42px;
  height: 42px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: calc(100% - 40px);
`;

const TagText = styled.h3`
  font-size: 16px;
  font-weight: 500;
`;

const TagButton = styled.button`
  background-color: #fff;
  color: #939393;
  border-radius: 999px;
  border: 1px solid #ccc;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
`;

const TagList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
`;

const TagItem = styled.li`
  background-color: #fff;
  color: #7369F4;
  padding: 0px 0px 0px 16px;
  border-radius: 999px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
`;

const DeleteButton = styled.button`
  color: #939393;
  border: none;
  cursor: pointer;
  background: url(${(props) => props.imageUrl}) no-repeat center;
  background-size: 16px 16px;
  width: 40px;
  height: 40px;
`;

const ToolTab = styled.div`
  display: flex;
  width: calc(100%);
  height: 74px;
  padding: 10px 20px 0px 20px;
  gap: 12px;
  position: fixed;
  bottom: 0;
  background-color: white;
`;

const ImageViewer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: calc(100% - 40px);
  margin: 20px 0;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
  
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #3182f7;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ImageButton = styled(Button)`
  background: url(${(props) => props.imageUrl}) no-repeat center;
  background-size: 40px 40px;
  width: 54px;
  height: 54px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const WriteButton = styled(Button)`
  width: calc(100% - 66px);
  height: 54px;
`;

// GPT API 호출 함수
const callGPT = async (prompt, setTitle) => {
  try {
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

    // 응답 데이터에 대한 유효성 검사
    if (data && data.choices && data.choices.length > 0 && data.choices[0].message) {
      const generatedTitle = data.choices[0].message.content?.trim();
      setTitle(generatedTitle);
    } else {
      // 응답이 예상과 다를 때 기본 값 또는 에러 처리
      console.error("응답 데이터에 문제가 있습니다:", data);
      setTitle("제목 생성 실패");
    }
  } catch (error) {
    console.error("GPT API 호출 중 오류 발생:", error);
    setTitle("제목 생성 중 오류 발생");
  }
};


function handleInput(e) {
  e.target.style.height = "auto";
  e.target.style.height = `${Math.min(e.target.scrollHeight, 360)}px`;
}

// 이미지 Firebase Storage에 업로드 함수
const uploadImageToStorage = async (file) => {
  const storageRef = ref(storage, `posts/${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};

// 컴포넌트 함수
function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // 선택한 실제 이미지 파일들
  const [tags, setTags] = useState([]);
  const [postType, setPostType] = useState(1); // 감정적 공감(1), 현실적 조언(2)
  const navigate = useNavigate();

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      const newImageFiles = Array.from(e.target.files); // 실제 파일
      setImages([...images, ...newImages]);
      setImageFiles([...imageFiles, ...newImageFiles]); // 파일 저장
    }
  };

  // 숨겨진 input 파일 클릭 트리거
  const triggerFileInput = () => {
    document.getElementById("imageUploadInput").click();
  };

  // Firestore에 포스트 저장 함수
  const handleSubmit = async () => {
    if (title && content && images.length > 0) {
      try {
        // 이미지가 있을 경우 Storage에 업로드 후 URL 얻기
        const imageUrls = await Promise.all(
          imageFiles.map((file) => uploadImageToStorage(file))
        );

        let userIp = "Unknown"; // 기본 IP 값을 'Unknown'으로 설정

        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          userIp = data.ip; // IP 요청이 성공했을 경우에만 IP 저장
        } catch (error) {
          console.error("Error fetching IP: ", error);
          // IP 요청 실패 시 에러 로그 남기고 계속 진행
        }

        // Firestore에 포스트 저장
        const docRef = await addDoc(collection(db, "posts"), {
          title,
          content,
          tags,
          postType: postType === 1 ? "감정적 공감" : "현실적 조언",
          images: imageUrls, // 업로드된 이미지 URL들
          createdAt: Timestamp.now(), // 작성 시간 기록
          userIp: userIp, // 작성자 IP 기록
        });
        alert("포스트가 작성되었습니다.");
        navigate(`/post/${docRef.id}`, { state: { id: docRef.id } }); // 작성 후 Feed 페이지로 이동
      } catch (error) {
        console.error("Error adding post: ", error);
        alert("포스트 작성 중 오류가 발생했습니다.");
      }
    } else {
      alert("제목, 내용, 이미지를 입력해주세요.");
    }
  };

  const handleGenerateTitle = () => {
    if (content) {
      
      callGPT(
        `다음 내용을 본문에 사용된 언어를 사용하여 띄어쓰기를 포함하여 20 글자보다 적은 하나의 문장으로 요약해줘: ${content}`,
        setTitle
      );
    } else {
      alert("내용을 먼저 입력하세요.");
    }
  };

  const extractTagFromContent = async (content, setTags, existingTags) => {
    const existingTagList = existingTags.join(", ");
    const prompt = `다음 글에서 이미 존재하는 태그(${existingTagList})를 제외한 새로운 핵심 단어를 하나 추출해줘: ${content}`;

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
    const extractedTags = data.choices[0].message.content
      .split(",")
      .map((tag) => tag.trim());

    const firstTag = extractedTags[0];
    if (firstTag && !existingTags.includes(firstTag)) {
      setTags((prevTags) => [...prevTags, firstTag]);
    }
  };

  const handleAddTag = async () => {
    if (content) {
      await extractTagFromContent(content, setTags, tags);
    } else {
      alert("내용을 먼저 입력하세요.");
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <Wrapper>
      <FixedTop/>
      <Container>
        <Header backLink="/" headerTitle="당신의 이야기를 들려주세요." />

        {/* ToggleTab Section */}
        <ToggleContainer>
          <ToggleCover>
            <BlueBar active={postType === 1} />
            <Toggle>
              <ToggleButton
                active={postType === 1}
                onClick={() => setPostType(1)}
              >
                감정적 공감
              </ToggleButton>
              <ToggleButton
                active={postType === 2}
                onClick={() => setPostType(2)}
              >
                현실적 조언
              </ToggleButton>
            </Toggle>
          </ToggleCover>
        </ToggleContainer>

        {/* Post Content Section */}
        <PostContentInput
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onInput={handleInput}
        />

        {/* Title Section */}
        <TitleContainer>
          <TitleText>제목</TitleText>
          <TitleTool>
            <TitleResult>
              {title ? `${title}` : "제목을 생성해주세요"}
            </TitleResult>
            <TitleButton
              onClick={handleGenerateTitle}
              imageUrl={refreshIcon}
            ></TitleButton>
          </TitleTool>
        </TitleContainer>

        {/* Tag Section */}
        <TagContainer>
          <TagText>태그</TagText>
          <TagButton onClick={handleAddTag}>태그 생성하기</TagButton>
          <TagList>
            {tags.map((tag) => (
              <TagItem key={tag}>
                {tag}
                <DeleteButton
                  onClick={() => handleDeleteTag(tag)}
                  imageUrl={closeIcon}
                ></DeleteButton>
              </TagItem>
            ))}
          </TagList>
        </TagContainer>
        <ImageViewer>
          {images.map((image, index) => (
            <PreviewImage key={index} src={image} alt={`Preview ${index}`} />
          ))}
        </ImageViewer>
      </Container>

      {/* ToolTab Section */}
      <ToolTab>
        <ImageButton
          type="button"
          imageUrl={imageIcon}
          onClick={triggerFileInput}
        />
        <HiddenFileInput
          id="imageUploadInput"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <WriteButton onClick={handleSubmit}>이야기 나누기</WriteButton>
      </ToolTab>
    </Wrapper>
  );
}

export default CreatePostPage;
