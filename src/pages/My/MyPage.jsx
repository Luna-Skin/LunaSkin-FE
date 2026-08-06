import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Page = styled.main`
  width: 100%;
  max-width: 402px;
  min-height: calc(100dvh - 60px);
  margin: 0 auto;
  padding: 58px 22px 30px;
  background: #fff;
`;

const Title = styled.h1`
  margin-bottom: 18px;
  color: #9b6dff;
  text-align: center;
  font-size: 24px;
`;

const Profile = styled.section`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 26px;
`;

const Avatar = styled.div`
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border-radius: 50%;
  background: #dcc5ff;
  color: #fff;
  font-size: 22px;
`;

const ProfileText = styled.div`
  flex: 1;

  strong {
    display: block;
    margin-bottom: 4px;
    color: #333;
    font-size: 14px;
  }

  span {
    color: #aaa;
    font-size: 11px;
  }
`;

const Badge = styled.span`
  padding: 5px 8px;
  border-radius: 10px;
  background: #eee3ff;
  color: #a47af5;
  font-size: 10px;
`;

const Section = styled.section`
  margin-top: 20px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 8px;
  color: #999;
  font-size: 11px;
  font-weight: 500;
`;

const MenuBox = styled.div`
  overflow: hidden;
  border: 1px solid #e8e5eb;
  border-radius: 13px;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 13px 12px;
  border: 0;
  border-bottom: ${({ $last }) => ($last ? "0" : "1px solid #eee")};
  background: #fff;
  color: #444;
  text-align: left;
  font-size: 13px;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

const Icon = styled.span`
  width: 22px;
  color: #9b6dff;
  font-size: 16px;
`;

const MenuLabel = styled.span`
  flex: 1;
`;

const Arrow = styled.span`
  color: #c8c3cf;
  font-size: 20px;
`;

const MENU_GROUPS = [
  {
    title: "계정 관리",
    items: [
      { icon: "♙", label: "내 정보" },
      { icon: "▣", label: "생리 정보", path: "/my/period" },
      { icon: "♙", label: "피부 정보", path: "/my/skin" },
    ],
  },
  {
    title: "계정 관리",
    items: [
      { icon: "♧", label: "알림 설정" },
      { icon: "♢", label: "개인정보 보호" },
    ],
  },
  {
    title: "요금제",
    items: [
      { icon: "▭", label: "구독 관리" },
      { icon: "◇", label: "결제 내역" },
    ],
  },
];

export default function MyPage() {
  const navigate = useNavigate();

  return (
    <Page>
      <Title>My</Title>

      <Profile>
        <Avatar>김</Avatar>
        <ProfileText>
          <strong>김끼끼님</strong>
          <span>77l77l@naver.com</span>
        </ProfileText>
        <Badge>프리미엄 이용 중</Badge>
      </Profile>

      {MENU_GROUPS.map((group) => (
        <Section key={group.title + group.items[0].label}>
          <SectionTitle>{group.title}</SectionTitle>

          <MenuBox>
            {group.items.map((item, index) => (
              <MenuItem
                key={item.label}
                type="button"
                $clickable={Boolean(item.path)}
                $last={index === group.items.length - 1}
                onClick={() => item.path && navigate(item.path)}
              >
                <Icon>{item.icon}</Icon>
                <MenuLabel>{item.label}</MenuLabel>
                <Arrow>›</Arrow>
              </MenuItem>
            ))}
          </MenuBox>
        </Section>
      ))}
    </Page>
  );
}