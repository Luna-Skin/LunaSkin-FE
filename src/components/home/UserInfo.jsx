import styled from "styled-components";

const Container = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: center;
  gap: 8px;
  height: 24px;
  padding-left: 24px;
  box-sizing: border-box;
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

// 태그 한 줄 안에 다 담아야 해서, 고민이 많아지면 2개까지만 보여주고 나머지는 +N으로 축약
// TODO: 디자이너/PO 확인 필요 - 전부 나열 vs 개수 제한 
const MAX_VISIBLE_CONCERNS = 2;

function formatConcerns(concerns = []) {
  if (concerns.length <= MAX_VISIBLE_CONCERNS) return concerns.join(" · ");
  const shown = concerns.slice(0, MAX_VISIBLE_CONCERNS).join(" · ");
  const rest = concerns.length - MAX_VISIBLE_CONCERNS;
  return `${shown} +${rest}`;
}

export default function UserInfo({ name, skinType, skinConcerns = [] }) {
  return (
    <Container>
      <UserName>{name}</UserName>
      <SkinTag>
        <SkinTagText>
          {skinType} · {formatConcerns(skinConcerns)}
        </SkinTagText>
      </SkinTag>
    </Container>
  );
}