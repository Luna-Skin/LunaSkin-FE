import styled from "styled-components";
import checkIcon from "../../assets/icons/photo_checklist_check.svg";

const MIN_SHEET_HEIGHT = 218;

const Sheet = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 402px;
  min-height: ${MIN_SHEET_HEIGHT}px;
  padding: 7px 24px 24px;
  box-sizing: border-box;
  border-radius: 18px 18px 0 0;
  background: #f0e8ff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HandleArea = styled.div`
  width: 100%;
  height: 23px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;
`;

const DragHandle = styled.div`
  width: 40px;
  height: 3px;
  border-radius: 5px;
  background: rgba(119, 110, 145, 0.8);
`;

const SheetTitle = styled.p`
  width: 354px;
  margin: 0 0 16px;
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const ChipGroup = styled.div`
  width: 354px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 22px;
`;

const Chip = styled.div`
  display: flex;
  width: fit-content;
  min-width: 80px;
  height: 27px;
  padding: 6px 8px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
  border-radius: 16px;
  border: 1px solid #ae91e0;
  background: #f8f6fc;
  white-space: nowrap;

  img {
    width: 8px;
    height: 6px;
    flex-shrink: 0;
  }
`;

const ChipLabel = styled.span`
  color: #2d1b4e;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 13.75px;
  white-space: nowrap;
`;

const ContinueButton = styled.button`
  display: flex;
  width: 354px;
  height: 43px;
  padding: 4px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border: none;
  border-radius: 18px;
  background: #ae92e0;
  margin-bottom: 12px;
  cursor: pointer;
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 18px;
  font-weight: 700;
`;

const RetakeButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

// 항상 전체가 펼쳐진 채로 보이게 수정 (min-height만 바닥값으로 두고, 넘치면 그냥 시트 자체가 늘어나두록 함 )
export default function PhotoConfirmSheet({ features, onContinue, onRetake }) {
  return (
    <Sheet>
      <HandleArea>
        <DragHandle />
      </HandleArea>

      <SheetTitle>사진을 제출하기 전에,</SheetTitle>

      <ChipGroup>
        {features.map((feature) => (
          <Chip key={feature}>
            <img src={checkIcon} alt="" />
            <ChipLabel>{feature}</ChipLabel>
          </Chip>
        ))}
      </ChipGroup>

      <ContinueButton type="button" onClick={onContinue}>
        계속 하기
      </ContinueButton>

      <RetakeButton type="button" onClick={onRetake}>
        다시 찍기
      </RetakeButton>
    </Sheet>
  );
}