import styled from "styled-components";
import ToggleChip from "./ToggleChip";

const Container = styled.div`
  display: flex;
  width: 354px;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-bottom: ${({ $hideBorder }) => ($hideBorder ? "none" : "0.5px dashed #ede8f8")};
  box-sizing: border-box;
`;

const Title = styled.span`
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const ChipList = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  width: 100%;
`;

export default function ChipGroup({ title, options, isSelected, onSelect, hideBorder }) {
  return (
    <Container $hideBorder={hideBorder}>
      <Title>{title}</Title>
      <ChipList>
        {options.map((option) => (
          <ToggleChip key={option} label={option} selected={isSelected(option)} onClick={() => onSelect(option)} />
        ))}
      </ChipList>
    </Container>
  );
}