/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faClose,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";

const MENU_LIST = [
  {
    index: 0,
    name: "Home",
    pathname: "/",
    isOpen: false,
    subMenuList: [],
  },
  {
    index: 1,
    name: "About",
    pathname: "",
    isOpen: false,
    subMenuList: [
      {
        index: 0,
        name: "Intro",
        pathname: "/about/intro",
      },
      {
        index: 1,
        name: "Privacy",
        pathname: "/about/privacy",
      },
      {
        index: 2,
        name: "Terms",
        pathname: "/about/terms",
      },
    ],
  },
  {
    index: 2,
    name: "More",
    pathname: "",
    isOpen: false,
    subMenuList: [
      {
        index: 0,
        name: "신상",
        pathname: "/more/new",
      },
      {
        index: 1,
        name: "인기",
        pathname: "/more/popular",
      },
      {
        index: 2,
        name: "상의",
        pathname: "/more/top",
      },
      {
        index: 3,
        name: "아우터",
        pathname: "/more/outer",
      },
      {
        index: 4,
        name: "바지",
        pathname: "/more/pants",
      },
      {
        index: 5,
        name: "신발",
        pathname: "/more/shoes",
      },
    ],
  },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 사이드바 오픈 여부
  const [activeIdx, setActiveIdx] = useState(null); // 선택 된 서브메뉴 index
  const sidebarRef = useRef(null); // 사이드바 엘레먼트를 담고 있는 레퍼런스
  const location = useLocation();

  /**
   * @desc 사이드바 여부에 따른 애니메이션 동작
   */
  useEffect(() => {
    // 렌더링 완료 후 동작
    if (isMenuOpen) {
      gsap.to(sidebarRef.current, {
        x: "0%",
        duration: 0.5,
        display: "block",
      });
    } else {
      gsap.to(sidebarRef.current, {
        x: "-100%",
        duration: 0.5,
        display: "none",
      });
    }
  }, [isMenuOpen]);

  /**
   * @desc 바깥 영역 클릭 시 사이드바 닫음
   */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // 사이드바 엘레먼트가 ref로 지정되어있고
      // 사이드바 부모와 자식요소를 제외 한 다른 엘레먼트를 클릭,
      // 서브메뉴가 열려 있으면, 동작
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isMenuOpen
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen, activeIdx]);

  /**
   * @desc pathname이 변경 될 때마다 사이드바를 닫음.
   */
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  /**
   * @desc 사이드바 열고/닫기
   */
  const toggleSidebar = () => {
    setIsMenuOpen(!isMenuOpen); // 사이드바 토글
  };

  /**
   * @desc 사이드바 닫으면서 메뉴목록도 초기화 시킴.
   */
  const closeSidebar = () => {
    // const allUlElements = document.querySelectorAll(".sub");
    const sidebarElement = sidebarRef.current;

    // 모든 서브메뉴를 닫음
    otherCloseSubMenu()
    // 사이드바를 닫음
    gsap.to(sidebarElement, {
      x: "-100%",
      duration: 0.5,
      ease: "power2.easeOut",
      onComplete: () => {
        sidebarElement.style.display = "none";
        setActiveIdx(null);
        setIsMenuOpen(false);
      },
    });
  };

  /**
   * @desc 서브메뉴 펼치기/접기
   */
  const toggleAccordion = (e, index) => {
    e.stopPropagation();

    if (activeIdx === index) {
      setActiveIdx(null);
      closeSubMenu();
    } else {
      setActiveIdx(index);
      openSubMenu(index);
    }
  };

  /**
   * @desc 서브메뉴를 오픈하는 함수
   * @param {*} index
   */
  const openSubMenu = (index) => {
    // 서브메뉴
    const ulElement = document.getElementById(`sub_${index}`);
    
    otherCloseSubMenu();

    // 선택 된 서브메뉴를 오픈함.
    gsap.set(ulElement, { display: "block" });
    gsap.to(ulElement, {
      opacity: 1,
      maxHeight: ulElement.scrollHeight + "px",
      duration: 0.5,
      ease: "power2.easeInOut",
    });
  };

  const otherCloseSubMenu = () => {
    const otherElement = document.getElementById(`sub_${activeIdx}`);
    console.log('otherElement ', otherElement)
    if (otherElement) {
      gsap.to(otherElement, {
        opacity: 0,
        maxHeight: 0,
        duration: 0.5,
        ease: "power2.easeOut",
        onComplete: () => {
          otherElement.style.display = "none";
        },
      });
    }
  }

  /**
   * @desc 같은 서브메뉴 선택 시 서브메뉴를 닫는 함수
   */
  const closeSubMenu = () => {
    if (activeIdx !== null) {
      const ulElement = document.getElementById(`sub_${activeIdx}`);
      gsap.to(ulElement, {
        opacity: 0,
        maxHeight: 0,
        duration: 0.5,
        ease: "power2.easeOut",
        onComplete: () => {
          ulElement.style.display = "none";
          setActiveIdx(null);
        },
      });
    }
  };

  return (
    <header className="header">
      <div className="menu">
        <button className="menu-btn" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} size={"2xl"} />
        </button>
        <div className={`menu-content`} ref={sidebarRef}>
          <div className="menu-header">
            <span>Menu List</span>
            <button className="menu-btn close" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faClose} size={"2xl"} />
            </button>
          </div>
          <nav>
          <ul className="menu-list">
            {
              MENU_LIST.map((menu) => (
                <li key={menu.index} className="sub_li">
                  {menu.subMenuList.length < 1 ?
                      <Link className="parent" to={menu.pathname}>
                        <div>
                          <span>{menu.name}</span>
                        </div>
                      </Link>
                    :
                      <>
                        <button
                          className="parent"
                          onClick={(e) => toggleAccordion(e, menu.index)}
                        >
                          <span>{menu.name}</span>
                          <FontAwesomeIcon
                            icon={activeIdx === menu.index ? faMinus : faPlus}
                            size={"sm"}
                          />
                        </button>

                        <ul className="sub" id={`sub_${menu.index}`}>
                          {
                            menu.subMenuList.map((subMenu) => (
                              <li key={subMenu.index}>
                                <Link to={subMenu.pathname}>{subMenu.name}</Link>
                              </li>
                            ))
                          }
                        </ul>
                      </>
                    }
                  </li>
                ))
              }
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
