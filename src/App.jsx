import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import RootLayout from "./layout/RootLayout";
import { ChatProvider } from "./components/chat/ChatContext";

import Home from "./pages/Home/Home";
import TodaySkinForm from "./pages/TodaySkin/TodaySkinForm";
import TodaySkinCamera from "./pages/TodaySkin/TodaySkinCamera";
import TodaySkinResult from "./pages/TodaySkin/TodaySkinResult";
import Insight from "./pages/Insight/Insight";
import ChatList from "./pages/Chat/ChatList";
import ChatRoom from "./pages/Chat/ChatRoom";
import MyPage from "./pages/My/MyPage";
import PeriodInfo from "./pages/My/PeriodInfo";
import SkinInfo from "./pages/My/SkinInfo";

function App() {
  return (
    <BrowserRouter>
      <ChatProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Home />} />

            <Route path="/today-skin" element={<TodaySkinForm />} />
            <Route path="/today-skin/camera" element={<TodaySkinCamera />} />
            <Route path="/today-skin/result/:date" element={<TodaySkinResult />} />

            <Route path="/insight" element={<Insight />} />

            <Route path="/chat" element={<ChatList />} />
            <Route path="/chat/:chatId" element={<ChatRoom />} />

            <Route path="/my" element={<MyPage />} />
            <Route path="/my/period" element={<PeriodInfo />} />
            <Route path="/my/skin" element={<SkinInfo />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ChatProvider>
    </BrowserRouter>
  );
}

export default App;