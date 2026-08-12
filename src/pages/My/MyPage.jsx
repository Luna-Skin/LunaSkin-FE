import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import shieldIcon from "../../assets/images/shield.png";
import bellIcon from "../../assets/images/bell.png";
import boxIcon from "../../assets/images/box.png";
import cardIcon from "../../assets/images/card.png";
import personIcon from "../../assets/images/person.png";
import calenderIcon from "../../assets/images/calender.png";

const Page = styled.main`
  width: 100%;
  max-width: 402px;
  min-height: 100%;
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
  padding: 9px 15px;
  border: 0;
  border-bottom: ${({ $last }) => ($last ? "0" : "1px solid #eee")};
  background: #fff;
  color: #444;
  text-align: left;
  font-size: 13px;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 10px;
  border-radius: 9px;

  img {
    width: 18px;
    height: 18px;
  }
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
      { icon: personIcon, label: "내 정보" },
      { icon: calenderIcon, label: "생리 정보", path: "/my/period" },
      { icon: personIcon, label: "피부 정보", path: "/my/skin" },
    ],
  },
  {
    title: "계정 관리",
    items: [
      { icon: bellIcon, label: "알림 설정" },
      { icon: shieldIcon, label: "개인정보 보호" },
    ],
  },
  {
    title: "요금제",
    items: [
      { icon: cardIcon, label: "구독 관리" },
      { icon: boxIcon, label: "결제 내역" },
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
                <Icon>
                  {item.icon && <img src={item.icon} alt="" />}
                </Icon>
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