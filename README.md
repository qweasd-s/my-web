# 刘东琦 — AI 软件开发工程师

> 线上：https://qweasd-s.github.io/my-web/

“Optical Instrument Console” —— 一个深色光学仪器控制台式的个人名片，以及三个可操作的测试台案例页。

## 预览

```bash
python3 -m http.server 8000
```

- 首页：http://localhost:8000/
- 案例：`/work/mtf.html`、`/work/distortion.html`、`/work/decentration.html`

## 设计方向

上一版是纸质的 “work order” 工单，太像档案，不符合“科技感”。这一版直接换成 **光学仪器控制台**：

- 深石墨底 + 细白线技术图 + 青色信号 + 琥珀色测量值 + 红色标记
- 首页左侧是 **人员模块**（姓名、定位、参数、联系），右侧是 **光学台示意**（线对、双光路镜头、畸变网格、实时读数）
- 项目区是 **work manifest 表格**，不是卡片；每行有微型示意图、输入/输出、µm 精度和状态
- 三个案例页是 **test bench**：深色测试台 + 读数面板 + 亮度剖面 + 滑块控制
- 没有深色发光、渐变文字、玻璃、bento、eyebrow chip 或功能性小字

技术细节是内容本身：单频线对、`f₀ = 1000 / p`、Imax/Imin、图像 → 格点 → 畸变模型、双光路 → 光斑 → 偏心量、µm 级精度。演示数值全部标注“示意数据”，不编造真实结果。

## 案例页

| 文件 | 交互 |
| --- | --- |
| `work/mtf.html` | 线对周期、对焦滑块；实时 MTF、Imax/Imin、亮度剖面 |
| `work/distortion.html` | k1 滑块；检测点开关；畸变网格与 µm 偏移读数 |
| `work/decentration.html` | 偏心量滑块；光轴/机械轴、双光路与传感器落点 |

## 字体

全部本地托管，无 Google Fonts 运行时请求，SIL Open Font License 1.1：

- **Noto Sans SC**（中文姓名、标题、正文）
- **Archivo**（系统标签、字段、工单号）
- **IBM Plex Mono**（数据、单位、读数）

字体子集覆盖四个页面；详见 `assets/fonts/README.md`。

## 文件结构

```text
index.html                控制台首页
styles.css                深色仪器视觉系统
script.js                 vCard / 复制邮箱
favicon.svg               线对测试图图标
work/
  mtf.html                MTF 单频线对图测试台
  distortion.html         图像畸变解算测试台
  decentration.html       双光路偏心测试台
  work.css                测试台样式
  work.js                 三个交互演示
assets/fonts/             本地字体子集与 OFL 授权
DESIGN.md                 设计系统
PRODUCT.md                产品/内容上下文
```

## 已验证

- 首页 + 三个案例页全部 200，无 console 报错
- 1440 / 390 / 320 无横向溢出
- 三套字体加载成功
- 三个滑块/开关实时更新读数
- vCard 下载包含刘东琦 / AI 软件开发工程师 / 2823641678@qq.com
- 复制邮箱正常
- `prefers-reduced-motion` 下过渡关闭

## Impeccable 检测说明

静态文件扫描仍会报告少量 low-contrast 和一条 manifest padding 提示。它的对比度检查把页面背景当作白色，而这里的文字实际位于 `#0a0d0f` / `#0f1417` 面板上；实际渲染的对比度已直接检查。我没有为了让分数好看把深色文字改浅或去掉技术标注。

## 还待补充

- **GitHub 地址**（之前是假占位链接，已移除）
- 具体城市 / 年份：当前是 `CN / 2026`
- 可公开的真实精度数值（例如 ±2 µm）、项目角色与技术栈
- 头像可选；当前用姓名 + 系统模块表达身份
- 上线域名后补 1200×630 的 OG 分享图

## 注意

演示数值是模拟的，不代表真实测量结果。对外发布前请确认项目描述、算法流程和精度表述符合公司的公开口径。页面不包含公司数据、内部界面或客户信息。
