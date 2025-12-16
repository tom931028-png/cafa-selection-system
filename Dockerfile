# 使用 Nginx
FROM nginx:alpine

# 將你的檔案複製進去
COPY . /usr/share/nginx/html

# 【關鍵修改】直接建立一個新的設定檔，強制規定用 8080 Port
# 這樣就絕對不會有「改不到」的問題了
RUN echo "server { listen 8080; server_name localhost; location / { root /usr/share/nginx/html; index index.html index.htm; try_files \$uri \$uri/ /index.html; } }" > /etc/nginx/conf.d/default.conf

# 告訴 Cloud Run 我們用 8080
EXPOSE 8080
