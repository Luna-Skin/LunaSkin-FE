import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMySkinInfo, updateMySkinInfo } from "../../api/userApi";

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
  border: 1px solid ${({ $selected }) => ($selected ? "#D9D9D9" : "#e2e2e2")};
  border-radius: 20px;
  background: ${({ $selected }) => ($selected ? "#DEC4FA" : "#fff")};
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
  background: ${({ $enabled }) => ($enabled ? "#A985E7" : "#cfcfcf")};
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: ${({ $enabled }) => ($enabled ? "pointer" : "default")};
`;

export default function SkinInfo() {
  const navigate = useNavigate();

  const [skinTypes, setSkinTypes] = useState([]); // [{ skinTypeId, typeName, isSelected }]
  const [skinConcerns, setSkinConcerns] = useState([]); // [{ skinConcernId, concernName, isSelected }]
  const [isLoading, setIsLoading] = useState(true);

  const [originalTypeId, setOriginalTypeId] = useState(null);
  const [originalConcernIds, setOriginalConcernIds] = useState([]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const res = await getMySkinInfo();
        const data = res.data ?? {};

        const types = data.skinTypes ?? [];
        const concerns = data.skinConcerns ?? [];

        if (isMounted) {
          setSkinTypes(types);
          setSkinConcerns(concerns);
          setOriginalTypeId(types.find((t) => t.isSelected)?.skinTypeId ?? null);
          setOriginalConcernIds(
            concerns.filter((c) => c.isSelected).map((c) => c.skinConcernId),
          );
        }
      } catch (error) {
        console.error("피부 정보를 불러오지 못했습니다.", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedTypeId = skinTypes.find((t) => t.isSelected)?.skinTypeId ?? null;
  const selectedConcernIds = skinConcerns.filter((c) => c.isSelected).map((c) => c.skinConcernId);

  const isChanged =
    selectedTypeId !== originalTypeId ||
    JSON.stringify([...selectedConcernIds].sort()) !==
      JSON.stringify([...originalConcernIds].sort());

  const canSave = isChanged && selectedTypeId != null;

  const selectType = (skinTypeId) => {
    setSkinTypes((current) =>
      current.map((t) => ({ ...t, isSelected: t.skinTypeId === skinTypeId })),
    );
  };

  const toggleConcern = (skinConcernId) => {
    setSkinConcerns((current) =>
      current.map((c) =>
        c.skinConcernId === skinConcernId ? { ...c, isSelected: !c.isSelected } : c,
      ),
    );
  };

  const handleSave = async () => {
    if (!canSave) return;

    try {
      await updateMySkinInfo(selectedTypeId, selectedConcernIds);

      setOriginalTypeId(selectedTypeId);
      setOriginalConcernIds(selectedConcernIds);
      navigate("/my");
    } catch (error) {
      console.error("피부 정보 저장에 실패했습니다.", error);
      alert("저장에 실패했어요. 다시 시도해주세요.");
    }
  };

  if (isLoading) return null;

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
            {skinTypes.map((type) => (
              <Chip
                key={type.skinTypeId}
                type="button"
                $selected={type.isSelected}
                onClick={() => selectType(type.skinTypeId)}
              >
                {type.typeName}
              </Chip>
            ))}
          </ChipList>
        </Section>

        <Section>
          <SectionTitle>피부 고민</SectionTitle>
          <ChipList>
            {skinConcerns.map((concern) => (
              <Chip
                key={concern.skinConcernId}
                type="button"
                $selected={concern.isSelected}
                onClick={() => toggleConcern(concern.skinConcernId)}
              >
                {concern.concernName}
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