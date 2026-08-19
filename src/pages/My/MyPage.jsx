import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMyInfo } from "../../api/userApi";

import shieldIcon from "../../assets/images/shield.png";
import bellIcon from "../../assets/images/bell.png";
import boxIcon from "../../assets/images/box.png";
import cardIcon from "../../assets/images/card.png";
import personIcon from "../../assets/images/person.png";
import calenderIcon from "../../assets/images/calender.png";
import lunaIcon from "../../assets/images/luna.png";
import skinIcon from "../../assets/images/skin.png";

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
  color: #A876FC;
  text-align: center;
  font-size: 28px;
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
  overflow: hidden;
  border-radius: 50%;
  background: #dcc5ff;
  color: #fff;
  font-size: 22px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileText = styled.div`
  flex: 1;

  strong {
    display: block;
    position: relative;
    top: 4px;
    margin-bottom: 4px;
    color: #333;
    font-size: 14px;
  }

  span {
    color: #aaa;
    font-size: 11px;
    position: relative;
    top: -4px;
  }
`;

const Badge = styled.span`
  padding: 5px 8px;
  border-radius: 10px;
  background: #DEC4FA;
  color: #A876FC;
  font-size: 12px;
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
  font-size: 15px;
  font-weight: 470;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: -7px;
  border-radius: 9px;

  transform: translateX(-9px);

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
      { icon: skinIcon, label: "피부 정보", path: "/my/skin" },
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
      { icon: lunaIcon, label: "루나포인트" },
    ],
  },
];

export default function MyPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const res = await getMyInfo();
        if (isMounted) setProfile(res.data ?? null);
      } catch (error) {
        console.error("유저 정보를 불러오지 못했습니다.", error);
        if (isMounted) setProfile(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const nameInitial = profile?.name ? profile.name.charAt(0) : "?";

  return (
    <Page>
      <Title>My</Title>

      <Profile>
        <Avatar>
          {profile?.profileImageUrl ? (
            <img src={profile.profileImageUrl} alt="" />
          ) : (
            nameInitial
          )}
        </Avatar>
        <ProfileText>
          <strong>{isLoading ? "불러오는 중..." : `${profile?.name ?? "이름 없음"}님`}</strong>
          <span>{isLoading ? "" : profile?.email ?? ""}</span>
        </ProfileText>
        {!isLoading && profile?.isSubscription && <Badge>프리미엄 이용 중</Badge>}
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