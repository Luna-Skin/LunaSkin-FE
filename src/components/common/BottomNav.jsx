// 하단 탭 내비게이션
import { NavLink } from "react-router-dom";

const TABS = [
  { label: "홈", path: "/" },
  { label: "투데이 스킨", path: "/today-skin" },
  { label: "인사이트", path: "/insight" },
  { label: "챗봇", path: "/chat" },
  { label: "마이", path: "/my" },
];

export default function BottomNav() {
  return (
    <nav>
      {TABS.map((tab) => (
        <NavLink key={tab.path} to={tab.path}>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}