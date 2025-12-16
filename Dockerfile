# 使用 Nginx 來當作網頁伺服器 (因為你的檔案是純靜態的 HTML)
FROM nginx:alpine

# 將你的 HTML 檔案複製到 Nginx 的預設目錄
COPY . /usr/share/nginx/html

# 告訴 Google Cloud 這個容器會使用 8080 port
EXPOSE 8080

# 修改 Nginx 設定以符合 Cloud Run 的 Port 需求 (Cloud Run 預設 port 為 8080)
RUN sed -i 's/listen  80;/listen 8080;/' /etc/nginx/conf.d/default.conf
