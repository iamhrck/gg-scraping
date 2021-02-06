FROM alpine:edge

# Installs latest Chromium (89) package.
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

RUN mkdir /app/gg-scraping

# Puppeteer v6.0.0 works with Chromium 89.
RUN npm install -g  puppeteer@6.0.0 @google-cloud/functions-framework

# Add user so we don't need --no-sandbox.
RUN addgroup -S pptruser && adduser -S -g pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

# Run everything after as non-privileged user.
USER pptruser

# コンテナ起動コマンド
# --cap-add=SYS_ADMIN をつけないと権限の関係でchromeを起動できない
# docker run --name gcp-cf -itd --cap-add=SYS_ADMIN  -p 8080:8080 -v %cd%:/app/gcp-cf gcp-cf
