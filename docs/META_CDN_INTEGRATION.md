# JCZCARE Meta Pixel 与 CDN 安全集成报告

日期：2026-11-09。仅完成开发分支集成，不代表生产验收通过。

## 基准与分支

- GitHub：`ship67503-max/Nantong-Jincheng-Zencare`。
- 本轮重新获取远端 main，基准为 `5756ae6884f3262dce205a505205eb21609d895a`。
- 新分支：`codex/meta-pixel-cdn-main-integration`。
- 独立工作树：`D:/jczcare-meta-cdn-integration`。
- 原分支及工作区 `D:/jczcare-pixel-source` 保持原样，包括未提交的CDN优化与既有未跟踪素材。
- 本轮基于 main 逐点适配，没有把旧分支整体合并到 main，也未复制旧页面、产品数据或SEO规则。
- main 是用户指定的集成基准；没有将 GitHub main SHA 冒充为已验证的 Vercel 线上部署 SHA。

## 修改文件

| 文件 | 原因 |
| --- | --- |
| `src/metaPixel.js` | 统一为同意门控的单实例；固定ID；PageView路径去重；产品详情ViewContent；保存回执Lead及session去重；关闭自动配置；仅传产品标识和随机事件ID |
| `src/marketingConsent.js` | 保存可撤回的Meta营销同意；存储失败默认为拒绝 |
| `src/MarketingConsent.jsx` | 全页可用的Meta同意与设置入口，沿用旧开发成果 |
| `src/main.jsx` | 挂载同意入口与事件；兼容main的单级产品和目录产品详情；保留GA、表单和成功反馈；工厂视频延迟加载 |
| `api/contact.js` | 在原邮件确认成功契约上增加独立Sheets保存回执，保留原字段、验证、限流和同步路径 |
| `src/ProductExperience.jsx` | 保留main轮播、素材和布局；桌面可视后播放压缩Hero，移动/省流量/减少动态模式交互后加载 |
| `index.html` | 移除跨页面无条件视频预加载和绕过同意的noscript Pixel请求 |
| `public/videos/hero-background-2-720p-v2.webm` | 新增压缩版本；旧视频原件未删除 |
| `tests/meta-pixel.test.js` | 更新Pixel测试，使其验证同意和服务器保存回执，而非仅有客户端submissionId就认为成功 |
| `tests/contact.test.js` | 保留原业务测试，扩展保存成功/失败/超时/重试及回执测试 |
| `tests/integration.browser.test.js` | 生成独立测试构建，桌面/移动端浏览器、表单、Pixel、GA及媒体联动测试 |
| 本报告 | 审查依据与人工验证清单 |

未修改：产品目录及产品数据、样式表、邮件服务、Google Sheets列映射、GA实现、归因模块、询盘客户端校验、SEO路由与生成器、Vercel配置、依赖清单及锁文件。未删除任何受版本控制的文件或媒体。

main的静态SEO生成器不输出视频元素；移除共享HTML的视频预加载即可覆盖非首页。没有迁入旧分支SEO规则，以免把main的376个静态路由回退为196个。

## 事件与询盘契约

- Pixel ID为 `153266838061135`。默认只在生产构建的正式域名启用；Preview可显式使用`?meta_debug=1`，但仍需同意。
- 拒绝、未选择或读取存储失败时不加载Meta SDK、不排队事件。撤回时调用revoke并阻断后续事件；同意跨标签页变化也更新门控。
- SDK及init只有一个；遇到外部已有fbq/Meta脚本时停止本实现，避免争抢或重复初始化。异常第三方安装应另外排查，不会自动接管。
- PageView每次真实路径访问一次；查询参数和片段不产生额外自定义PageView。同一文档内重复渲染/视频加载不增加PageView。
- ViewContent仅由main已识别的产品详情对象触发，系列列表不触发。
- main的`success + deliveryConfirmed`邮件成功契约保持不变。新增` saved: true + leadEventId`仅在Sheets函数明确返回成功且未超过既有5秒同步预算时返回。
- 邮件已确认但Sheets失败或超时：保留表单成功反馈和GA原事件，Meta不发送Lead。这可能造成Meta Lead少于GA generate_lead，是本次选择的保守计量语义。
- UUID型submissionId作为稳定回执，配合main既有重复提交缓存与前端session/in-memory去重；没有将客户字段用于Meta事件参数。
- main现有重复提交缓存仍在单个serverless进程内，保留10分钟；不是跨实例持久化幂等存储。老浏览器非UUID回退ID的回执仅在该进程缓存内稳定。存储被禁用时只能依赖当前页面内存去重。不能声称提供绝对的跨设备/跨实例恰好一次保证。
- Sheets超时后实际写入仍可能稍后完成；本次不把迟到结果当作已确认保存，不额外发送Lead。人工验证应检查是否存在超时导致的漏报。
- 表单姓名、邮箱、电话、WhatsApp、国家、公司、消息、点击ID等均未被本实现添加至Pixel自定义参数。Meta SDK本身的标准设备/页面信息仍受同意控制；不要在公开URL中放客户个人信息。

## 流量优化与量化边界

