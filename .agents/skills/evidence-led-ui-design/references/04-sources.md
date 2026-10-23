# 04｜资料来源、可证实范围与局限

核查日期：2026-10-23（R24–R33 为本次设计发现对话调研新增）。以下是**选取的来源清单，不是系统文献综述**。编号供研究与方法文件引用。优先引用一手页面；工具仓库只能确认其提供的工作方法，不能证明实际 UX 效果。

| ID | 来源 | 类型 | 本 Skill 可借鉴的事实及限制 |
|---|---|---|---|
| R01 | [Anthropic frontend-design](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | 工具作者主张 | 强调依据题材选视觉语言、排版、动效与反馈；反模板审美不是普适禁令。 |
| R02 | [Impeccable critique](https://github.com/pbakaus/impeccable/blob/main/skill/reference/critique.md) 与 [audit](https://github.com/pbakaus/impeccable/blob/main/skill/reference/audit.md) | 工具作者实现 | 分开设计批评和可测技术检查；其评分、并行代理及流程并非必须沿用。 |
| R03 | [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 工具作者主张 | 提供可检索的风格/组件建议，不能据规模证明效能。 |
| R04 | [UX-Context Design — NN/g](https://www.nngroup.com/articles/ux-context-design/) | 专业研究/观点 | AI 需要持续的产品与用户上下文；UX.md 为探索性建议而非标准。 |
| R05 | [The Custodial Era of UX — NN/g](https://www.nngroup.com/articles/ai-ux-debt/) | 专业观点 | 快速生成与滞后评估可能形成 UX debt；不是特定项目效果证明。 |
| R06 | [Ten Usability Heuristics — NN/g](https://www.nngroup.com/articles/ten-usability-heuristics/) | 专业启发式 | 状态、控制、错误预防、可识别性等评审维度；非用户测试。 |
| R07 | [How to Conduct a Heuristic Evaluation — NN/g](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/) | 专业实践 | 启发式评价适合识别风险，不能替代目标用户行为。 |
| R08 | [WCAG 2.2 Understanding Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | W3C 规范解释 | SC 1.4.3 AA 常规文字 4.5:1、大文字 3:1，有例外。 |
| R09 | [Reddit — AI websites looking alike](https://www.reddit.com/r/webdesign/comments/1t3ymps/so_many_websites_look_the_same_with_ai/) | 社区观察 | 关于视觉同质化及常规交互价值的讨论，不能估计总体发生率。 |
| R10 | [Reddit — AI website design sameness](https://www.reddit.com/r/webdesign/comments/1m2om61) | 社区观察 | SaaS 风格重复的主观反馈，非代表性样本。 |
| R11 | [Reddit — reviewing UIs with Claude](https://www.reddit.com/r/ClaudeAI/comments/1rmd78z/what_is_the_best_way_of_having_claude_review_uis/) | 社区观察 | 截图审查等开发实践，不能证明收益。 |
| R12 | [Google Labs DESIGN.md](https://github.com/google-labs-code/design.md) | 格式/工具提案 | 设计 tokens + 文字理由的可持久化格式；非强制项目结构。 |
| R13 | [WCAG 2.2 Understanding Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | W3C 规范解释 | SC 2.5.8 AA 是 24×24 CSS px 或适用例外，不是通用 44px 强制值。 |
| R14 | [How Many Test Users? — NN/g](https://www.nngroup.com/articles/how-many-test-users/) | 专业实践 | 少量目标用户可发现定性问题；不推断总体比例。 |
| R15 | [Agent Skills specification](https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx) | 格式规范 | Skill 目录与元数据格式，不是设计质量标准。 |
| R16 | [Design Tokens Format 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/) | W3C 社区组报告 | 可交换 token 格式；不是 W3C Recommendation，也不意味着需引入。 |
| R17 | [Map and understand a user's whole problem — GOV.UK](https://www.gov.uk/service-manual/design/map-a-users-whole-problem) | 公共服务设计实践 | 从用户整个问题研究跨事务/跨渠道断点，可用轻量方式记录。 |
| R18 | [Mental Models — NN/g](https://www.nngroup.com/articles/mental-models/) | 专业论述 | 用户对系统的信念影响行为；不同经验导致差异，不能凭空假定某用户心理模型。 |
| R19 | [UX Strategies for Complex-Application Design — NN/g](https://www.nngroup.com/articles/strategies-complex-application-design/) | 专业研究/方法 | Understand、Explore、Materialize 可重叠且迭代；专业应用需要理解领域工作。**Evaluate 作为本 Skill 的显式阶段是作者合成，不是 NN/g 原模型的第四阶段。** |
| R20 | [Aesthetic-Usability Effect — NN/g](https://www.nngroup.com/articles/aesthetic-usability-effect/) | 专业论述 | 美观影响对易用性的感知，但可能掩盖功能问题。 |
| R21 | [Cognitive Walkthroughs — NN/g](https://www.nngroup.com/articles/cognitive-walkthroughs/) | 专业方法 | 四问检查可学性，无真实受试用户参与，所得是专家判断的风险。 |
| R22 | [Microsoft HAX Guidelines](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/) | 研究支持的 AI 产品设计指南 | 18 条 Human-AI 交互建议，涉及能力提示、出错、纠正及随时间的体验；仅针对适用的 AI 功能，不必对普通 UI 全部使用。 |
| R23 | [WCAG 2.2 Recommendation](https://www.w3.org/TR/WCAG22/) | W3C Recommendation | 2.1.1 (A) 键盘、2.4.7 (AA) 可见焦点、2.4.11 (AA) 焦点未完全遮挡、4.1.2 (A) 名称/角色/值、4.1.3 (AA) 状态消息等，依成功标准适用条件核查。 |


| R24 | [Writing an Effective Guide for a UX Interview — NN/g](https://www.nngroup.com/articles/interview-guide/) | 专业访谈方法 | 半结构化提纲允许随回答调序、跳过与追问；本 Skill 将其改造成委托者共同定义设计的对话，**不应称之为真实用户访谈**。 |
| R25 | [The Funnel Technique — NN/g](https://www.nngroup.com/articles/the-funnel-technique-in-qualitative-user-research/) | 专业访谈方法 | 从开放提问逐渐收窄，避免起初就暗示答案；非固定问答数量要求。 |
| R26 | [Avoid Leading Questions — NN/g](https://www.nngroup.com/articles/leading-questions/) | 专业研究方法 | 避免问题中预先植入答案和情绪判断；有选择题时给出开放选项。 |
| R27 | [History of the Double Diamond — Design Council](https://www.designcouncil.org.uk/resources/the-double-diamond/history-of-the-double-diamond/) | 专业设计方法 | Discover/Define 与 Develop/Deliver 区分问题和解决方案探索；不是强制线性流程。 |
| R28 | [Enterprise Design Thinking Framework — IBM](https://www.ibm.com/training/enterprise-design-thinking/framework) | 企业设计实践 | Hills 以用户成果定义设计意图，Playbacks 反复校准共识；不能替代真实用户。 |
| R29 | [spec-kit clarify — GitHub](https://github.com/github/spec-kit/blob/main/templates/commands/clarify.md) | AI 工程工作流 | 从初始规格识别影响重大的未决项、顺序追问并同步更新；其最多五问是其实现约束，不是 UX 标准。 |
| R30 | [GSD Discuss / Assumptions mode](https://github.com/gsd-build/get-shit-done/blob/main/docs/workflow-discuss-mode.md) | AI 工程工作流 | 区分问答模式与现有项目的假设确认模式，重复信息不再问；优先用于决策上下文而非机械复制目录。 |
| R31 | [Superpowers brainstorming](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md) | AI 工作流 | 根据缺失信息发起对话、提出方案与确认设计；对所有任务统一设置严格门禁，未必适合小变更。 |
| R32 | [Lovable Chat Mode / Follow-up Questions](https://lovable.dev/blog/chat-mode-and-questions) | 产品作者自述 | 提供从对话到构建的交互模式；未提供独立验证的 UX 效果。 |
| R33 | [How the discovery phase works — GOV.UK](https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works) | 公共服务实践 | 先理解真实问题、约束、替代方案与成功依据，再投入开发；大型服务 Discovery 的周期不能生搬硬套给简单 UI。 |

## 本轮判断和来源之间的界线

- 四阶段循环、最小 Experience Model、三维专业程度划分、三个纸面示例，属于**本 Skill 的设计选择**，不是对原始文献的逐字复现。
- Anthropic、Impeccable、Google 的官方原始仓库已检查其所宣称的工具与方法；**未**运行这些工具进行比较评测。
- 认知走查/专家设计意见只支持风险假设；A/B/C 都是纸面推演，**未**邀请真实受试者。
- 只列出可以解释某项规则的来源；本轮没有增加新工具依赖或 UI 产品实现。
