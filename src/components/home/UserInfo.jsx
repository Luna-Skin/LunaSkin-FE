import styled from "styled-components";

const Container = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  height: 24px;
  padding-left: 24px;
  padding-right: 25px;
  box-sizing: border-box;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserName = styled.span`
  color: #3c3c3c;
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const SkinTag = styled.div`
  display: flex;
  padding: 4px 8px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 18px;
  background: rgba(169, 133, 231, 0.2);
  box-sizing: border-box;
  white-space: nowrap;
`;

const SkinTagText = styled.span`
  color: #a985e7;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const PointsText = styled.span`
  color: #9a71df;
  text-align: right;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

// 고민은 1개만 보여주고 나머지는 +N으로 축약
const MAX_VISIBLE_CONCERNS = 1;

function formatConcerns(concerns = []) {
  if (concerns.length <= MAX_VISIBLE_CONCERNS) return concerns.join(" · ");
  const shown = concerns.slice(0, MAX_VISIBLE_CONCERNS).join(" · ");
  const rest = concerns.length - MAX_VISIBLE_CONCERNS;
  return `${shown} +${rest}`;
}

export default function UserInfo({ name, skinType, skinConcerns = [], points = 0 }) {
  return (
    <Container>
      <LeftGroup>
        <UserName>{name}</UserName>
        <SkinTag>
          <SkinTagText>
            {skinType} · {formatConcerns(skinConcerns)}
          </SkinTagText>
        </SkinTag>
      </LeftGroup>
      <PointsText>{points}P</PointsText>
    </Container>
  );
}