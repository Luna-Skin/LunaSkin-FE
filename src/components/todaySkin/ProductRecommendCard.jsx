import styled from "styled-components";

const Row = styled.div`
  display: flex;
  width: 322px;
  height: 24px;
  justify-content: space-between;
  align-items: center;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Chip = styled.span`
  width: 61px;
  height: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 15px;
  background: #f0ebf8;
`;

const ChipText = styled.span`
  color: #a876fc;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const ProductName = styled.span`
  color: #454545;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const LinkButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  color: #454545;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

// tag: 연보라 칩에 들어갈 태그 텍스트 (예: "피지 조절")
// name: 제품명
// onClick: 구매 링크로 이동 등 실제 동작은 부모가 결정
export default function ProductRecommendCard({ tag, name, onClick }) {
  return (
    <Row>
      <LeftGroup>
        <Chip>
          <ChipText>{tag}</ChipText>
        </Chip>
        <ProductName>{name}</ProductName>
      </LeftGroup>
      <LinkButton type="button" onClick={onClick} aria-label={`${name} 자세히 보기`}>
        &gt;
      </LinkButton>
    </Row>
  );
}