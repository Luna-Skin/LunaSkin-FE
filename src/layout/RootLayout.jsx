import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import BottomNav from "../components/common/BottomNav";

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

  overflow: hidden;

  background: #ffffff;

  position: relative;
`;

const Main = styled.main`
  flex: 1;
  min-height: 0;

  overflow-y: auto;
  overflow-x: hidden;
`;

export default function RootLayout() {
  const location = useLocation();
  const { pathname } = location;

  // 홈 캘린더에서 과거 피부 기록을 보러 들어온 경우
  const isPastRecordView =
    pathname.startsWith("/today-skin/result") &&
    Boolean(location.state?.showBackHeader);

  const hideBottomNav =
    HIDE_BOTTOM_NAV_PREFIX_PATHS.some((path) =>
      pathname.startsWith(path)
    ) || isPastRecordView;

  return (
    <AppFrame>
      <Main>
        <Outlet />
      </Main>

      {!hideBottomNav && <BottomNav />}
    </AppFrame>
  );
}