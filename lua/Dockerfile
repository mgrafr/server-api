FROM debian:12.5-slim
LABEL org.opencontainers.image.source https://github.com/mgra-fr/server-api
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

# Install Lua dependencies via LuaRocks
RUN luarocks --lua-version=5.4 install http && \
    luarocks --lua-version=5.4 install lua-cjson


CMD ["run", "-v"]
