// STOMP over SockJS 채팅 소켓
//
// 연결: /ws/chat
// CONNECT 헤더:
//   X-USER-ID
//   X-CHAT-ROOM-ID
//
// 구독:
//   /topic/chat/{chatRoomId}
//
// 전송:
//   /pub/chat/send
//   body: { content }

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { apiClient } from "./axiosInstance";

function getUserId() {
  return "1";
}

export function connectChatSocket(
  chatRoomId,
  {
    onMessage,
    onError,
    onConnect,
    onConnectError,
  } = {},
) {
  const userId = getUserId();

  const client = new Client({
    webSocketFactory: () =>
      new SockJS(
        `${apiClient.defaults.baseURL}/ws/chat`,
      ),

    connectHeaders: {
      "X-USER-ID": String(userId),
      "X-CHAT-ROOM-ID": String(chatRoomId),
    },

    reconnectDelay: 3000,

    onConnect: () => {
      console.log(
        `[ChatSocket] connected room=${chatRoomId}`,
      );

      client.subscribe(
        `/topic/chat/${chatRoomId}`,
        (frame) => {
          let payload;

          try {
            payload = JSON.parse(frame.body);
          } catch (error) {
            console.error(
              "채팅 메시지 파싱에 실패했습니다.",
              error,
            );
            return;
          }

          if (payload?.type === "ERROR") {
            onError?.(payload);
            return;
          }

          onMessage?.(payload);
        },
      );

      onConnect?.();
    },

    onStompError: (frame) => {
      console.error(
        "STOMP 에러",
        frame.headers?.message,
        frame.body,
      );

      onConnectError?.(frame);
    },

    onWebSocketError: (event) => {
      console.error(
        "웹소켓 연결 에러",
        event,
      );

      onConnectError?.(event);
    },
  });

  client.activate();

  return {
    sendMessage(content) {
      if (!client.connected) {
        console.warn(
          "소켓이 아직 연결되지 않았습니다.",
        );
        return false;
      }

      client.publish({
        destination: "/pub/chat/send",
        body: JSON.stringify({
          content,
        }),
      });

      return true;
    },

    disconnect() {
      client.deactivate();
    },
  };
}