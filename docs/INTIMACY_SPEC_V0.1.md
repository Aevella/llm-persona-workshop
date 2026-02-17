# INTIMACY_SPEC_V0.1

## 定位
与 Quick / Deep / Agent 同级的增强页。
目标不是重写完整人格，而是给既有人格追加「亲密 + 拟人 + 身体化」模块。

- 页面名：Intimacy♡
- 简介：NSFW + 情感增强模块
- 视觉：绿黑，扁平、轻隐秘感

---

## 输入来源
1) 手动输入（自由编辑）
2) 一键模板填入（手动触发，不自动覆盖）
3) 从 Quick/Deep handoff 续写
4) 从草稿本/人格库一键回填到 Intimacy

---

## 输出与保存
- 输出形式：模块片段（非完整人格）
- 默认保存：Draftbook（草稿本）
- 可复制：当前模块文本

---

## 参数结构（v0.1）

### A. 基底层（全场景可见）
1. 感知精度 Perception
   - low / mid / high
2. 情绪-生理耦合 Affect-Body Coupling
   - weak / medium / strong

### B. 调色层（亲密场景主发力）
3. 显性程度 Explicitness
   - 0 茶汤
   - 1 微辣
   - 2 成人
   - 3 露骨
4. 情感黏度 Bond
   - restrained / warm / clingy / possessive
5. 主动性 Agency
   - receptive / balanced / initiating
6. 节奏掌控 Pacing
   - soft / progressive / pressing

---

## 触发护栏
- 默认条件触发：未进入亲密语境时，仅允许低显性身体线程（呼吸、停顿、距离、温度）。
- 高显性词汇仅在用户明确进入亲密语境后启用。

---

## 模板分档（v0.1）
每档至少 2 个模板按钮：
- 茶汤（拟人增强）
- 微辣（亲密增强）
- 成人（感官增强）
- 露骨（高显性）

模板要求：
- 一键可用
- 可直接改写
- 语言清晰，便于仿写

---

## 首版默认值（建议）
- Explicitness: 1（微辣）
- Perception: mid
- Coupling: medium
- Bond: warm
- Agency: balanced
- Pacing: progressive

> 目标：避免“点了像没变化”，同时不在非亲密场景失控。
