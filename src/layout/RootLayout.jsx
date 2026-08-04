import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import BottomNav from "../components/common/BottomNav";

const HIDE_BOTTOM_NAV_PATHS = ["/today-skin/camera", "/my/period", "/my/skin"];

const AppFrame = styled.div`
  max-width: 402px;
  height: 812px;
  overflow-y: auto;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: #ffffff;
`;

const Main = styled.main`
  flex: 1;
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