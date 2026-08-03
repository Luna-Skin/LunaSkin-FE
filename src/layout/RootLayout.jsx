import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/common/BottomNav";

const HIDE_BOTTOM_NAV_PATHS = ["/today-skin/camera", "/my/period", "/my/skin"];

export default function RootLayout() {
  const { pathname } = useLocation();
  const hideBottomNav = HIDE_BOTTOM_NAV_PATHS.includes(pathname);

  return (
    <>
      <main>
        <Outlet />
      </main>
      {!hideBottomNav && <BottomNav />}
    </>
  );
}
