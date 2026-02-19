# RELEASE_CHECKLIST_v0.1.3

## Scope
v0.1.3 = i18n收尾 + 冲突提示 + Deep双层输出 + 模板修复 + 组合去重

## Quick 回归
- [ ] 5个核心引擎可切换并正确注入模板（含猫娘♡/Monday长版）
- [ ] Stack 勾选/取消后可正确回滚（baseline生效）
- [ ] 冲突组合会弹提示（非阻断）：
  - [ ] 亲密 + 简短
  - [ ] 亲密 + 专业
  - [ ] 细腻 + 简短
  - [ ] 果断 + 细腻
- [ ] 组合提示栏实时更新且不出现异常空白
- [ ] 生成 Full/Compact/JSON 正常
- [ ] 复制按钮反馈文案跟随语言

## Deep 回归
- [ ] Step1 粘贴 Quick 内容正常
- [ ] Step2 三问可输入并生成
- [ ] 默认展示“主语总结”
- [ ] 可展开/收起 LLM payload
- [ ] 应用回 Quick 可写入 patch（value/style/brake）

## i18n 回归（zh/en）
- [ ] Home 文案可切换
- [ ] Quick 标题/按钮/标签/placeholder/提示可切换
- [ ] Deep 标题/问题/placeholder/按钮/结果标题可切换
- [ ] 语言切换后动态文案（toast/组合栏/复制反馈）一致

## 输出质量回归
- [ ] 不出现明显重复句（重点看 L7 EASE / L8 BRAKE）
- [ ] 不出现明显语义自相矛盾（至少2组 engine×stacks交叉抽检）

## 发布文件
- [x] VERSION = v0.1.3
- [x] CHANGELOG 已更新
- [ ] 部署生产并验证 alias

## 发布后
- [ ] 记录1个已知问题（如有）
- [ ] 开 v0.1.4 计划：Agent 专页（Core + Mode Modules）
