import styled from "styled-components";
import PhotoThumbnail from "./PhotoThumbnail";
import cameraIcon from "../../assets/icons/photo_upload_camera.svg";
import placeholderIcon from "../../assets/icons/photo_upload_placeholder.svg";

const MAX_PHOTOS = 3;

const EmptyContainer = styled.button`
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

const EmptyIcon = styled.img`
  width: 28px;
  height: 28px;
`;

const EmptyLabel = styled.span`
  color: #000;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const Container = styled.div`
  width: 354px;
  height: 152px;
  border-radius: 18px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: #fff;
  padding: 16px 22px;
  display: flex;
  gap: 20px;
  box-sizing: border-box;
`;

const AddButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;

  img {
    display: block;
    width: 90px;
    height: 120px;
  }
`;

// photos: [{ url, angle }, ...] (0~3개)
// onAddClick: "+" 또는 최초 촬영 박스 클릭 시 (카메라로 이동)
// onDeletePhoto: 특정 인덱스의 사진 삭제 요청 시
export default function PhotoUploadBox({ photos, onAddClick, onDeletePhoto }) {
  if (photos.length === 0) {
    return (
      <EmptyContainer type="button" onClick={onAddClick}>
        <EmptyIcon src={cameraIcon} alt="" />
        <EmptyLabel>피부 사진 찍기</EmptyLabel>
      </EmptyContainer>
    );
  }

  return (
    <Container>
      {photos.map((photo, index) => (
        <PhotoThumbnail key={photo.url} photoUrl={photo.url} onDelete={() => onDeletePhoto(index)} />
      ))}
      {photos.length < MAX_PHOTOS && (
        <AddButton type="button" onClick={onAddClick} aria-label="사진 추가하기">
          <img src={placeholderIcon} alt="" />
        </AddButton>
      )}
    </Container>
  );
}