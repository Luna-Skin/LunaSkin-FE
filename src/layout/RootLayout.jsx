import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import BottomNav from "../components/common/BottomNav";

const HIDE_BOTTOM_NAV_PATHS = [
  "/today-skin/camera",
  "/my/period",
  "/my/skin",
];

const AppFrame = styled.div`
  width: 100%;
  max-width: 402px;
  height: 812px;

  margin: 0 auto;
  display: flex;
  flex-direction: column;

  /* AppFrame 전체는 스크롤되지 않도록 막기 */
  overflow: hidden;

  background: #ffffff;

  position: relative;
`;

const Main = styled.main`
  flex: 1;

  /* flex 자식이 부모 높이 안에서 줄어들 수 있도록 설정 */
  min-height: 0;

  /* 실제 페이지 내용만 스크롤 */
  overflow-y: auto;
  overflow-x: hidden;
`;

export default function RootLayout() {
  const { pathname } = useLocation();

  const hideBottomNav = HIDE_BOTTOM_NAV_PATHS.includes(pathname);

  return (
    <AppFrame>
      <Main>
        <Outlet />
      </Main>

      {!hideBottomNav && <BottomNav />}
    </AppFrame>
  );
}