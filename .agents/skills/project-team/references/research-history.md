# Project Team：协议讨论原文与设计取舍（2026-11-08）

本文是 `project-team` Skill 的**讨论档案**，供后续迭代时按需查阅，不参与日常运行。
主要依据是本轮对话中的用户要求和决定。下列引用保留用户原文的用词、大小写与语序；引文之外的说明用于标识前后关系。**讨论中的判断和设想无须被包装为已验证的经验事实。**
GitHub 链接只用于定位随后完成的修改、审查和劳动记录，不能替代或证明讨论判断的“真实性”。

## 用户原文：方案如何形成

### 1. 从成员看板转向成员自己维护状态

> 应该是team看板，同步每个成员在干什么工作，并指向工作链接。任务内容仍交由issue/pr处理

随后明确状态维护的所有权及字段：

> 应该由成员自己维护自己的状态。
>
> 考虑让被初始化的成员在index issue下回复，并持续维护自己的工作状态这一条评论包括lead自己，不要改issue自身。issue正文由lead维护。回复不使用表格（回复给我的时候可以使用），使用yaml代码块来维护这几个字段，需要补充start和end两个时间字段，start是doing开启的时间，此时end为-；end是改为done，detail更新为简短的完成状态的时间，此次修改不应变更start。
>
> 移除detail字段，替换为task/result两个字段，记录from字段来展示这个任务来自哪个角色。

这时的候选方案仍将所有成员状态集中在 Team Index 的评论区；后面的讨论改变了这一放置位置。

### 2. 收敛 Team Index 正文

> 移除掉正文的状态维护，在skill中也也除掉。

这条要求当时针对共享 Index 的正文，避免由 Lead 代替各成员维护工作状态。之后确定每成员独立 Issue，正文再由该成员维护自身状态。

### 3. 交叉写入与队列问题成为新需求

> 这里其实要讨论交叉写入的问题，即下一个面对的场景，通过issue yaml派发任务
>
> 我设想的是在对应的状态中留一个地方，由其他member发布简短request，member完成后补充完成记录，并同步当前状态。考虑到竞态和队列问题，最好的解决方法是每个member开一个issue。我们讨论有没有更简的方案

这里的“竞态和队列问题”是用户提出的设计风险与下一阶段场景；这段话没有声称已复现 GitHub 写入冲突。

### 4. 确认每个成员一个 Issue 和 Request 最简字段

> 采用每个member一个issue，在初始化时应新建这个issue，body写入职责。并请求第一个初始任务。agent获得初始化提示词中包含这个issue链接。
>
> 我们还引用完整的刚刚的yaml评论字段，只是把from这里换成对应的issue comment连接楼层。发布任务请求就可以直接在对应member issue中回复即可。最简字段是from request两个字段，一个回复中可以包含多个任务请求，request可以是个列表

这里确认了 Member Issue 的创建时机、初始化提示中的链接和批量请求的最简形状；随后进一步调整了状态和结果记录的字段归属。

### 5. 状态写入正文，Result 作为劳动记录

> 成员status在issue body中，由成员自己维护。显然只有busy/idle两种状态，增加一个latestwork字段，指向result或者request，一句简短的描述。
>
> result评论需要task指向request回复，result执行结果（允许列表，有成果可以写链接，第一句必须是简短的自然语言描述），handoff指向下一步派发出的任务的链接（如果有，否则不写这个字段），start/end
>
> 一共五个字段。这个作为agent的“劳动”记录

这段原话界定了两个独立的记录载体：成员自己编辑 Issue 正文中的 `status/latestwork`；成员通过追加 Result 评论保存工作结果与时间。Result 的五个字段为 `task`、`result`、可选 `handoff`、`start`、`end`。

### 6. 明确 Handoff 和 Lead 的职责

> handoff实际上是简短的描述+这个成员给另一个成员的下一任务的链接
>
> lead同时维护team index和自己的member page，仍有一些任务需要lead去做

这里要求 Handoff 指向**实际派发给其他成员的下一条 Request**，且包含简短说明。Lead 同时承担 Team Index 维护者与普通任务接收者的职责。

### 7. 对本次 Skill 迭代和档案的要求

> 根据同仓库的skill写法和迭代演进规则，重新审查最终的skill文本

> 修复这些问题。
>
> 注意同时提取我们这次更新的讨论，将一些原则和决定写入reference，作为此次的更新依据，这也写在我们迭代式skill的内容中

> 这些依据大多是我们的讨论内容，并且尽可能保留我的原文。你无法验证它的“真实性”

