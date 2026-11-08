# Project Team：协议讨论原文与设计取舍（2026-11-08）

本文件保留本轮讨论的用户原话、设计取舍及后续执行记录，供迭代 Skill 时按需读取，不进入日常运行上下文。引文属于用户讨论；其余文字记录方案归纳或 GitHub 上的工作产物。

## 用户原文：方案如何形成

### 1. 从成员看板转向成员自己维护状态

> 应该是team看板，同步每个成员在干什么工作，并指向工作链接。任务内容仍交由issue/pr处理

随后明确状态维护的所有权及字段：

> 应该由成员自己维护自己的状态。
>
> 考虑让被初始化的成员在index issue下回复，并持续维护自己的工作状态这一条评论包括lead自己，不要改issue自身。issue正文由lead维护。回复不使用表格（回复给我的时候可以使用），使用yaml代码块来维护这几个字段，需要补充start和end两个时间字段，start是doing开启的时间，此时end为-；end是改为done，detail更新为简短的完成状态的时间，此次修改不应变更start。
>
> 移除detail字段，替换为task/result两个字段，记录from字段来展示这个任务来自哪个角色。

当时采用共享 Index 评论区；后续调整为独立 Member Issue。

### 2. 收敛 Team Index 正文

> 移除掉正文的状态维护，在skill中也也除掉。

这里的“正文”指 Team Index；后续改为在成员自己的 Issue 正文维护状态。

### 3. 交叉写入与队列问题成为新需求

> 这里其实要讨论交叉写入的问题，即下一个面对的场景，通过issue yaml派发任务
>
> 我设想的是在对应的状态中留一个地方，由其他member发布简短request，member完成后补充完成记录，并同步当前状态。考虑到竞态和队列问题，最好的解决方法是每个member开一个issue。我们讨论有没有更简的方案

### 4. 确认每个成员一个 Issue 和 Request 最简字段

> 采用每个member一个issue，在初始化时应新建这个issue，body写入职责。并请求第一个初始任务。agent获得初始化提示词中包含这个issue链接。
>
> 我们还引用完整的刚刚的yaml评论字段，只是把from这里换成对应的issue comment连接楼层。发布任务请求就可以直接在对应member issue中回复即可。最简字段是from request两个字段，一个回复中可以包含多个任务请求，request可以是个列表

### 5. 状态写入正文，Result 作为劳动记录

> 成员status在issue body中，由成员自己维护。显然只有busy/idle两种状态，增加一个latestwork字段，指向result或者request，一句简短的描述。
>
> result评论需要task指向request回复，result执行结果（允许列表，有成果可以写链接，第一句必须是简短的自然语言描述），handoff指向下一步派发出的任务的链接（如果有，否则不写这个字段），start/end
>
> 一共五个字段。这个作为agent的“劳动”记录

### 6. 明确 Handoff 和 Lead 的职责

> handoff实际上是简短的描述+这个成员给另一个成员的下一任务的链接
>
> lead同时维护team index和自己的member page，仍有一些任务需要lead去做

### 7. 对本次 Skill 迭代和档案的要求

> 根据同仓库的skill写法和迭代演进规则，重新审查最终的skill文本

> 修复这些问题。
>
> 注意同时提取我们这次更新的讨论，将一些原则和决定写入reference，作为此次的更新依据，这也写在我们迭代式skill的内容中

> 这些依据大多是我们的讨论内容，并且尽可能保留我的原文。你无法验证它的“真实性”

## 方案取舍及其性质

以下记录当时考虑并取舍的方案：

- **共享 Index 正文维护所有成员状态**：需要跨成员编辑同一正文，状态更新责任难分配。
- **共享 Index 下每成员一个固定 YAML 评论**：改善了评论的编辑归属，但未来 Request 都进入同一评论区，需要按成员筛选。
- **每成员独立 Issue**：为成员提供固定的职责、状态及收件位置。其他成员追加 Request，接收成员编辑自己的正文并追加 Result。
- **每任务独立 Issue / 额外队列系统**：本轮未采用。现阶段选择 GitHub 原有 Issue 和评论能力，后续以实际积压、重试或并发问题再判断是否需要扩展。

## 可核对的 GitHub 操作记录

仓库记录保留了协议落地及交接结果：

- [Team Index #7](https://github.com/Ri0n72Y/agent-identity/issues/7)：成员目录。
- [Lead Member Issue #22](https://github.com/Ri0n72Y/agent-identity/issues/22) 与 [Skill Reviewer Member Issue #23](https://github.com/Ri0n72Y/agent-identity/issues/23)：成员正文、Request/Result 评论及状态更新。
- [Reviewer 完成记录](https://github.com/Ri0n72Y/agent-identity/issues/23#issuecomment-6721119750)、[向 Lead 派发的下一任务](https://github.com/Ri0n72Y/agent-identity/issues/22#issuecomment-6721117600)、[Lead 合并记录](https://github.com/Ri0n72Y/agent-identity/issues/22#issuecomment-6721154851)：一次跨角色交接的实际产物。
- [PR #21](https://github.com/Ri0n72Y/agent-identity/pull/21)：协议变更与当时的独立审查；[PR #24](https://github.com/Ri0n72Y/agent-identity/pull/24)：针对最终 Skill 文本的定点修订与本档案。

尚未开展并发正文编辑、中断恢复、积压队列及自动激活验证。

## 后续审查与迭代

PR #24 依据最终文本审查，修订了 Request/Result 的协议边界、待办识别、GitHub Issues 适用范围及 Next-hop 链接一致性；自审进一步明确 Lead 的初始 Member Issue 和中断后优先处理 `busy` 工作。以上属于后续审查与实施决定。

遵循 [skill-authoring](../../skill-authoring/SKILL.md)：运行规则保留在 `SKILL.md`，讨论与取舍留在本档案；新的实际执行结果可以推翻旧决定。
