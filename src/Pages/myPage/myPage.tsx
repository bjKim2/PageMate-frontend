import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ReactComponent as ModifyIcon } from "../../assets/images/icon-more-vertical.svg";
import ProfileIcon from "../../assets/images/icon-user.png";
import PostComponent from "../../components/post";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../features/store";
import { getLikedPost, getMyPost } from "../../features/post/postsSlice";
import { Post } from "../../features/post/postsSlice";
import {
  uploadProfile,
  deleteUser,
  updateName,
} from "../../features/user/userSlice";
import Dialog from "../../components/dialog";
import CloudinaryUploadWidget from "../../utils/CloudinaryUploadWidget";
import { useNavigate } from "react-router-dom";
import NicknameModal from "./component/NicknameModal";


const formatDate = (dateString?: string): string => {
  if (!dateString) return ""; 

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
      return "유효하지 않은 날짜"; 
  }
  return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
  }).format(date);
};


const Container = styled.div`
  max-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: scroll;

  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
`;
const MyPageArea = styled.div`
  width: 960px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProfileArea = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  margin-top: 20px;
`;
const Photo = styled.div<{ imageUrl: string }>`
  margin-left: 10%;
  height: 120px;
  width: 120px;
  border-radius: 120px;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;
const Info = styled.div`
  width: calc(90% - 120px);
  margin-right: 10%;
  padding-left: 20px;
  height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const UserArea = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
const UserName = styled.div`
  font-size: 40px;
  font-weight: 500;
`;
const Modify = styled.div`
  display: flex;
  align-items: center;
`;
const Bnt = styled.button`
  padding: 0;
  height: 40px;
  width: 40px;
  border: none;
  background-color: transparent;
`;
const Summary = styled.div`
  display: flex;

  @media (max-width: 690px) {
    display: block;
  }
`;
const SummaryInfo = styled.div`
  margin-right: 10px;
  color: #014421;
  font-size: 24px;
  font-weight: 700;
`;
const PostArea = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Filter = styled.div`
  width: 80%;
  margin: 0 10% 0 10%;
  height: 40px;
`;
const FilterBtn = styled.button<{ highlight: boolean }>`
  height: 100%;
  width: 130px;
  border: none;
  color: ${(props) => (props.highlight ? "white" : "black")};
  background-color: ${(props) => (props.highlight ? "#014421" : "#ffffff")};
  border-radius: 5px;
  border: 1px solid #d9d9d9;
`;
const Posts = styled.div`
  padding-top: 20px;
  width: 80%;
  min-height: 100px;
`;
const ActionButton = styled.div`
  padding: 9px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background: #e2e6ea;
  }
`;
const NoPost = styled.div`
  font-size: 28px;
  font-weight: 600;
`;

const MyPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.user);
  const { myPosts, myLiked } = useSelector((state: RootState) => state.posts);
  const [highlight, setHighlight] = useState<boolean>(true);
  const [posts, setPost] = useState<Post[]>([]);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(
    null
  ); // 열려 있는 댓글 영역의 포스트 ID

  const [dialogPosition, setDialogPosition] = useState({
    top: "50%",
    left: "50%",
  });

  const handleMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dialogWidth = 170; // 다이얼로그 예상 너비
    const dialogHeight = 150; // 다이얼로그 예상 높이

    // 화면 크기
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 기본 위치 (버튼의 우측 하단)
    let top = rect.bottom + window.scrollY;
    let left = rect.right + window.scrollX;

    // 다이얼로그가 화면 밖으로 나가지 않도록 조정
    if (left + dialogWidth > viewportWidth) {
      left = rect.right - dialogWidth; // 우측 공간 부족 시 왼쪽으로 이동
    }
    if (top + dialogHeight > viewportHeight) {
      top = rect.bottom - dialogHeight; // 하단 공간 부족 시 위로 이동
    }

    setDialogPosition({ top: `${top}px`, left: `${left}px` });
    setIsDialogOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      await dispatch(deleteUser()).unwrap(); // unwrap()으로 성공 확인
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      alert(`회원 탈퇴 실패: ${error}`);
    }
  };
  const handleOpenNicknameModal = () => {
    setIsNicknameModalOpen(true);
    setIsDialogOpen(false);
  };

  const handleCloseNicknameModal = () => {
    setIsNicknameModalOpen(false);
  };
  const handleUpdateName = async (newName: any) => {
    try {
      await dispatch(updateName(newName)).unwrap(); // unwrap()으로 성공 확인
      alert("닉네임 변경이 완료되었습니다.");
    } catch (error) {
      alert(`닉네임 변경 실패: ${error}`);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    dispatch(getMyPost());
    dispatch(getLikedPost());
  }, [dispatch, user]);

  useEffect(() => {
    setPost(myPosts);
  }, [myPosts]);

  const handleProfileUpdate = async (url: string) => {
    await dispatch(uploadProfile({ profilePhoto: url }));
    setIsDialogOpen(false); // 다이얼로그 닫기
  };

  const handleProfileDelete = async () => {
    try {
      await dispatch(uploadProfile({ profilePhoto: "delete" }));
      setIsDialogOpen(false);
      alert("삭제되었습니다.");
    } catch (error: any) {
      alert("잠시 후 다시 시도해주세요");
    }
  };
  const handleBtn = (event: any) => {
    event.preventDefault();

    const { id } = event.target;

    if (id === "my") {
      setHighlight(true);
      setPost(myPosts);
    } else {
      setHighlight(false);
      setPost(myLiked);
    }
  };
  const handleCommentToggle = (postId: string) => {
    // 같은 포스트 클릭 시 닫고, 다른 포스트 클릭 시 열기
    setActiveCommentPostId((prevId) => (prevId === postId ? null : postId));
  };
  return (
    <Container>
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        top={dialogPosition.top}
        left={dialogPosition.left}
      >
        <ActionButton onClick={handleOpenNicknameModal}>
          닉네임 수정
        </ActionButton>
        <CloudinaryUploadWidget uploadImage={handleProfileUpdate} />
        <ActionButton onClick={handleProfileDelete}>프로필 삭제</ActionButton>
        <ActionButton onClick={handleDeleteUser}>회원탈퇴</ActionButton>
      </Dialog>
      <MyPageArea>
        <ProfileArea>
          <Photo
            imageUrl={user?.profilePhoto ? user?.profilePhoto : ProfileIcon}
          ></Photo>
          <Info>
            <UserArea>
              <UserName>{user?.name || "unknown"}</UserName>
              <Modify>
                <Bnt onClick={handleMenu}>
                  <ModifyIcon />
                </Bnt>
              </Modify>
            </UserArea>
            <Summary>
              <SummaryInfo>내 게시글 {myPosts?.length || 0}개</SummaryInfo>
              <SummaryInfo>내 좋아요 {myLiked?.length || 0}개</SummaryInfo>
            </Summary>
          </Info>
        </ProfileArea>
        <PostArea>
          <Filter>
            <FilterBtn id="my" highlight={highlight} onClick={handleBtn}>
              내 게시글
            </FilterBtn>
            <FilterBtn highlight={!highlight} onClick={handleBtn}>
              좋아요 게시글
            </FilterBtn>
          </Filter>
          <Posts>
            {posts?.length > 0 ? (
              posts.map((post) => (
                <PostComponent
                id={post.id}
                _id={post._id}
                key={post._id}
                userId={post.userId}
                bookTitle={post.bookTitle}
                bookAuthor={post.bookAuthor}
                title={post.title}
                text={post.text}
                date={formatDate(post.date)}
                name={post.name}
                profilePhoto={post.profilePhoto}
                likes={post.likes}
                comments={post.comments}
                isCommentVisible={activeCommentPostId === post._id} // 댓글 영역이 열려 있는지 여부 전달
                onCommentToggle={handleCommentToggle} // 댓글 토글 핸들러 전달
                  isMyPage={true}
                />
              ))
            ) : (
              <NoPost>게시글이 없습니다.</NoPost>
            )}
          </Posts>
        </PostArea>
      </MyPageArea>
      <NicknameModal
        isOpen={isNicknameModalOpen}
        onClose={handleCloseNicknameModal}
        onConfirm={handleUpdateName}
      />
    </Container>
  );
};

export default MyPage;
