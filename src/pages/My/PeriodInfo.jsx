import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import PeriodOptionSheet from "../../components/my/PeriodOptionSheet";
import SelectableChip from "../../components/my/SelectableChip";

const STORAGE_KEY = "lunaSkinPeriodSettings";

const Page = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 402px;
  min-height: calc(100dvh - 60px);
  margin: 0 auto;
  background: #fff;
`;

const Header = styled.header`
  position: relative;
  padding: 20px 16px 14px;
  border-bottom: 1px solid #eee;
  text-align: center;

  h1 {
    font-size: 16px;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 16px;
  left: 16px;
  border: 0;
  background: transparent;
  color: #555;
  font-size: 28px;
  cursor: pointer;
`;

const Content = styled.section`
  padding: 16px;
`;

const Label = styled.label`
  display: block;
  margin-top: 12px;
  color: #333;
  font-size: 14px;
  font-weight: 600;
`;

const SaveArea = styled.div`
  margin-top: auto;
  padding: 16px;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 15px;
  border: 0;
  border-radius: 12px;
  background: ${({ $changed }) => ($changed ? "#9B6DFF" : "#cfcfcf")};
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: ${({ $changed }) => ($changed ? "pointer" : "default")};
`;

const DEFAULT_SETTINGS = {
  cycleLength: "28일",
  periodLength: "4일",
};

const CYCLE_OPTIONS = [
  "20일",
  "21일",
  "22일",
  "23일",
  "24일",
  "25일",
  "26일",
  "27일",
  "28일",
  "29일",
  "30일",
  "31일",
  "32일",
  "33일",
  "34일",
  "35일",
  "36일",
  "37일",
  "38일",
  "39일",
  "40일",
];

const PERIOD_OPTIONS = [
  "2일 이내",
  "3일",
  "4일",
  "5일",
  "6일",
  "7일",
  "8일",
  "9일",
  "10일 이상",
];

export default function PeriodInfo() {
  const navigate = useNavigate();

  const savedSettings = JSON.parse(
    window.localStorage.getItem(STORAGE_KEY) ||
      JSON.stringify(DEFAULT_SETTINGS),
  );

  const [settings, setSettings] = useState(savedSettings);
  const [originalSettings, setOriginalSettings] = useState(savedSettings);
  const [sheetType, setSheetType] = useState(null);

  const isChanged =
    settings.cycleLength !== originalSettings.cycleLength ||
    settings.periodLength !== originalSettings.periodLength;

  const handleSelect = (value) => {
    if (sheetType === "cycle") {
      setSettings((current) => ({ ...current, cycleLength: value }));
    }

    if (sheetType === "period") {
      setSettings((current) => ({ ...current, periodLength: value }));
    }

    setSheetType(null);
  };

  const handleSave = () => {
    if (!isChanged) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setOriginalSettings(settings);
    navigate("/my");
  };

  const sheetConfig =
    sheetType === "cycle"
      ? {
          title: "생리 주기",
          options: CYCLE_OPTIONS,
          selectedValue: settings.cycleLength,
        }
      : {
          title: "생리 기간",
          options: PERIOD_OPTIONS,
          selectedValue: settings.periodLength,
        };

  return (
    <Page>
      <Header>
        <BackButton type="button" onClick={() => navigate("/my")}>
          ‹
        </BackButton>
        <h1>생리 정보</h1>
      </Header>

      <Content>
        <Label>생리 주기</Label>
        <SelectableChip
          value={settings.cycleLength}
          onClick={() => setSheetType("cycle")}
        />

        <Label>생리 기간</Label>
        <SelectableChip
          value={settings.periodLength}
          onClick={() => setSheetType("period")}
        />
      </Content>

      <SaveArea>
        <SaveButton type="button" $changed={isChanged} onClick={handleSave}>
          저장
        </SaveButton>
      </SaveArea>

      {sheetType && (
        <PeriodOptionSheet
          {...sheetConfig}
          onSelect={handleSelect}
          onClose={() => setSheetType(null)}
        />
      )}
    </Page>
  );
}