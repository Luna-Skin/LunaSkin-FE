import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import BottomNav from "../components/common/BottomNav";

const HIDE_BOTTOM_NAV_EXACT_PATHS = ["/today-skin"];

const HIDE_BOTTOM_NAV_PREFIX_PATHS = [
  "/today-skin/camera",
  "/today-skin/compare",
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
  const location = useLocation();
  const { pathname } = location;

  // /today-skin/result/:date는 경로는 똑같아도 "어떻게 들어왔는지"에 따라 다르게 취급..
  const isPastRecordView =
    pathname.startsWith("/today-skin/result") && Boolean(location.state?.showBackHeader);

  const hideBottomNav =
    HIDE_BOTTOM_NAV_EXACT_PATHS.includes(pathname) ||
    HIDE_BOTTOM_NAV_PREFIX_PATHS.some((path) => pathname.startsWith(path)) ||
    isPastRecordView;

  return (
    <AppFrame>
      <Main>
        <Outlet />
      </Main>

      {!hideBottomNav && <BottomNav />}
    </AppFrame>
  );
}