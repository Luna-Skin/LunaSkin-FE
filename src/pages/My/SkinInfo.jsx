import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const STORAGE_KEY = "lunaSkinProfile";

const Page = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 402px;
  min-height: calc(100dvh - 60px);
  margin: 0 auto;
  background: #fff;
`;

const Header = styled.header`
  position: relative;
  padding: 20px 16px 14px;
  border-bottom: 1px solid #eee;
  text-align: center;

  h1 {
    font-size: 16px;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  border: 0;
  background: transparent;
  color: #555;
  font-size: 28px;
  cursor: pointer;
`;

const Content = styled.section`
  padding: 20px 22px;
`;

const Section = styled.section`
  margin-bottom: 42px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 12px;
  color: #333;
  font-size: 14px;
`;

const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
  padding: 6px 14px;
  border: 1px solid ${({ $selected }) => ($selected ? "#D5BAFF" : "#e2e2e2")};
  border-radius: 20px;
  background: ${({ $selected }) => ($selected ? "#DEC7FF" : "#fff")};
  color: #444;
  font-size: 12px;
  cursor: pointer;
`;

const SaveArea = styled.div`
  margin-top: auto;
  padding: 16px;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 15px;
  border: 0;
  border-radius: 12px;
  background: ${({ $enabled }) => ($enabled ? "#9B6DFF" : "#cfcfcf")};
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: ${({ $enabled }) => ($enabled ? "pointer" : "default")};
`;

const DEFAULT_PROFILE = {
  skinType: "",
  concerns: [],
};

const SKIN_TYPES = ["지성", "건성", "복합성", "민감성", "약건성", "트러블성"];

const SKIN_CONCERNS = [
  "여드름",
  "홍조",
  "건조함",
  "블랙헤드",
  "착색함",
  "잡티",
  "탄력",
  "주름",
];

export default function SkinInfo() {
  const navigate = useNavigate();

  const savedProfile = JSON.parse(
    window.localStorage.getItem(STORAGE_KEY) ||
      JSON.stringify(DEFAULT_PROFILE),
  );

  const [profile, setProfile] = useState(savedProfile);
  const [originalProfile, setOriginalProfile] = useState(savedProfile);

  const isChanged =
    profile.skinType !== originalProfile.skinType ||
    JSON.stringify(profile.concerns) !== JSON.stringify(originalProfile.concerns);

  const canSave = isChanged && profile.skinType;

  const toggleConcern = (concern) => {
    setProfile((current) => ({
      ...current,
      concerns: current.concerns.includes(concern)
        ? current.concerns.filter((item) => item !== concern)
        : [...current.concerns, concern],
    }));
  };

  const handleSave = () => {
    if (!canSave) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setOriginalProfile(profile);
    navigate("/my");
  };

  return (
    <Page>
      <Header>
        <BackButton type="button" onClick={() => navigate("/my")}>
          ‹
        </BackButton>
        <h1>피부 정보</h1>
      </Header>

      <Content>
        <Section>
          <SectionTitle>피부 타입</SectionTitle>
          <ChipList>
            {SKIN_TYPES.map((type) => (
              <Chip
                key={type}
                type="button"
                $selected={profile.skinType === type}
                onClick={() =>
                  setProfile((current) => ({ ...current, skinType: type }))
                }
              >
                {type}
              </Chip>
            ))}
          </ChipList>
        </Section>

        <Section>
          <SectionTitle>피부 고민</SectionTitle>
          <ChipList>
            {SKIN_CONCERNS.map((concern) => (
              <Chip
                key={concern}
                type="button"
                $selected={profile.concerns.includes(concern)}
                onClick={() => toggleConcern(concern)}
              >
                {concern}
              </Chip>
            ))}
          </ChipList>
        </Section>
      </Content>

      <SaveArea>
        <SaveButton type="button" $enabled={canSave} onClick={handleSave}>
          저장
        </SaveButton>
      </SaveArea>
    </Page>
  );
}