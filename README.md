# 刘东琦 — AI 软件开发工程师

> 线上：https://qweasd-s.github.io/my-web/

一个 **Refract** 风格的个人名片：日光下的白色玻璃与棱镜色散，深池蓝色字，清透的测量卡片。首页之后是三个可操作的测试台案例页。

## 预览

```bash
python3 -m http.server 8000
```

- 首页：http://localhost:8000/
- 案例：`/work/mtf.html`、`/work/distortion.html`、`/work/decentration.html`

## 设计方向

按 [Nutlope/hallmark](https://github.com/Nutlope/hallmark) 选定的 **Refract（glass / pool）** 主题：

- 日光下的白色灰泥、玻璃窗、棱镜色散；深池蓝色 `oklch(23% 0.035 245)` 作字色
- 一个由代码生成的 2D 光场景：太阳、窗棂、玻璃、焦散、棱镜与六段光谱；光谱只出现在光里
- 清透白卡片浮在光上，没有毛玻璃、渐变文字、发光、bento 或 eyebrow chip
- 首页：浮动胶囊导航、大字姓名、实时 MTF 卡、三行项目表、关于与联系
- 案例页：左侧说明 + 右侧测试台卡片；下方是测量流程与规格；演示数值标注为示意

技术细节是内容本身：批量线对图、`f₀ = 1000 / p`、Imax/Imin 与质量状态、O1/O2 中心线与 ESF/梯度边缘、鲁棒圆拟合、线/角偏心、µm 级精度。演示数值全部标注为模拟数据，不编造真实结果。

## 案例页

| 文件 | 交互 |
| --- | --- |
| `work/mtf.html` | 线对周期、对焦滑块；MTF、Imax/Imin、质量状态、Michelson 校核、亮度剖面 |
| `work/distortion.html` | ESF/梯度差异滑块；中心线开关；O1/O2、dx/dy 与残差读数 |
| `work/decentration.html` | 线偏心、旋转角度滑块；反射十字轨迹、拟合圆、角偏心与覆盖角度 |

## 字体

全部本地托管，无 Google Fonts 运行时请求，SIL Open Font License 1.1：

- **Funnel Display**（标题、读数、数字，300–500）
- **Funnel Sans**（正文与界面文字，400–500）
- **Noto Sans SC**（中文回退，300–700 可变子集）

字体子集覆盖四个页面及脚本里的界面文字；详见 `assets/fonts/README.md`。

## 文件结构

```text
index.html                Refract 首页
styles.css                日光玻璃视觉系统
light.js                  棱镜 / 焦散光场景（Canvas 2D）
script.js                 vCard / 复制邮箱 / 首页 MTF 卡
favicon.svg               棱镜图标
work/
  mtf.html                批量 MTF / 单目标线对测试台
  distortion.html         十字靶 O1/O2 与残差测试台
  decentration.html       反射十字轨迹与圆拟合测试台
  work.css                案例页样式
  work.js                 三个交互演示
assets/fonts/             本地字体子集与 OFL 授权
DESIGN.md                 设计系统
PRODUCT.md                产品/内容上下文
```

## 已验证

- 首页 + 三个案例页全部 200，无缺失资源
- 1440 / 1024 / 768 / 390 / 320 无横向溢出
- 三套字体加载成功；中文子集覆盖页面与脚本文字
- 五个滑块/开关实时更新读数；首页 MTF 卡同步更新
- 畸变的 ESF/梯度差异会切换“正常 / 关注 / 回退梯度”；偏心的旋转角度会移动十字像并更新覆盖角度
- 固定版式在 320px 下仍可读，演示图标注在小屏放大
- vCard 下载包含刘东琦 / AI 软件开发工程师 / 2823641678@qq.com
- 复制邮箱正常
- 光场景在 `prefers-reduced-motion` 下绘制静态帧

## 还待补充

- **GitHub 地址**（之前是假占位链接，已移除）
- 具体城市 / 年份：当前是 `CN / 2026`
- 可公开的真实精度数值与项目角色；技术栈与项目流程已按实际仓库更新
- 如允许公开仓库，可在案例页补 GitHub 链接；当前三个项目仓库为私有
- 头像可选；当前用姓名 + 棱镜光场景表达身份

## 注意

演示数值是模拟的，不代表真实测量结果。项目描述按实际仓库整理为公开安全的高层说明，刻意省略内部型号、客户信息、原始数据与具体产线参数；对外发布前请再确认算法流程和精度表述符合公司的公开口径。
