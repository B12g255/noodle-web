# 泡面点餐 · 网页版（H5）

一个手机网页版点餐系统：**发个链接，同学点进去就能选商品、填寝室号下单，你后台能收到订单**。不需要微信审核、不需要小程序 AppID。

## 目录结构

```
noodle-web/
├── server.js            # 后端（Express），订单存在 data/orders.json
├── package.json
├── data/                # 订单数据（首次下单自动生成）
└── public/              # 前端网页
    ├── index.html       # 点餐主页（商品列表 + 购物车 + 下单弹层）
    ├── admin.html       # 管理页（输密码查订单）
    ├── css/style.css
    ├── js/products.js   # ★ 商品数据（改价格/加商品/换照片都在这）
    ├── js/app.js        # 点餐逻辑 + 营业时间判断
    ├── js/admin.js      # 管理页逻辑
    └── images/          # 商品照片放这里
```

## 功能

- 商品列表（6 种泡面各 3.99 元、火腿肠、玉米肠、卤蛋 2 元、槟榔 3/34/65 元三档），每件带照片/占位图、价格、数量加减，自动算总价
- 下单前**必填寝室号**，提交后写入 `data/orders.json`，管理页可查
- **营业时间**两段：中午 12:00–13:30、晚上 21:30–次日凌晨 1:00；不营业时横幅提示、按钮变「不营业」，只能预选不能下单（后端也会拦）

## 一、本地运行（先在自己电脑上跑通）

**前提**：电脑装了 Node.js（没装去 https://nodejs.org 下载 LTS 版，一路下一步）。

1. 打开命令行（在 `noodle-web` 文件夹地址栏输入 `cmd` 回车），执行：

```
npm install
npm start
```

2. 看到 `泡面点餐已启动：http://localhost:3000` 就成功了。

3. 浏览器打开：
   - 点餐页：http://localhost:3000
   - 管理页：http://localhost:3000/admin.html （管理密码默认 `123456`，在 `server.js` 里改）

4. **手机访问**（同一 WiFi 下）：
   - 查电脑 IP：命令行输入 `ipconfig`，找「IPv4 地址」，例如 `192.168.1.5`
   - 手机浏览器打开 `http://192.168.1.5:3000` 即可点单
   - ⚠️ 如果学校 WiFi 隔离了设备（互相访问不到），这一步会失败，那就要走下面的「公网链接」

## 二、发公网链接（同学在任何网络都能点）

本地只能同一 WiFi 用。要让链接人人可点，需要把项目部署到免费托管平台，二选一：

- **Render（推荐，免费）**：注册 https://render.com → New → Web Service → 连 GitHub 仓库（把本目录推到 GitHub）→ 构建命令 `npm install`、启动命令 `npm start` → 部署后得到一个 `https://xxx.onrender.com` 链接。
- **Glitch（最无脑）**：注册 https://glitch.com → New Project → 导入/粘贴本目录文件 → 自动运行，得到一个公网链接。

> 这两个平台免费版会自动休眠（几分钟没访问会睡一会儿，第一次打开稍慢），不影响日常接单。需要我陪你走通哪一个，告诉我。

## ⚠️ 上线前你需要补的

1. **火腿肠 / 玉米肠价格**（现在临时 2 元，改 `public/js/products.js`）
2. **商品照片**（放进 `public/images/`，填好 `products.js` 里的 `image` 路径）
3. **管理密码**（`server.js` 里的 `ADMIN_KEY`，默认 `123456`）
4. 若部署公网，改营业时间要同时改 `server.js` 和 `public/js/app.js` 两处

## 改营业时间

- 后端 `server.js` 的 `isOpen()` 函数
- 前端 `public/js/app.js` 的 `getBusinessStatus()` 函数
两处要一起改，保持一致。
