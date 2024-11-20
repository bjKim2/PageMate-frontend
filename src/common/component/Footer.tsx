import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconPostAdd from "../../assets/images/icon-add_white.png";
import iconSearch from "../../assets/images/icon-search_white.png";
import iconHome from "../../assets/images/icon-home_white.png";
import iconMypage from "../../assets/images/icon-mypage_white.png";
import iconMenu from "../../assets/images/icon-menu_white.png";
import "../style/common.style.css";
import Dialog from "../../components/dialog";
import styled from "styled-components";

const ActionButton = styled.div`
  padding: 9px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background: #e2e6ea;
  }
`;

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogPosition, setDialogPosition] = useState({ top: "50%", left: "50%" });

  const handleMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect(); // 버튼의 크기와 위치
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

  return (
    <>
      {/* desktop 사이드바 footer */}
      <div className="sidebar">
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          top={dialogPosition.top}
          left={dialogPosition.left}
        >
          <ActionButton>로그아웃</ActionButton>
        </Dialog>
        {/* 상단 버튼들 */}
        <div className="top-buttons">
          <button className="icon-button" onClick={() => navigate("/")}>
            <img src={iconHome} alt="Home" />
          </button>
          <button className="icon-button" onClick={() => navigate("/search")}>
            <img src={iconSearch} alt="Search" />
          </button>
          <button
            className="icon-button"
            onClick={() => navigate("/post/write")}
          >
            <img src={iconPostAdd} alt="Add Post" />
          </button>
          <button className="icon-button" onClick={() => navigate("/mypage")}>
            <img src={iconMypage} alt="My Page" />
          </button>
        </div>

        {/* 하단 햄버거 버튼 */}
        <div onClick={handleMenu} className="bottom-button">
          <button className="icon-button">
            <img src={iconMenu} alt="Menu" />
          </button>
        </div>
      </div>

      {/* mobile 하단 footer */}
      <div className="mobile-footer">
        <button className="mobile-icon-button" onClick={() => navigate("/")}>
          <img src={iconHome} alt="Home" />
        </button>
        <button
          className="mobile-icon-button"
          onClick={() => navigate("/post/write")}
        >
          <img src={iconPostAdd} alt="Add Post" />
        </button>
        <button
          className="mobile-icon-button"
          onClick={() => navigate("/mypage")}
        >
          <img src={iconMypage} alt="My Page" />
        </button>
      </div>
    </>
  );
};

export default Footer;