| 资源 | 原大小（字节） | 集成后大小（字节） | 策略 |
| --- | ---: | ---: | --- |
| Hero | 7,651,626 | 6,255,333 | 同素材新编码；桌面可视后加载；移动端、省流量、减少动态模式交互后加载；保留poster |
| 工厂视频 | 19,412,476 | 19,412,476 | 初始无src，preload=none；进入距可视区240px后或点击视频时设置src并播放 |

Hero文件缩小1,396,293字节（18.25%）。新文件与上一阶段经过SSIM检查的压缩文件逐字节一致；本轮没有重新编码。1280×720、60fps及24.35秒为上一阶段编码记录，不是本轮重新测量。

理论估算：每1000次完整Hero传输减少约1.396 GB；若比例p的原本会下载工厂视频的访问在到达240px触发区前退出，完整文件传输上限节省约19.412×p GB/千次访问，例如p=50%时约9.706 GB。这些是显式假设下的上限估算，不是实际账单或CDN监测结果，不能直接当成106 GB账单中的可回收比例。Range、缓存、停留时长和浏览器行为都会影响实际传输。

## 验证结果

- `npm run build`：通过；376个静态路由、374个可索引页面、RSS与两个sitemap成功生成。保留main原有代码分包。
- `npm run lint`：通过；374个公开路由SEO验证通过。
- `npm test`：60/60通过，0跳过。包含main既有GA、归因、邮件、询盘客户端/API/HTTP回归及新增Pixel/媒体集成测试。
- 浏览器使用Playwright Chromium，1365×900及390×844；不等于真实iOS Safari或所有手机验收。
- 浏览器确认桌面Hero及工厂视频播放、工厂视频首屏不请求、单次资源请求、移动Hero交互前不请求；媒体播放不增加Pixel PageView。
- 浏览器确认单级产品详情及目录产品详情触发ViewContent，目录系列列表不触发。
- 浏览器确认成功保存返回后Lead一次、双击只提交一个请求、Sheets未保存或API失败不触发Lead、GA的既有成功事件契约保留。
- 浏览器使用独立`output/integration-dist`测试构建，注入公开Turnstile测试站点Key并模拟captcha；所有外部请求被拦截。没有向真实Google Sheets、邮箱、Meta或Google发送测试数据。正常生产构建和Vercel配置没有测试Key改动。
- 检查截图保存于`output/integration/`（忽略，不提交）；桌面与移动截图已本地查看。没有声称进行全浏览器像素级对比。
- 敏感字符串扫描未发现私钥、常见令牌或硬编码凭据。测试中的`example.com`、公开Pixel ID与公开captcha测试Key不是生产密钥。
- `git diff --check`通过；与main核对未修改上述业务/SEO配置文件；未删除受跟踪文件。

## 未完成的线上验证及风险

1. 未访问Vercel授权项目API或日志，尚未确认当前暂停状态、恢复条件、真实Production部署SHA或Preview可用性。未升级套餐、改域名或部署。
2. Meta Test Events、真实SDK网络回传、广告拦截器与真实用户Cookie行为未验证，模拟SDK测试不代替Meta后台验收。
3. 邮件SMTP真实投递、Turnstile真实域名授权、Google Sheets真实写入及失败日志仍需Preview中人工验证。
4. main没有独立Google Ads AW转化调用；本次保留main的GA generate_lead等实现。Google Ads是否通过GA导入、转化标签或账号配置接收数据需要后台检查，不能报告Ads回传已通过。
5. Vercel Cache-Control、Range、缓存命中、真实出站流量节省没有线上验证；没有修改缓存或Vercel配置。
6. npm安装审计提示16项既有依赖问题（1 low、7 moderate、8 high）；依赖与锁文件未变。本次没有运行自动修复或擅自升级，正式上线应评估受影响运行路径。
7. Cookie入口仅管理Meta营销追踪，未改动GA/其他既有服务的同意逻辑；不能据此宣称全站所有目标市场隐私合规已认证。

## 人工审查与上线顺序

1. 审查本分支相对main的有限差异，不把旧分支整包覆盖回main。
2. 在Vercel确认生产分支/部署SHA以及暂停状态；通过项目页面提示或官方支持确认恢复方式，不自动付费或绕过限制。
3. 仅在允许后创建Preview；核对现有正式环境变量，无需输出任何密钥。
4. 在Meta Test Events中打开Preview的`?meta_debug=1`，先拒绝再允许，核实PageView与两个产品详情类型的ViewContent；正常Preview不加debug参数时不回传。
5. 经同意使用明确标记的测试询盘，确认邮箱收到、Sheets新增、成功Lead一次；失败和重复点击不计数；不要用真实客户数据。测试记录处置由人工明确决定。
6. 核对GA DebugView与Google Ads后台转化配置、桌面/真实手机Safari/Chrome布局、视频缓存与Range行为。
7. 只有PR审查和上述线上验收通过后，才由用户另行批准合并及Production上线。本轮不自动合并或生产部署。

当前结论：代码具备提交PR与Preview验收的条件；尚不具备无人工验证直接Production上线条件。
