# APP_ROADMAP_V0.1

目标：从当前 Web 原型平滑进化到可发布 App（先稳后快）。

## A. 现在就做（Web 阶段）
1. 数据结构稳定化
- 固定 Quick/Deep 输入输出 schema
- 明确 handoff payload（Quick->Deep, Deep->Quick）

2. 隐私与边界
- 增加简版 Privacy Notice（本地存储说明 / 后续接 LLM 说明）
- 明确“用户可清除本地数据”入口

3. 错误与回退
- API 失败回退到本地规则（Deep）
- 保留版本号与 changelog（已具备）
- 发布前 checklist（已具备）

4. i18n 完整化
- Home / Quick / Deep 文案全覆盖
- 模板与提示语统一术语

5. 导入导出
- 导出当前配置 JSON
- 导入配置 JSON

## B. 下阶段做（PWA / App 过渡）
1. PWA 化
- manifest.json
- service worker（离线壳）
- 安装入口提示

2. 账号与云端（可选）
- 先匿名本地，后续再加登录
- 云端仅同步配置，不上传敏感原文（默认）

3. LLM 网关
- 最小 API：POST /api/deep/generate
- 加超时、重试、限流、配额提示

## C. App 发布前必须项（合规护栏）
1. 隐私政策 + 服务条款
2. 明示 AI 生成内容非绝对事实
3. 用户数据删除机制
4. 内容安全与敏感场景提示
5. 崩溃监控与反馈通道

## D. 平台路线建议
- 第一步：PWA（最快验证）
- 第二步：Capacitor 打包 iOS/Android（复用现有前端）
- 第三步：视增长情况再迁原生框架

## E. 版本里程碑
- v0.2：i18n 完整 + 导入导出 + Deep API（可选）
- v0.3：PWA 发布
- v0.4：移动端壳 + 小规模内测
