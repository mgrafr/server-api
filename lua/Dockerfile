FROM debian:12.5-slim
LABEL org.opencontainers.image.source https://github.com/mgra-fr/server-api/lua
# Install Lua, LuaRocks, and build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    lua5.4 \
    luarocks \
    liblua5.4-dev \
    build-essential \
    libssl-dev \
    m4 \
    && rm -rf /var/lib/apt/lists/*

	
WORKDIR /app
COPY . .
# Install Lua dependencies via LuaRocks
RUN luarocks --lua-version=5.4 install http && \
    luarocks --lua-version=5.4 install lua-cjson

RUN chown -R 1000:1000 /app

CMD ["lua5.4", "main.lua"]
