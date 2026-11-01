# 记忆架构：生命周期、元素与文件结构

[English](memory-workflow.md) | [简体中文](memory-workflow_ZH.md)

> **状态：** 已讨论确定的概念设计和参考布局。不是已部署的记忆插件、强制存储格式，也不宣称 AI 拥有与人类相同的认知。
>
> **规范归属：** [记忆模型](memory-model.md) 定义各层的语义边界。[Reflection](reflection.md)、[mPFC](../mpfc/README.md)、[SOUL](../soul/SOUL.md) 和 [Runtime](runtime.md) 分别说明身份反思、身份状态和运行边界。本文把这些内容组织成完整的工作流程。
>
> **数据归属：** \`agent-identity\` 保存身份模型和经过审核的身份状态。实际 Session、项目状态及未来的记忆数据由使用它的 Harness 和对应工作区保存。下方的目录示例**不代表仓库中已经部署这些运行时目录**。

## 1. 系统总览

该设计包括一条**认知固化路径**、两条**导航与知识路径**，以及一条**经过审核的身份演化路径**。它们承担不同职责，可以相互引用。

~~~text
Harness Session / 当前上下文
                |
                v
       Short（跨上下文、持续更新）
                |
                v
      固化阶段 Reflection
      （选择、比较、分类、修正）
                |
                v
        Episode（带日期的历史）
          /             \
   Experience           Event
 （Self/User相关）     （其他事件）
          |             |
          +------+------+
                 |
               Diary
       （周/月自然语言聚合索引，
           与 Episode 同步建立）
                 |
            Episode 引用
                 |
         原始 Session / 证据

事实及外部资料 <----> Bookshelf
      ^                    ^
      |                    |
      +-- Episode / Diary / mPFC 仅引用，不复制事实

Experience + 相关证据 + 当前 SOUL / PRINCIPLES
                 |
                 v
          身份 Reflection
          （需要审核）
                 |
                 v
       mPFC（解释、依据、
             反证及修正过程）
                 |
                 v
         审核通过后更新
                 |
                 v
         SOUL / PRINCIPLES
          （压缩后的有效结论）
~~~

这里的 **Reflection 有两种用途**：

1. **固化阶段 Reflection**：检查 Short 的时间变化，辨认有长期价值的内容，将 Episode 分类为 Experience 或 Event。每个 Episode **不必**进行身份审核，也不要求额外启动一个专用 Agent。
2. **身份 Reflection**：以已有 Experience、事实来源和当前身份为依据，评估是否应调整自我认识或长期原则。它使用 Harness 已有能力，并保留审核结论。即使结论是**不改变身份**，也需要在 mPFC 留下记录。

这不是要求每一条消息依次经过所有层级。日常任务和 Session 的运行仍由 Harness 管理。

## 2. 记忆元素与职责

| 元素 | 回答的问题 | 保存内容或作用 | 不应承担 |
| --- | --- | --- | --- |
| **Working Context** | 本次推理可以看到什么？ | 当前对话、已加载指令和工具结果。 | 长期历史存储。 |
| **Short** | 哪些近期状态必须跨越上下文边界？ | 近期事件、当前状态、尚未解决的问题、正在演化的结论；保持精简。 | 完整对话副本、永久事实库。 |
| **固化 Reflection** | 实际发生了什么、发生什么变化，什么值得长期保存？ | 比较 Short 的不同阶段和证据，筛选、整理、分类。 | 第二套运行框架、自动改写 SOUL。 |
| **Episode** | 何时、为何、做过什么、得到什么结论？ | 按时间保存事件及当时结论；后续纠错通过关联记录表达。 | 复制 Bookshelf、改写原始 Session。 |
| **Experience** | 此 Episode 与 Self、User 或双方关系有什么关联？ | Episode 的正式分类之一，可作为身份 Reflection 的候选依据。 | 单独的人格文件、必然发生的身份变化。 |
| **Event** | 哪些事件尚未识别出 Self/User 关联？ | Episode 的另一种正式分类，仍保留历史价值。 | 永久断言该事件不会与身份有关。 |
| **Diary** | 某段历史讨论在哪里？ | 按周/月聚合自然语言摘要、日期及 Episode 引用。 | 取代 Episode 记录或建立第二份事实库。 |
| **Bookshelf** | 哪些具体事实、知识及来源支持结论？ | 长期事实、文档、引用资料、相关知识及修正。 | Episode 的事件时间线、额外的 Resource/Facts 层。 |
| **mPFC** | 经历如何形成、挑战或修正自我认识？ | 身份解释、证据引用、竞争性解释、修订依据和审核记录。 | 改写 Episode、整篇复制来源。 |
| **SOUL** | 当前有效的身份结论是什么？ | 简短、可供 Root 日常使用的结论；可以由人工初始化。 | 详细的历史解释、任务、权限、项目约束。 |
| **PRINCIPLES** | 哪些跨项目工作习惯已成为长期默认原则？ | 反复实践后经审核提炼的稳定倾向。 | 单个项目的硬性规则。 |

**Self 与 User 是关联性判断的视角**，不是额外的 Episode 分类，也不是必须存在的两个文件。Episode 只有 **Experience** 与 **Event** 两种正式类型。关于 Others 的内容通常进入 Event；如果同时体现了与 Self、User 或双方关系的关联，也可以归为 Experience。

某条 Episode 的历史结论可以被后续证明有误，但不能因此删除。mPFC 中先前的理解也可以接受挑战，但其修正前的依据必须能够追溯。SOUL 保存的是当前压缩后的**结论**，而不是完整的身份叙事。

## 3. 写入与固化流程

### 3.1 日常工作：Harness 与 Short

Harness 已负责 Session、工具运行记录、上下文压缩、任务状态及其他基础运行能力。记忆模型应引用这些信息，而不是重新实现一套。

Short 负责跨上下文的近期状态，记录继续对话所需的信息。它可以随新证据变化。例如，临时决策、一次失败、用户纠正、修正后的新决定，都可能影响后续工作。

更新 Short **不能修改旧 Session**。Short 是当前仍有用的工作记忆表示，而历史发生了什么，应当仍能从 Harness 的原始记录中恢复。

### 3.2 Short → 固化 Reflection → Episode

固化时，检查相关 Short 记录及其证据：

1. 确定发生时间、触发原因、讨论或行动内容、当时的结论，以及来源引用。
2. 按时间保留必要的变化：最初判断、实际结果、纠正、修正后的结论。
3. 如果内容与 Self、User 或双方关系有关，将 Episode 分类为 **Experience**；否则为 **Event**。
4. 具体事实与来源保存在 Bookshelf，或引用已存在的资料。Episode 不需要复制完整知识库。
5. 将 Episode 放入有界的日期分块。长期主题可以产生后续分块，不应无限延长一个文件。
6. **在同一次固化操作中**更新相应 Diary 周期和 Episode 引用。

“同一次操作”要求 Episode 与 Diary 的更新保持一致，**不意味着必须新建数据库、调度器、事务管理器或后台 Agent**。优先使用已有 Harness/存储能力。如果写入中断，应先恢复两者的一致关系，再认为索引更新已经完成。具体恢复方法留待实现阶段确定。

后续 Reflection 可能发现某个旧 Event 实际与 Self/User 有关。此时应保留旧记录，添加带日期的关联更新，并让相关 Experience 参与后续反思，而不是悄悄重写事件历史。

### 3.3 Episode → Diary：周期聚合与封存

Diary 是 Episode 的**自然语言聚合索引**，不是另一份具有独立权威的历史正文。

- **当前周期**：开头压缩概括此前做过的事，随后按日期记录本周或本月相对详细的进展，并链接 Episode。
- **周期结束**：封存本周期。新周期从相应的既往记录中整理承接摘要，必要时保留历史引用。
- **较早周期**：按需检索。开头的压缩回顾帮助定位，不取代详细 Episode 或原始 Session。
- **分块粒度**：周、月是可选方式，按活动密度及文档长度确定，不强制统一日期跨度。
- **后续纠正**：在新 Diary 条目中引用修正事件，说明发生的改变。已封存的旧结论不应被悄悄改写。

Diary 不需要重建 Harness 的搜索引擎。它在原有检索能力之上增加便于阅读的聚合叙事与时间连续性。

### 3.4 Episode / Bookshelf → 身份 Reflection → mPFC → SOUL

Experience 是**可供评估的证据**，并不自动导致人格或身份变化。

Root 选择相关 Experience、Bookshelf 来源、现行 SOUL/PRINCIPLES 和以往 mPFC 记录。身份 Reflection 对这些证据作出评估，必要时提出修改建议。经人工审核接受的修改才能更新有效身份；没有变化或审核不通过，也要在 mPFC 保存评估结果。

mPFC 应解释一项认识**为什么**形成、得到强化、遭到挑战、被修正或最终未被采纳，并链接原始 Episode 和证据。它不能变成第二份 Episode 对话纪要。

SOUL 只保存当前结论。其初始状态可以由人工编写，因此某个初始 SOUL 条目**可能没有 mPFC 起源**。不得为了说明其由来而编造历史。后续通过 Reflection 演化时，必须保留真实的审核与修订记录。PRINCIPLES 同样只保留经审核的跨项目默认原则，而不是项目局部约束。

**单条 Experience 不会自动进入 SOUL。**

### 3.5 完整示例：一次纠错如何成为 Experience

以下是**说明性例子**，不是已经存在的记忆记录，也不是身份证据已经成立的证明：

1. **对话 / Short**：Agent 提议新增记忆服务。用户指出 Session 与任务运行能力已由 Harness 提供。Short 保留纠正后的现行决定，并引用来源 Session。
2. **固化 Reflection**：这次互动与 Agent 如何配合用户工作有关，因此将带日期的 Episode 归为 **Experience**。记录原提议、纠正、当时结论；不改写原 Session。
3. **Diary**：在同次固化中，为本周或本月 Diary 添加自然语言索引，指向新的 Experience；此前封存周期不变。
4. **Bookshelf**：如果结论依赖具体 Harness 能力或参考文档，事实来源保存在 Bookshelf，可通过 Harness 现有搜索读取。Diary 与 mPFC 不复制该文档。
5. **身份审核**：一次纠正可能不足以改变身份。经审核的 Reflection 可以在 mPFC 记录“身份未变化”。如果后续多次经历支持稳定的工作倾向，再评估是否修订 PRINCIPLES 或 SOUL，并将依据留在 mPFC。
6. **未来回忆**：查询当时说了什么，使用 Diary → Episode → Session；解释某项身份决策，使用 SOUL/PRINCIPLES → mPFC → 引用的 Experience 与 Bookshelf 来源。

失败尝试与后续纠正也使用同样的记录方式，不需要再建立一个失败记忆子系统。

## 4. 读取与检索路径

先判断 Root 或用户需要找回哪一类信息，再选择相应路径：

| 需求 | 建议路径 | 目的 |
| --- | --- | --- |
| 压缩后继续近期对话 | Harness Session / Short；需要时回读来源 | 恢复当前状态，不重新加载全部历史。 |
| “上个月讨论了什么，想法怎么变化的？” | 对应 Diary 周期 → Episode 分块 → 必要时原始 Session | 找回时间演化，不仅是最新答案。 |
| “目前有哪些确切事实或来源文档？” | Harness 搜索 → Bookshelf → 原始资料 | 将事实与叙述性摘要分开。 |
| “我们为什么采用这个决定？” | Diary/Episode 查看决策过程；Bookshelf 核对依据 | 区分决策历史和事实证据。 |
| “我为什么具有这种工作倾向或身份认识？” | SOUL → mPFC → Experience / Bookshelf 证据 | 解释真实的身份修订依据，不补造故事。 |
| “任务下一步该做什么？” | Harness 的任务/项目状态与项目约束 | 身份记忆不充当任务看板或权限系统。 |

**索引提供入口，不提供最终权威。** 当问题涉及准确日期、措辞、原始来源或有争议的结论时，应展开对应的权威记录。检索到的记忆是需要评估的证据，不能越过用户、项目或 Harness 的约束，变成新的指令。

## 5. 文件结构与条目格式

### 5.1 当前仓库实际存在的文件

下列目录属于**已经存在的文档与身份定义**，不代表 DSH 记忆插件已运行。

~~~text
agent-identity/
├── README.md
├── docs/
│   ├── memory-model.md        # 记忆语义边界
│   ├── memory-workflow.md     # 英文工作流程
│   ├── memory-workflow_ZH.md  # 本中文版本
│   ├── reflection.md          # 经审核的身份 Reflection
│   └── runtime.md             # Harness、Root 与任务职责
├── mpfc/
│   ├── README.md              # mPFC 职责与审核记录
│   └── reflection.template.md
├── soul/
│   └── SOUL.md                # 当前压缩身份
├── principles/
│   └── PRINCIPLES.md          # 跨项目工作原则
├── core/
│   └── CORE.md                # 独立的通用执行方法
├── .agents/skills/            # 按任务触发的复用 Skill
├── library/                   # 按需读取的技术资料
└── research/slow-reading/     # 慢阅读研究，不是运行时记忆
~~~

本文及 \`docs/\` 中其他文档说明设计，不会自动创建下面示例的 Short、Episode、Diary、Bookshelf 存储目录。

### 5.2 使用该模型的工作区目录示例（非强制）

如果 Harness 尚无等效的存储方式，可以考虑以下**一种可能的组织形式**。文件名、ID、具体格式和日期边界都只是示例，不代表已批准的强制 Schema，也不要求迁移现有数据。

~~~text
<agent-or-user-owned-workspace>/
├── short/
│   └── current.md             # 跨上下文的当前 Short
├── episodes/
│   └── 2026/
│       └── 10/
│           ├── 2026-10-27.md  # 带日期的 Episode 分块
│           └── 2026-10-29.md
├── diary/
│   └── 2026/
│       ├── 2026-W43.md        # 已封存周期
│       └── 2026-W44.md        # 既往摘要 + 当前详细索引
└── bookshelf/
    ├── topics/                # 事实与知识
    └── sources/               # 来源与参考资料

# 身份状态仍在 agent-identity/soul、principles 和 mpfc 中。
# Session、任务、权限及执行历史仍由 Harness 保存。
~~~

不要求 Experience 和 Event 分成两个目录。它们可以作为同一个日期分块中的两种 Episode 类型。一个 Episode 可以引用多个 Bookshelf 来源；同一份来源资料也可以被多个 Episode 引用。

针对 DSH 插件，先将上述概念映射到 DSH 已有 Session、搜索、项目文件及插件存储。只有现有设施无法表达必要语义时，才增加新文件。不要仅因为其他项目使用了 Failure、Facts、Resource、Rule、Task 或 Workflow 等名称，就重复建立这些存储层。

### 5.3 已商量的自然语言条目格式（不是解析器 Schema）

之前约定 Short 和 Episode 都采用**简短方括号头部 + 自然语言正文**，而不是复杂的 JSON/YAML 数据条目。以下定义可读的记载形式；仓库**尚未实现强制解析器、稳定 ID 规则或固定落盘目录**。

**Short** 使用紧凑头部。会话部分可选；\`pending\` 与 \`done\` 表示反思处理状态，不代表事实已验证或身份变更已获批准。

~~~text
[日期][项目[:会话]][时间][reflection:pending|done] 自然语言记忆正文
~~~

~~~text
[2026-10-29][agent-identity:memory][15:29][reflection:pending] 讨论 Episode 与 Diary 的关系。决定 Episode 分为 Experience 与 Event，按日期分块，并在固化时同步更新 Diary。

[2026-10-30][agent-identity:memory][10:15][reflection:done] 已完成相关讨论的固化。Short 保留当前决定；历史变化保存在 Episode 与原始 Session 中。
~~~

每条 Short 通常用一至两行自然语言。随工作推进可以更新现行 Short 状态；出现需要重新反思的新情况时，可以将状态改回 \`pending\`。但更新 Short **不代表覆盖原始 Session 或已固化 Episode**。

**Episode** 采用同样的基本日期、项目、时间头部，正文保留更完整的历史。Experience 与 Event 是它的两种正式分类；使用标题来呈现分类只是可读方案，**不是新增的强制文件或字段**。

~~~text
[日期][项目[:会话]][时间] 自然语言历史记录
~~~

~~~md
## Experience

[2026-10-29][agent-identity:memory][15:29]
最初考虑增加更多记忆子系统，用户指出 Harness
已经管理 Session 持久化和相应运行机制。
重新检查后，决定保留现有认知周期，不重复建设。
这次讨论与 Agent 怎样配合用户工作有关。

来源：<原始 Session 引用>、<必要时的 Bookshelf 来源>

## Event

[2026-10-30][agent-identity:memory][10:15]
记忆模型文档更新完成：Episode 分为 Experience
和 Event；Diary 与 Short → Episode 的固化操作同步更新。

来源：<原始 Session 引用>
~~~

后续 Episode 可以引用旧 Episode，纠正过去的理解。不能改写旧 Session、倒填当初尚不知道的结论，或在 Episode 中复制整份 Bookshelf 资料。稳定 ID 和链接语法仍由后续实现确定。

**Diary** 是按周期聚合的自然语言索引。开头压缩承接之前的经历；本周期按日期相对详细地记录进展，并链接对应 Episode。周/月结束后可以封存。

~~~md
# Diary — 2026-W44

## 此前的经历（压缩回顾）
此前建立了 Short → Episode 的固化流程，并区分了
Episode 历史与 Bookshelf 事实。
参考：<前一 Diary 周期>、<Episode ID>

## 本周记录

### 2026-10-29
确定 Experience / Event 的分类和 Diary 的固化周期。
Episodes: <Episode ID 或路径>

### 2026-10-30
对先前决定进行了纠正，同时保留旧记录。
Episodes: <新 Episode ID 或路径>、<旧 Episode 引用>
~~~

Bookshelf 继续保存具体事实、知识和来源文件，并通过 Harness 的现有检索能力读取。Diary 与 Episode 可以引用 Bookshelf，但不能复制整个事实库。mPFC 使用现有身份 Reflection 记录解释、证据和审核后的身份修订；SOUL 只保留当前结论。

这些示例解释可读格式及数据归属，**不是已经部署的存储 Schema**。示例日期、ID 和来源标记仅供说明。

## 6. 核心约束与常见失效方式

1. **不覆盖历史。** 纠正产生新的关联状态，旧 Session 与当时的结论仍然可以区分。
2. **Short 必须跨上下文。** 它不是当前提示词窗口的别名，也不是完整的对话归档。
3. **Episode 只有两种正式类型。** Experience 与 Self/User 相关，Event 则未识别出这种相关性；Self/User 是判断视角而不是强制文件。
4. **Diary 与 Episode 在固化时同步更新。** Diary 是按日期组织的自然语言索引与承接摘要，不是第二份权威事件或事实库。
5. **Bookshelf 保存事实及其来源。** 其他记录可以引用它，检索复用 Harness 已有能力。不另建重复的 Facts 或 Resource 层。
6. **mPFC 解释身份演化，Episode 记录发生过什么。** 一条 Experience 不会自动变成长期身份特征。
7. **SOUL 简短且以结论为主。** 允许人工初始化；后续变化需要审核，不应捏造形成过程。
8. **项目约束、任务状态、工作流、权限、Session 日志与执行设施各归其主。** 记忆设计不赋予额外权限，也不建立第二个 Harness。
9. **失败与无变化结论同样重要。** 失败尝试可以留在 Episode；Reflection 判断身份不变时仍要保留 mPFC 记录。
10. **设计不等于已经验证的效果。** 本文不能证明自动固化、跨文件一致性、检索质量或长期认知能力已获得实测验证。

## 7. 尚未实现或确定的事项

仓库尚未提供 DSH 记忆插件、持久化后端、运行时 Schema、调度器、解析器、迁移后的历史数据或实际运行的索引。实际使用时，需要结合 Harness 提供的能力确定 Short、Episode、Diary 与 Bookshelf 的**具体存储位置和方式**。

文件名规则、稳定标识符、周期切换条件、跨文件更新一致性及检索索引的具体技术方案都没有定稿。应先检查 Harness 的现有功能，并用具体场景验证缺口，再决定是否增加实现。

[慢阅读研究](../research/slow-reading/paper-plan.md) 是另一项独立实验：在尚未看到未来文本的条件下，能否保留逐步形成与修正的解释轨迹，并不能仅凭本记忆架构的设计得到证明。

---

精简的规范定义见[记忆模型](memory-model.md)；身份审核过程见 [Reflection](reflection.md) 与 [mPFC](../mpfc/README.md)；运行边界见 [Runtime](runtime.md)。
