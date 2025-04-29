from websocket_server import WebsocketServer

# クライアント接続時のコールバック関数
def on_client_connect(client, server):
    print("New client connected")
    server.send_message(client, "Hello, client!")

# メッセージ受信時のコールバック関数
def on_message_received(client, server, message):
    print(f"Message from {client['id']}: {message}")
    server.send_message(client, f"Echo: {message}")

# WebSocket サーバーの設定
server = WebsocketServer(port=12345)  # ポートのみ指定

# コールバック関数を設定
server.set_fn_new_client(on_client_connect)  # クライアント接続時
server.set_fn_message_received(on_message_received)  # メッセージ受信時

# サーバーの開始
server.run_forever()
