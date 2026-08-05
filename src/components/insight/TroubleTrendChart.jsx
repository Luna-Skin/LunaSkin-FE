import styled from "styled-components";

const Card = styled.section`
  padding: 14px 12px 10px;
  border: 1px solid #e9e9e9;
  border-radius: 14px;
  background: #fff;
`;

export default function TroubleTrendChart() {
  return (
    <Card>
      <svg viewBox="0 0 340 150" width="100%" role="img" aria-label="트러블 지수 변화 그래프">
        <rect x="151" y="14" width="34" height="96" fill="#f0e9ff" />
        <line x1="18" y1="110" x2="322" y2="110" stroke="#b8b8b8" strokeWidth="1" />

        <path
          d="M18 92 C55 88, 72 84, 87 80 C112 73, 115 42, 145 31 C171 20, 189 50, 208 73 C228 94, 260 93, 322 105"
          fill="none"
          stroke="#9b7af8"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {[
          ["D -14", 17],
          ["D -7", 81],
          ["생리 시작", 151],
          ["D +7", 239],
          ["D +14", 294],
        ].map(([label, x]) => (
          <g key={label}>
            <circle cx={x + 8} cy="110" r="2.2" fill="#989898" />
            <text x={x} y="130" fill="#858585" fontSize="10">
              {label}
            </text>
          </g>
        ))}
      </svg>
    </Card>
  );
}