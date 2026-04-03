# brando-node

`brando-node` 是 Brando 的后端服务镜像部署手册。

当前推荐镜像：

```bash
docker pull delbertbeta/brando-node:main
```

服务在容器内固定监听 `8088` 端口。

## 依赖

部署前需要先确认下面几个外部依赖都已经可用：

- MariaDB
- S3 兼容对象存储
- SSO gRPC 服务
- 一台已安装 Docker 的 Linux 主机

## 目录约定

下面示例统一使用这个目录：

```bash
mkdir -p /opt/brando-node
cd /opt/brando-node
```

建议把部署用的 `.env` 放在：

```bash
/opt/brando-node/.env
```

## `.env` 配置

可以先用仓库里的示例文件生成：

```bash
cp .env.example /opt/brando-node/.env
```

再按实际环境修改 `/opt/brando-node/.env`：

```dotenv
DB_HOST=127.0.0.1
DB_USER=brando
DB_PASS=replace-with-real-password
DB_NAME=brando

SECRET_ID=replace-with-s3-access-key
SECRET_KEY=replace-with-s3-secret-key

SSO_GRPC=127.0.0.1:2999
SESSION_COOKIE_KEY=delbertbeta-s-sso

IMAGES_BUCKET_NAME=brando-static
BUCKET_ENDPOINT=https://example.r2.cloudflarestorage.com
BUCKET_REGION=auto
CDN_PREFIX=https://static.example.com/
```

变量说明：

- `DB_HOST`: MariaDB 地址
- `DB_USER`: MariaDB 用户名
- `DB_PASS`: MariaDB 密码
- `DB_NAME`: MariaDB 数据库名
- `SECRET_ID`: 对象存储 Access Key ID
- `SECRET_KEY`: 对象存储 Secret Access Key
- `SSO_GRPC`: SSO gRPC 服务地址，格式通常是 `host:port`
- `SESSION_COOKIE_KEY`: 登录态 cookie 名称；不填时默认读取 `delbertbeta-s-sso`
- `IMAGES_BUCKET_NAME`: 图片上传目标 bucket 名
- `BUCKET_ENDPOINT`: S3 兼容存储 endpoint，例如 Cloudflare R2 endpoint
- `BUCKET_REGION`: 对象存储 region；如果是 R2，通常填 `auto`
- `CDN_PREFIX`: 对外访问图片的 CDN 前缀，代码会直接拼接路径，建议保留结尾 `/`

## 部署

### 1. 拉取镜像

```bash
docker pull delbertbeta/brando-node:main
```

### 2. 启动容器

```bash
docker run -d \
  --name brando-node \
  --restart unless-stopped \
  --env-file /opt/brando-node/.env \
  -p 8088:8088 \
  delbertbeta/brando-node:main
```

### 3. 查看日志

```bash
docker logs -f brando-node
```

正常情况下日志里会看到服务监听 `8088`，并且不会在启动阶段报数据库连接错误。

## 更新部署

更新到最新 `main`：

```bash
docker pull delbertbeta/brando-node:main
docker rm -f brando-node
docker run -d \
  --name brando-node \
  --restart unless-stopped \
  --env-file /opt/brando-node/.env \
  -p 8088:8088 \
  delbertbeta/brando-node:main
```

如果你不想手敲，可以直接用一条命令：

```bash
docker pull delbertbeta/brando-node:main && \
docker rm -f brando-node && \
docker run -d \
  --name brando-node \
  --restart unless-stopped \
  --env-file /opt/brando-node/.env \
  -p 8088:8088 \
  delbertbeta/brando-node:main
```

## 回滚

如果你之前推过其他 tag，可以把 `main` 换成目标 tag：

```bash
docker pull delbertbeta/brando-node:<tag>
docker rm -f brando-node
docker run -d \
  --name brando-node \
  --restart unless-stopped \
  --env-file /opt/brando-node/.env \
  -p 8088:8088 \
  delbertbeta/brando-node:<tag>
```

## 常用运维命令

查看运行状态：

```bash
docker ps --filter name=brando-node
```

查看日志：

```bash
docker logs --tail 200 brando-node
```

实时跟日志：

```bash
docker logs -f brando-node
```

重启容器：

```bash
docker restart brando-node
```

停止容器：

```bash
docker stop brando-node
```

删除容器：

```bash
docker rm -f brando-node
```

查看当前镜像：

```bash
docker inspect brando-node --format '{{.Config.Image}}'
```

## 故障排查

### 容器启动后立刻退出

先看日志：

```bash
docker logs brando-node
```

常见原因：

- `.env` 缺变量
- 数据库地址不可达
- SSO gRPC 地址不可达
- 对象存储凭证错误

### 数据库连接失败

这个服务使用 MariaDB，启动时会先建立数据库连接。

优先检查：

- `DB_HOST` 是否可达
- `DB_USER` / `DB_PASS` 是否正确
- `DB_NAME` 是否存在
- 目标数据库是否允许当前机器访问

### 图片上传失败

优先检查：

- `SECRET_ID` / `SECRET_KEY` 是否正确
- `IMAGES_BUCKET_NAME` 是否存在
- `BUCKET_ENDPOINT` 是否正确
- `BUCKET_REGION` 是否与存储服务要求一致

### 返回的图片地址不对

优先检查：

- `CDN_PREFIX` 是否为最终对外访问域名
- `CDN_PREFIX` 是否带结尾 `/`

### 依赖 SSO 的接口异常

优先检查：

- `SSO_GRPC` 指向的地址是否正确
- 目标端口是否放通
- 容器所在机器是否能访问这个 gRPC 服务

## 安全注意事项

- `.env` 只应保留在部署机器，不要提交到 git
- 数据库密码、对象存储密钥都在 `.env` 中，文件权限至少应限制为只有部署用户可读
- 当前仓库里已经存在一个真实 `.env` 文件，这不是一个安全状态，建议尽快移出版本控制并轮换其中的敏感凭证
