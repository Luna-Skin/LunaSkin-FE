import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMySkinInfo, updateMySkinInfo } from "../../api/userApi";
import backIcon from "../../assets/icons/my/back-chevron.svg";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background: #fff;
`;

const Header = styled.header`
  width: 402px;
  height: 56px;
  border-bottom: 1px solid #d9d9d9;
  padding: 15px 8px;
  display: flex;
  gap: 130px;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.p`
  color: #2d2d2d;
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const BackButton = styled.button`

  display: flex;
  justify-content: center;
  align-items:center;
  width: 26px;
  height: 26px;

  border : none;
  background: transparent;
  cursor: pointer;
`;

const BackIcon = styled.img`
  width: 26px;
  height: 26px;
`;

const Content = styled.section`
  margin: 0 auto;
`;

const Section = styled.section`
  margin-bottom: 83px;
  width: 354px;
`;

const SectionTitle = styled.h2`
  color: #2d2d2d;
  font-family: "Pretendard Variable";
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin-bottom: 12px;
`;

const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button`
  width: 80px;
  height: 33px;
  padding-top: 9px;
  padding-bottom: 9px;
  border: 1px solid #d9d9d9;
  border-radius: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $selected }) => ($selected ? "#DEC4FA" : "#fff")};
  color: #2d2d2d;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  cursor: pointer;
`;

const SaveButton = styled.button`
  display: flex;
  width: 354px;
  height: 43px;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: 18px;
  background: ${({ $enabled }) => ($enabled ? "#A985E7" : "#cfcfcf")};
  color: #fff;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  cursor: ${({ $enabled }) => ($enabled ? "pointer" : "default")};
  margin: 0 auto;

  margin-top: 249px;
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
          setOriginalTypeId(
            types.find((t) => t.isSelected)?.skinTypeId ?? null,
          );
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

  const selectedTypeId =
    skinTypes.find((t) => t.isSelected)?.skinTypeId ?? null;
  const selectedConcernIds = skinConcerns
    .filter((c) => c.isSelected)
    .map((c) => c.skinConcernId);

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
        c.skinConcernId === skinConcernId
          ? { ...c, isSelected: !c.isSelected }
          : c,
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
          <BackIcon src={backIcon} alt="" />
        </BackButton>
        <Title>피부 정보</Title>
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

      <SaveButton type="button" $enabled={canSave} onClick={handleSave}>
        저장
      </SaveButton>
    </Page>
  );
}
