import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMyInfo } from "../../api/userApi";

import shieldIcon from "../../assets/icons/my/my_shield.svg";
import bellIcon from "../../assets/icons/my/my_bell.svg";
import boxIcon from "../../assets/icons/my/my_payment.svg";
import cardIcon from "../../assets/icons/my/my_card.svg";
import personIcon from "../../assets/icons/my/my_person.svg";
import calenderIcon from "../../assets/icons/my/my_calendar.svg";
import lunaIcon from "../../assets/icons/my/my_luna.svg";
import skinIcon from "../../assets/icons/my/my_skin.svg";
import chevronRightIcon from "../../assets/icons/my/my_chevron_right.svg";

const Page = styled.main`
  width: 100%;
  max-width: 402px;
  min-height: 100%;
  padding : 0 24px;
  background: #fff;
`;

const Header = styled.div`
  height: 77px;
  width: 354px;
  padding-top: 24px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Title = styled.h1`
  color: #a876fc;
  font-family: "Pretendard Variable";
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const Profile = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 26px;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  display: grid;
  width: 70px;
  height: 70px;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: #dec4fa;
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
    color: #2c2c2c;
    font-family: "Pretendard Variable";
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  span {
    color: #b3b3b3;
    font-family: "Pretendard Variable";
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    position: relative;
  }
`;

const Badge = styled.span`
  display: flex;
  height: 26px;
  padding: 6px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  background: #dec4fa;
  color: #a876fc;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Section = styled.section`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 8px;
  color: #929292;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const MenuBox = styled.div`
  width: 354px;
  border: 1.5px solid rgba(0, 0, 0, 0.1);
  border-radius: 18px;
  overflow: hidden;
`;

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 354px;
  height: 52px;
  padding: 16px;
  border: 0;
  border-bottom: ${({ $last }) => ($last ? "0" : "1.5px solid rgba(0, 0, 0, 0.10)")};
  background: #fff;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const MenuLabel = styled.span`
  color: #2c2c2c;
  font-family: "Pretendard Variable";
  font-size: 17px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Arrow = styled.img`
  width: 20px;
  height: 20px;
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
      <Header>
        <Title>My</Title>
      </Header>
      <Profile>
        <ProfileContainer>
          <Avatar>
            {profile?.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt="" />
            ) : (
              nameInitial
            )}
          </Avatar>
          <ProfileText>
            <strong>
              {isLoading
                ? "불러오는 중..."
                : `${profile?.name ?? "이름 없음"}님`}
            </strong>
            <span>{isLoading ? "" : (profile?.email ?? "")}</span>
          </ProfileText>
        </ProfileContainer>

        {!isLoading && profile?.isSubscription && (
          <Badge>프리미엄 이용 중</Badge>
        )}
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
                <LabelContainer>
                  <Icon>{item.icon && <img src={item.icon} alt="" />}</Icon>
                  <MenuLabel>{item.label}</MenuLabel>
                </LabelContainer>

                <Arrow src={chevronRightIcon} alt="" />
              </MenuItem>
            ))}
          </MenuBox>
        </Section>
      ))}
    </Page>
  );
}
