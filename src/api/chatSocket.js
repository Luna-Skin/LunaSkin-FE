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
  return 1;
}

export function connectChatSocket(
  chatRoomId,
  {
    onMessage,
    onError,
    onConnect,
    onDisconnect,
    onConnectError,
  } = {},
) {
  const userId = getUserId();

  const baseURL =
    apiClient.defaults.baseURL ||
    "http://localhost:8080";

  const socketUrl = `${baseURL}/ws/chat`;

  console.log("[ChatSocket] create", {
    socketUrl,
    roomId: chatRoomId,
    userId,
  });

  let isActive = true;

  const client = new Client({
    webSocketFactory: () => {
      console.log(
        "[ChatSocket] SockJS connect:",
        socketUrl,
      );

      return new SockJS(socketUrl);
    },

    connectHeaders: {
      "X-USER-ID": String(userId),
      "X-CHAT-ROOM-ID": String(chatRoomId),
    },

    reconnectDelay: 3000,

    debug: (message) => {
      console.log("[STOMP]", message);
    },

    onConnect: (frame) => {
      if (!isActive) {
        console.warn(
          "[ChatSocket] 연결됐지만 이미 비활성화된 소켓입니다.",
        );
        return;
      }

      console.log(
        "[ChatSocket] CONNECTED",
        frame,
      );

      const topic = `/topic/chat/${chatRoomId}`;

      console.log(
        "[ChatSocket] SUBSCRIBE:",
        topic,
      );

      client.subscribe(
        topic,
        (frame) => {
          console.log(
            "[ChatSocket] RECEIVED RAW:",
            frame.body,
          );

          let payload;

          try {
            payload = JSON.parse(frame.body);
          } catch (error) {
            console.error(
              "[ChatSocket] 메시지 JSON 파싱 실패:",
              error,
            );

            return;
          }

          console.log(
            "[ChatSocket] RECEIVED:",
            payload,
          );

          if (payload?.type === "ERROR") {
            console.error(
              "[ChatSocket] SERVER ERROR:",
              payload,
            );

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
        "[ChatSocket] STOMP ERROR:",
        {
          headers: frame.headers,
          body: frame.body,
        },
      );

      onConnectError?.(frame);
    },

    onWebSocketError: (event) => {
      console.error(
        "[ChatSocket] WEBSOCKET ERROR:",
        event,
      );

      onConnectError?.(event);
    },

    onWebSocketClose: (event) => {
      console.warn(
        "[ChatSocket] WEBSOCKET CLOSED:",
        event,
      );

      onDisconnect?.(event);
    },

    onDisconnect: (frame) => {
      console.log(
        "[ChatSocket] STOMP DISCONNECTED:",
        frame,
      );

      onDisconnect?.(frame);
    },
  });

  client.activate();

  return {
    sendMessage(content) {
      const message =
        String(content ?? "").trim();

      if (!message) {
        console.warn(
          "[ChatSocket] 빈 메시지는 전송하지 않습니다.",
        );

        return false;
      }

      console.log(
        "[ChatSocket] sendMessage 호출:",
        {
          connected: client.connected,
          active: isActive,
          content: message,
        },
      );

      if (!isActive) {
        console.warn(
          "[ChatSocket] 소켓이 비활성화되었습니다.",
        );

        return false;
      }

      if (!client.connected) {
        console.warn(
          "[ChatSocket] 아직 STOMP 연결이 완료되지 않았습니다.",
        );

        return false;
      }

      console.log(
        "[ChatSocket] SEND:",
        {
          destination: "/pub/chat/send",
          body: {
            content: message,
          },
        },
      );

      try {
        client.publish({
          destination: "/pub/chat/send",
          body: JSON.stringify({
            content: message,
          }),
        });

        console.log(
          "[ChatSocket] SEND 완료",
        );

        return true;
      } catch (error) {
        console.error(
          "[ChatSocket] SEND 실패:",
          error,
        );

        return false;
      }
    },

    isConnected() {
      return (
        isActive &&
        client.connected
      );
    },

    disconnect() {
      if (!isActive) {
        return;
      }

      console.log(
        "[ChatSocket] disconnect",
        {
          roomId: chatRoomId,
        },
      );

      isActive = false;

      client.deactivate();
    },
  };
}