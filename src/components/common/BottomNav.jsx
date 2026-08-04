import { NavLink } from "react-router-dom";
import styled from "styled-components";

import HomeIcon from "./icons/HomeIcon";
import TodaySkinIcon from "./icons/TodaySkinIcon";
import InsightIcon from "./icons/InsightIcon";
import ChatIcon from "./icons/ChatIcon";
import MyIcon from "./icons/MyIcon";

const ACTIVE_COLOR = "#7C3AED";
const INACTIVE_COLOR = "#A6A6A6";

const TABS = [
  { label: "홈", path: "/", end: true, Icon: HomeIcon },
  { label: "투데이 스킨", path: "/today-skin", Icon: TodaySkinIcon },
  { label: "인사이트", path: "/insight", Icon: InsightIcon },
  { label: "챗봇", path: "/chat", Icon: ChatIcon },
  { label: "마이", path: "/my", Icon: MyIcon },
];

const Nav = styled.nav`
  position: sticky;
  bottom: 0;
  z-index: 10;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
`;

const TabBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 383px;
  height: 36px;
`;

const TabLink = styled(NavLink)`
  width: 67px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
`;

const Label = styled.span`
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  color: ${({ $active }) => ($active ? ACTIVE_COLOR : INACTIVE_COLOR)};
`;

export default function BottomNav() {
  return (
    <Nav>
      <TabBox>
        {TABS.map(({ label, path, end, Icon }) => (
          <TabLink key={path} to={path} end={end}>
            {({ isActive }) => (
              <>
                <Icon color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR} />
                <Label $active={isActive}>{label}</Label>
              </>
            )}
          </TabLink>
        ))}
      </TabBox>
    </Nav>
  );
}