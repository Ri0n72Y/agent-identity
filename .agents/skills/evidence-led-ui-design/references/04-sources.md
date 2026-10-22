# 04｜研究来源与证据等级

核查日期：2026-10-22。链接指向公开的一手资料或社区原始讨论。**列表并非文献系统综述**，也没有对来源的全部历史版本做复现测试。以下编号在其他文件中引用。

评级方式：`规范/标准` 是可核对的技术要求（注意适用范围）；`设计研究/专业实践` 是较可靠的参考方法但需结合场景；`工具作者自述` 仅证实工具怎样自我定位；`社区观察` 不能代表总体。

| ID | 来源与链接 | 类别 | 可确认内容与本次用途 | 主要局限 |
|---|---|---|---|---|
| R01 | [Anthropic frontend-design (官方仓库)](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | 工具作者自述 | 要求做有意图的视觉选择，摆脱无依据的模板风格 | 不是正式 UX 实验结果 |
| R02 | [Impeccable (作者仓库)](https://github.com/pbakaus/impeccable) | 工具作者自述 | `shape`、`critique`、`audit`、`harden` 等分层功能，有技术审查与设计批评之分 | 广泛功能与作者审美规则不等于普适做法 |
| R03 | [UI UX Pro Max (作者仓库)](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 工具作者自述 | 设计建议/知识库式 Skill；提供大量风格、配色、框架建议 | 数量和 GitHub 关注度不是质量保证 |
| R04 | [UX-Context Design (NN/g, 2026-07-24)](https://www.nngroup.com/articles/ux-context-design/) | 设计研究/专业观点 | AI 生成缺少产品上下文；讨论 DESIGN.md 和假设性 UX.md，主张持续维护知识 | 作者明确列出尚未解决的研究问题 |
| R05 | [The Custodial Era of UX (NN/g, 2026-08-28)](https://www.nngroup.com/articles/ai-ux-debt/) | 设计研究/专业观点 | AI 快速生成但评价滞后可能积累 UX debt；应提前引入 UX 判断 | 不是特定产品的因果实验证明 |
| R06 | [10 Usability Heuristics (NN/g, 2024 review)](https://www.nngroup.com/articles/ten-usability-heuristics/) | 专业启发式 | 系统状态、用户控制、一致性、错误恢复等通用审查维度 | 是启发式，不是可自动判定的验收规格 |
| R07 | [How to Conduct a Heuristic Evaluation (NN/g)](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/) | 专业实践方法 | 建议独立评价、合并发现；明确不能代替真实用户研究 | 发现风险并不等于证明真实用户困难 |
| R08 | [WCAG 2.2 — Text Contrast (W3C)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | 规范解释 | 普通文本 4.5:1、大文本 3:1，明确列有例外 | 单项检查不构成完整无障碍符合性 |
| R09 | [Reddit: So Many Websites Look The Same With AI (2026)](https://www.reddit.com/r/webdesign/comments/1t3ymps/so_many_websites_look_the_same_with_ai/) | 社区观察 | 对同质化的抱怨；同时有“常规布局也可能是好设计”的反对意见 | 自选样本，参与者感受不代表总体 |
| R10 | [Reddit: Why is every AI website designed the same? (2025)](https://www.reddit.com/r/webdesign/comments/1m2om61) | 社区观察 | 指向 SaaS 风格、配色、卡片等重复模式的讨论 | 非结构化的主观观察 |
| R11 | [Reddit: What is the best way of having Claude review UIs? (2026)](https://www.reddit.com/r/ClaudeAI/comments/1rmd78z/what_is_the_best_way_of_having_claude_review_uis/) | 社区观察 | 开发者提出截图审查与自动化的实操问题 | 无法证明截图审查的量化收益 |
| R12 | [Google Labs DESIGN.md (官方仓库)](https://github.com/google-labs-code/design.md) | 格式提案/工具上下文 | 为 Agent 保存视觉身份与设计规则的结构化格式 | 不等于所有项目必须采用此格式 |
| R13 | [WCAG 2.2 — Target Size (Minimum) (W3C)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | 规范解释 | AA 基本门槛 24×24 CSS px，附有多项例外 | 不能把 44px 之类的最佳实践错误写成此项硬性门槛 |
| R14 | [How Many Test Users? (NN/g)](https://www.nngroup.com/articles/how-many-test-users/) | 专业实践方法 | 探索性定性可用性测试常用较少受试者；明确有例外 | 不能用于估计用户整体通过率 |
| R15 | [Agent Skills specification](https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx) | 文件格式规范 | `SKILL.md` 的 YAML frontmatter 与按需加载的 `references/` | 仅规定 Skill 结构，不保证效果 |
| R16 | [Design Tokens Format 2025.10 (DTCG)](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/) | W3C 社区组最终报告 | Design tokens 交换格式；跨工具一致性思路 | **不是 W3C 正式标准**；当前并不需要为本 Skill 强制引入 tokens 文件 |

## 重点补充：研究证据不等于项目验证

- 没有直接验证本 Skill 对 UI/UX 结果的改善。
- 尚未核查这些 Skill 在多个目标项目上是否稳定有效。
- 尚未整理专业设计师对本 Skill 的反馈。
- 尚未进行真实用户任务测试。

若要扩大调研，优先收集：真实界面的 before/after、操作任务证据、设计师指出的错误、以及能够复现的失败案例。不要仅继续积累风格图片或工具名称。