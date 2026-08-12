import styled from "styled-components";
import ProductRecommendCard from "./ProductRecommendCard";

const Card = styled.div`
  width: 354px;
  padding: 20px 16px;
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-sizing: border-box;
`;

const Title = styled.h3`
  margin: 0 0 19px;
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// products: [{ id, tag, name, url }, ...]
export default function ProductRecommendSection({ products }) {
  return (
    <Card>
      <Title>지금 피부에 사용하기 좋은 제품</Title>
      <CardList>
        {products.map((product) => (
          <ProductRecommendCard
            key={product.id}
            tag={product.tag}
            name={product.name}
            onClick={() => window.open(product.url, "_blank", "noopener,noreferrer")}
          />
        ))}
      </CardList>
    </Card>
  );
}