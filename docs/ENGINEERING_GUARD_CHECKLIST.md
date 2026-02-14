# ENGINEERING_GUARD_CHECKLIST

每次改动后跑一遍（5-8 分钟版）：

## 1) 语法与基础可运行
- `node -c quick-main.js`
- `node -c quick-ui.js`
- `node -c intuition.js`
- `node -c agent.js`
- `node -c vault.js`

## 2) 存储写入不静默失败
- 新增/修改写入逻辑时，确认优先走 `PB_SHARED.safeSetItem`。
- 禁止新增裸 `localStorage.setItem(...)`（除非有明确注释说明）。

## 3) UI 可达性一致
- 注册到 `QUICK_STACKS_*` 的条目，在 `index.html` 有对应可选入口。
- 若隐藏实验项，必须有明确开关策略与注释。

## 4) i18n 一致性
- 新增用户可见文案必须有 `data-i18n` 或双语字典键。
- 不允许核心路径出现中英断层（至少按钮/空状态/确认弹窗要一致）。

## 5) 最小回归（手动）
- Quick：选 core + 叠 1-2 stack + 生成 + 复制
- Deep：生成 + 回传 Quick 补丁
- Agent：生成 + 预览切换 + 保存到库
- Vault：新增草稿 + 复制 + 删除 + 语言切换

## 6) 提交纪律
- 一个 commit 只做一类事情（修复 / 打磨 / 重构）。
- 提交信息描述“行为变化”，不写模糊词。