最后一条进一步限定了本档案的表述方式：保留讨论原文，不以“真实性核验”评判用户提出的观点或方案。

## 当前决策：从原文提取的运行规则

以下为对上方原文及本次协作决定的**压缩整理**，不作为用户逐字引文：

- Team Index 只保存成员目录与 Member Issue 入口；Lead 维护目录。
- Lead 初始化成员时创建长期 Member Issue，正文写职责和初始状态，并发布第一条 Request；初始化提示词包含 Member Issue 链接。
- Request 通过接收成员 Issue 的评论追加，使用 `from` 和 `request`，后者允许列表；Request 评论链接是任务引用。
- Member Issue 正文中的 `status` 只有 `busy/idle`；`latestwork` 记录一句话和最近的 Request 或 Result 链接，由成员本人更新。
- Result 评论保存 `task/result/[handoff]/start/end`；`task` 指向 Request，`result` 开头是自然语言简述，支持多个结果与成果链接。
- `handoff` 仅在实际向另一成员发出下一条 Request 后填写，包含简述和该 Request 评论链接。Lead 也使用自己的 Member Issue 接收和完成 Request。

仓库审查后补充的规则与上述用户原文分开归属：成员恢复时将 Request 与 Result 按 URL 关联，默认先处理最早待办；`idle` 不代表没有待处理请求。Result.handoff 与交给用户的 next-hop 提示应引用同一条 Request。它们是 Skill 审查提出、由后续修改采纳的**执行建议**，不应倒写为用户的原话。

## 方案取舍及其性质

这些方案在讨论中经历了调整，属于当时的设计选择与风险判断：

- **共享 Index 正文维护所有成员状态**：需要跨成员编辑同一正文，状态更新责任难分配。
- **共享 Index 下每成员一个固定 YAML 评论**：改善了评论的编辑归属，但未来 Request 都进入同一评论区，需要按成员筛选。
- **每成员独立 Issue**：为成员提供固定的职责、状态及收件位置。其他成员追加 Request，接收成员编辑自己的正文并追加 Result。
- **每任务独立 Issue / 额外队列系统**：本轮未采用。现阶段选择 GitHub 原有 Issue 和评论能力，后续以实际积压、重试或并发问题再判断是否需要扩展。

上述取舍不等于对其他方案的失败作了实测证明，也不等于 GitHub 已提供成员级隔离或自动调度。

## 可核对的 GitHub 操作记录

这些链接可核对**发生过的记录与仓库状态**；它们与讨论原文的性质不同：

- [Team Index #7](https://github.com/Ri0n72Y/agent-identity/issues/7)：成员目录。
- [Lead Member Issue #22](https://github.com/Ri0n72Y/agent-identity/issues/22) 与 [Skill Reviewer Member Issue #23](https://github.com/Ri0n72Y/agent-identity/issues/23)：成员正文、Request/Result 评论及状态更新。
- [Reviewer 完成记录](https://github.com/Ri0n72Y/agent-identity/issues/23#issuecomment-6721119750)、[向 Lead 派发的下一任务](https://github.com/Ri0n72Y/agent-identity/issues/22#issuecomment-6721117600)、[Lead 合并记录](https://github.com/Ri0n72Y/agent-identity/issues/22#issuecomment-6721154851)：一次跨角色交接的实际产物。
- [PR #21](https://github.com/Ri0n72Y/agent-identity/pull/21)：协议变更与当时的独立审查；[PR #24](https://github.com/Ri0n72Y/agent-identity/pull/24)：针对最终 Skill 文本的定点修订与本档案。

现有记录没有验证多个会话同时修改同一成员 Issue 正文、异常中断后的恢复、复杂请求积压、任务优先级公平性或自动唤醒。不要将尚未执行的场景写成失败案例或成功验收。

## 本次定点修订的归属

最终文本审查提出四项修订：消除对现行 Request/Result 的旧约束冲突；明确恢复时如何寻找待办；让 Skill 的描述反映 GitHub Issues 依赖；让 copy-ready next-hop 使用与 Result.handoff 一致的 Request 链接。这四项是**审查意见及本次实施决定**，上文用户原话提供了需求背景。

按照 [skill-authoring](../../skill-authoring/SKILL.md) 的迭代规则，`SKILL.md` 保留日常执行真正需要的约束；本档案保存讨论、方案取舍和可回溯的记录。后续应根据新的实际执行结果修订规则，不能因为这里记录过某个判断，就将它当作无需再审查的事实。
