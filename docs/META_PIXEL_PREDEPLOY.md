# JCZCARE Meta Pixel 上线前验收报告

日期：2026-11-09（Asia/Shanghai）
结论：本地构建和自动验收通过；尚未完成生产/Meta 后台人工验收，不建议直接上线。

## 分支与基线
- 目录：D:\jczcare-pixel-source
- 开发分支：codex/meta-pixel-consent
- HEAD 与远程 codex/google-ads-conversion-tracking 均为 6fba93689bab55808d9121f11ad8d63de9ad67ba。
- 开发改动尚未提交；未推送、合并、部署或修改 Vercel 配置。
- 与 Vercel 部署的对应关系依据用户确认的 Production 部署信息；本次未通过 Vercel API 再次查询部署 SHA。

## 构建阻断根因及修复
生产 Commit 已提交的 scripts/seo-routes.mjs 导入 src/storefront/metadata.js，但该 Commit 的 Git 树不存在 src/storefront，实际前端也无 storefront 模块引用。不是 sparse checkout 遗漏，也不是 Pixel 迁移引入。
仅移除无效导入与 storefrontRoutes 遍历两行；继续从现有 main.jsx 和 blogData 提取页面路由，不创建虚假的 metadata 文件。
现有 customProducts、businessSeoPages、staticSeoPages 数据块已与 HEAD 比对，无内容变更。由于原基线不能构建，无法声称与历史 Vercel 输出逐字节一致；现有仓库 SEO 校验全部通过。

## 验证结果
- npm ci --ignore-scripts --no-audit --no-fund：成功，依照现有 lockfile 安装；lockfile 未变。
- npm run build：成功；1617 modules；196 个静态路由、194 个可索引路由、RSS 150 项。
- npm run lint：成功；topic clusters、content ecosystem、SEO 三项通过。
- node --test tests/*.test.js：11/11 通过。
- git diff --check：通过。
- 浏览器测试自动启动本地 Preview；模拟正式域名且拦截所有外部请求，从不访问真实生产、Meta、Google Sheets。
- 用模拟服务验证 Sheets 成功/失败、邮件失败、人机验证失败；没有真实客户数据写入。
- 构建仍有 >500 kB chunk 警告，不阻断构建；未进行范围外的性能重构。

## Pixel 和表单链路
- Pixel ID 保持 1532666838061135；源码安装入口唯一。已存在第三方 fbq/script 时拒绝再次安装。
- 明确同意后才加载 SDK；默认拒绝适用于所有地区；无绕过同意的 noscript 图片。
- PageView 按当前 pathname 去重；query/hash 不引发新 PageView；支持 pushState、replaceState、popstate。
- ViewContent 仅匹配现有 7 个产品详情 slug；同一路由重复调用不重复发送，重新进入算新访问。
- Lead 要求 API ok===true、saved===true 和有效随机事件 ID；saved 仅在 Sheets append resolve 后为 true。
- 邮件/人机验证失败或 Sheets append 抛错不会产生 Lead。
- 同步提交锁阻止并发重复点击；失败重试保留 header ID；会话存储+内存去重相同 Lead ID。
- 追踪异常不影响询盘成功 UI或导航；ID 生成异常会释放提交锁。
- 撤回后发送 consent revoke，后续事件被门控；支持跨标签页 storage 通知。已发出的历史数据不能撤回；不保证删除已由 SDK 设置的 Cookie。
- 不补发同意前的历史询盘；拒绝追踪不影响正常询盘。
- 去重不是持久化后端幂等：重试可能沿用原行为再次写 Sheets/发邮件；新标签页/跨设备或客户端丢失 ID 不保证去重。

## Google Sheets、Google 标签、SEO 与页面保留
services/googleSheets.js、services/email.js、index.html、src/styles.css、package-lock.json 与 HEAD 完全一致。
表单字段、请求 JSON、Sheets 列及写入数据不变。新增请求头 X-Inquiry-Idempotency-Key；响应新增 saved、leadEventId。
保留原行为：邮件成功但 Sheets 失败仍显示原有成功信息，仅抑制 Meta Lead。需业务方理解该语义。
GA4/Google Ads 原始逻辑不变；新同意控件仅控制 Meta，不代表现有 Google 标签已满足同意要求。
新增必要的 Cookie 偏好控件；未更改原页面设计/产品信息；仍需移动端人工检查控件遮挡与可访问性。
构建生成 13 个未跟踪的 WebP 衍生资源，来自原构建脚本；没有覆盖已跟踪图片。这些是构建副产物，不是 Pixel 源码改动。

## 修改文件
- scripts/seo-routes.mjs：移除生产基线中不存在模块的悬空引用。
- src/metaPixel.js：唯一初始化、事件、同意门控、去重。
- src/marketingConsent.js、src/MarketingConsent.jsx：同意存储与偏好 UI。
- src/main.jsx：导航监听、追踪接入、提交锁、稳定重试 ID。
- api/contact.js：Sheets 保存结果确认及响应元数据；不改变 Sheets 数据。
- api/leadReceipt.js：随机/稳定请求事件 ID。
- tests/meta-pixel.test.js、tests/browser.test.js：单元/API mock/浏览器隔离验证。
- docs/META_PIXEL_PREDEPLOY.md：本报告。

## 上线前仍需人工验证
1. 在 Meta 后台确认该 Pixel 的自动事件设置、自动高级匹配关闭；代码禁用 autoConfig，但不能读取后台配置。
2. 使用隔离测试 Sheet/测试邮件、合成询盘和有效测试人机验证，在授权测试环境验证真实 API 与 Sheets，失败/重试不重复回传。当前仅模拟服务通过。
3. Meta Test Events 选择 1532666838061135：同意后首页 PageView；产品 PageView+ViewContent；确认保存后单次 Lead；拒绝/撤回/失败无新事件。普通 Vercel Preview hostname 默认禁用 Meta，应使用明确授权的测试域名映射，不得在生产环境随意提交测试询盘。
4. SDK 自带 URL、referrer、设备/网络信息；自定义事件不含姓名/邮箱/电话，但必须审查入口 URL、查询参数和 referrer，避免个人信息泄漏。参数白名单不能阻止 SDK 自动采集 URL。
5. 按实际目标市场复核 Cookie 文案、隐私政策和现有 Google 标签；本次不能宣称全站法律合规。
6. 复核外部 GTM/第三方代码、Meta 后台以及 Vercel 注入脚本，避免仓库外重复安装。
7. 确认 Vercel 团队暂停是否解除。此前页面显示 Fast Data Transfer 超限、暂停至 2026-12-07；本次没有账户权限查询最新状态。Ready/Current 不等于配额和新部署可用。未做计费或配置调整。
8. 用户批准最终差异和测试证据后，才可另行安排上线；本任务没有提交/推送/合并/部署。
