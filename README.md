# 整屏标注

**圈出界面上的问题，整屏截图和编号评论一起进入输入框。**

`DeepSeek Harness 0.2.2` · `Desktop 优先` · `MIT`

![在 Browser 面板里标注](docs/hero.png)

## 为什么是整屏，而不是裁剪

只发一小块裁剪图，模型看不到它在页面里的位置：不知道这个按钮在卡片右上角，也不知道它上面还有一行标题。截图一裁，上下文就断了。

这个插件把**整个视口**作为底图，再用红框和编号指出要评论的位置。模型看到的是一张完整的页面，加上“第 1 处是什么、评论是什么”。

## 能做什么

- **整屏底图**：每个视口状态（滚动位置 + 尺寸）截一张完整图；滚动后继续标注，会生成第二张。
- **红框直接画进 PNG**：红色描边 + 白色光晕 + 编号徽标，不是叠在界面上的临时高亮。
- **编号与评论一一对应**：一次插入多张截图时，编号在当前批次内连续，正文按截图分组。
- **进草稿，不直接发**：截图变成图片附件，评论追加到草稿，原来打的字保留；可以继续改，再自己按发送。
- **全屏 Browser 也能用**：右下角常驻「标注」胶囊，窗口被全屏页面盖住时依然可点。
- **中英双语**：跟随 Harness 的界面语言。

![红框与评论卡片](docs/detail.png)

## 用起来

1. 在 Harness 里打开要标注的页面（Browser 面板），或直接对着 Harness 界面。
2. 点输入框左侧的标注图标，或右下角的「标注」胶囊。
3. 点击一个元素，或按住拖出一个区域；在卡片里写评论，点**添加**（Ctrl/Cmd+Enter）。
4. 可以继续滚动、继续标注，再点**插入输入框**。

插入目标是**主界面当前打开的会话**。Browser 标签可能来自别的保活会话，所以不能按页面所属会话猜；把鼠标停在插入按钮上会显示实际目标会话标题。

## 安装

先在 **设置 → 账号 → Manage dsh Command…** 装好 Desktop 自带的 `dsh`，然后完全退出 Desktop：

```sh
dsh plugin --profile desktop add "link:C:\path\to\annotate-viewport"
```

重新打开 Desktop，到「插件」页确认 `dsh-annotate-viewport` 已启用。本仓库已经提交构建产物 `client.js`，安装时不需要构建。

## 边界

- 截的是**当前视口**，不是整篇文档；超长页面请按屏标注。
- Web profile 的 Browser 是跨域 iframe，读不到 DOM 也拿不到像素；整屏标注只在 Desktop 的 `<webview>` 上可用。
- 页面在截图期间滚动、缩放或跳转时，这一张会作废并提示重选，避免把框画到错误内容上。
- 标注截图会作为附件发给模型，注意不要框选密码、令牌等敏感内容。

## 实现

| 能力 | 用到的接口 |
| --- | --- |
| 输入框入口 | `conversation.input.left` |
| 全窗浮层 | `shell.overlay` + `createPortal(document.body)` |
| 插入草稿 | `conversation.createDrafts()` → `shell.addAttachments()` → `shell.setDraft()` |
| Browser 选择 | `webview.executeJavaScript()` 注入选择脚本 |
| Browser 截图 | `webview.capturePage()` + Canvas 合成红框 |

这些是 Harness 的客户端内部接口，已在 0.2.2-rc.1 上做过端到端验证。

## 开发

```sh
npm ci
npm run build          # 产出 client.js
npm test               # 几何 / 选择器 / 文案 / guest 脚本
```

可选的浏览器冒烟测试（需要本机 Edge）：

```sh
npm install --prefix ../test-tools --no-save react@18.3.1 react-dom@18.3.1
npm run test:harness
```

`test:harness` 用真实 React 挂载插件，驱动两条路径（Harness 界面 + 模拟 Browser guest），并解码生成的 PNG 检查红框像素。

重新生成 README 截图：

```sh
node docs/serve-demo.cjs     # http://127.0.0.1:8899/
# 在 Browser 面板打开该地址，标注「Invite people」，截图后裁到 docs/hero.png
```

## 与上游的关系

本插件是 [DSH-AnnotateAnything](https://github.com/Meatware-Engineering/DSH-AnnotateAnything)（MIT）的 fork。沿用其窗口快照、guest 注入与指针选择实现；上游按“选中区域裁剪”输出，本 fork 改为整屏底图 + 编号红框 + 插入草稿，并补充了全屏入口、目标会话解析、中文本地化与无障碍回归测试。

MIT License。原始实现 © 2026 Meatware Engineering；修改部分 © 2026 annotate-viewport contributors。
