import styled from "styled-components";
import cameraIcon from "../../assets/icons/photo_upload_camera.svg";
import checkIcon from "../../assets/icons/photo_upload_check.svg";

const Container = styled.button`
  display: flex;
  width: 354px;
  padding: 16px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 18px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  box-sizing: border-box;
  cursor: pointer;
`;

const Icon = styled.img`
  width: ${({ $photoTaken }) => ($photoTaken ? "24px" : "28px")};
  height: ${({ $photoTaken }) => ($photoTaken ? "24px" : "28px")};
`;

const Label = styled.span`
  color: #000;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export default function PhotoUploadBox({ photoTaken, onClick }) {
  return (
    <Container type="button" onClick={onClick}>
      <Icon src={photoTaken ? checkIcon : cameraIcon} alt="" $photoTaken={photoTaken} />
      <Label>{photoTaken ? "피부 사진 찍기 완료" : "피부 사진 찍기"}</Label>
    </Container>
  );
}