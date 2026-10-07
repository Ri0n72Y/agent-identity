# 2. Background: Reading as a Process

> Draft status: first manuscript draft. Citations are currently kept in author-year form with a source list at the end; convert to the paper's final bibliography format later.

The central distinction in this paper is not between reading quickly and reading carefully in an everyday sense. It is between two information conditions. In one, an interpreter receives a completed text before forming its account of that text. In the other, the text becomes available over time, so that earlier interpretations must be formed without access to later evidence. We call the latter condition **slow reading** when incremental exposure is combined with persistent intermediate interpretations that can later be confirmed, revised, or abandoned.

This distinction draws on several literatures that are usually studied for different purposes. Psycholinguistics studies language comprehension as an online process; memory research studies how expectations and later evidence interact; literary theory has long described gaps, suspense, and retrospective reinterpretation; and recent LLM systems introduce intermediate reasoning, iterative refinement, long contexts, and persistent textual memory. These traditions do not share a theory of mind, nor do they provide interchangeable kinds of evidence. We therefore use them selectively. Human cognitive studies motivate variables worth isolating, literary theory describes phenomena that may otherwise be difficult to name, and LLM work establishes relevant engineering precedents. None of them, individually, establishes that language models read as humans do.

Readers interested primarily in the protocol and experiments may skip directly to Section 3.

## 2.1 Reading is ordinarily incremental

A completed text can be represented as a sequence \(T_{1:n}\). Many LLM evaluations effectively present that entire sequence before asking for an interpretation, summary, or answer. Human language comprehension is ordinarily constrained differently: later linguistic material is not available when earlier material is first processed.

A large psycholinguistic literature treats comprehension as incremental. Tanenhaus et al. (1995), using eye movements in situated spoken-language tasks, showed that listeners rapidly integrated linguistic input with the visual context as an utterance unfolded. Altmann and Kamide (1999) further showed anticipatory eye movements toward objects compatible with a verb before the post-verbal noun had been encountered, providing evidence that partial linguistic input can constrain expectations about upcoming material. These studies concern spoken sentence processing rather than extended literary reading, but they establish a basic point relevant here: comprehension can be updated before an utterance is complete, and information available at one moment can shape expectations about information not yet encountered.

Work on situation models extends the same general idea beyond local word recognition. Zwaan and Radvansky (1998) review evidence that comprehenders construct integrated representations of the situations described by language rather than retaining only a sequence of sentences. Such representations can track dimensions including time, space, causation, entities, and goals, and they are updated as discourse proceeds. The important implication for the present study is modest: a reading process can contain meaningful intermediate states.

This does not imply that an LLM implements human incremental processing, eye-movement control, or situation models. The empirical human literature instead motivates a separable experimental question. A system that receives \(T_{1:n}\) at once and a system that encounters \(T_1, T_2, \ldots, T_n\) under genuine future uncertainty are exposed to different information structures. Whether those different structures matter for LLM behavior is an empirical question rather than an assumption.

We can therefore distinguish two abstract forms:

\[
S = f(T_{1:n})
\]

and

\[
S_t = f(S_{t-1}, T_t).
\]

The second form contains a trajectory of provisional states. The first need not.

## 2.2 Gaps, ambiguity, and provisional interpretation

Incremental exposure has a consequence that is easy to remove accidentally in LLM experiments: there are moments at which the evidence is genuinely incomplete.

Literary theory has long treated such incompleteness as constitutive of reading rather than as a defect to be eliminated. Iser's account of aesthetic response describes reading as an interaction between text and reader in which textual indeterminacies or "blanks" invite the reader to form connections that later portions of the text may sustain or reorganize (Iser, 1978). This tradition is useful here mainly because it gives names to familiar phenomena: unresolved questions, provisional connections, suspense, and retrospective reinterpretation.

We do not treat reader-response theory as a mechanistic account of cognition. Its evidential status differs from controlled psycholinguistic work, and its stronger claims about the production of meaning need not be accepted for the present study. What matters is the narrower observation that a reader can temporarily occupy a state in which several interpretations remain possible because later evidence does not yet exist for that reader.

A prompt cannot make full-text access identical to the absence of future text. If a model already has access to the complete text, an instruction such as "analyze each paragraph as if you were reading it for the first time" asks the model to simulate ignorance while the disambiguating material remains available in its context. The model may produce a plausible reconstruction of an earlier uncertainty, but the information condition is different. This distinction motivates our separation of **simulated slow reading** from **true slow reading**.

## 2.3 Prediction makes later evidence relational

One reason future visibility may matter is that an expectation formed before new evidence arrives changes the role of that evidence.

Altmann and Kamide's (1999) findings are one example of predictive processing during language comprehension: partial input can constrain what is expected next. More broadly, research on prediction error and memory updating distinguishes an event that merely adds information from an event that violates an existing expectation. Recent reviews continue to treat the discrepancy between expected and observed outcomes as an important signal in memory updating, while emphasizing that the consequences of prediction error depend on factors such as magnitude, context, and uncertainty (e.g., Groves et al., 2025).

For the present work, no biological mechanism needs to be transferred to language models. The useful distinction is informational:

\[
\text{new evidence}
\neq
\text{new evidence relative to a prior commitment}.
\]

Suppose two systems eventually observe the same sentence \(E\). One receives \(E\) together with all earlier material. The other first commits to a provisional interpretation \(B_t\), optionally makes a prediction \(P_t\), and only then receives \(E\). In the second case, the experiment can observe whether \(E\) confirms, weakens, or contradicts a state that existed before \(E\) was available.

This is why prediction is included in our reading trace but is not mandatory after every segment. Forced prediction would manufacture commitments even when a text does not support them. When a meaningful expectation arises naturally, however, recording it makes subsequent revision measurable rather than retrospective.

## 2.4 Misinterpretation is part of the process, not necessarily a failure of the experiment

A protocol that forces early interpretation may create errors. That possibility is not a nuisance to be designed away; it is one of the reasons the comparison is informative.

The Good-Enough approach to language comprehension argues that human syntactic and semantic representations are not always maximally complete or accurate, but may be sufficient for the current task (Ferreira & Patson, 2007). The broader lesson relevant here is that provisional understanding can be incomplete, heuristic, or resistant to revision.

This literature should not be used to romanticize error. An incorrect interpretation is useful to our study only because its temporal position can be observed: it existed before some later evidence, and the system either revised it or failed to do so. Slow reading may therefore have opposite effects. It could support explicit revision by making contradictions visible, or it could amplify anchoring by committing the model too early.

Both outcomes are theoretically relevant. A study that defines success only as higher final accuracy would miss much of the phenomenon. We therefore separate **outcome measures**, such as final comprehension or recall, from **process measures**, such as hypothesis formation, prediction calibration, revision, unresolved tension, anchoring, and recovery after contradiction.

Crucially, the paper does not assume that a richer trajectory is a better trajectory. More intermediate states can simply mean more opportunities to be wrong.

## 2.5 Preserving revision as observable history

Once a provisional interpretation has been formed, later text can change how earlier material is understood. The experimental question is therefore not only what the model believes at the end of a document, but whether an earlier committed interpretation can still be distinguished from its later revision.

Conway and Pleydell-Pearce's Self-Memory System is useful here in a limited way. It treats autobiographical remembering as reconstructive rather than as a direct readout of a fixed record (Conway & Pleydell-Pearce, 2000). We do not transfer that model of human autobiographical memory to LLMs. Instead, it motivates a methodological distinction between past evidence and present reconstruction.

An engineered system can preserve both. Our protocol therefore stores the source segment, the interpretation committed before later text was visible, and any subsequent revision as separate records. Later states may judge earlier states as wrong or incomplete, but they do not rewrite them.

\[
\text{earlier commitment}
\xrightarrow{\text{new evidence}}
\text{later revision}
\]

The transition is observable because the earlier commitment was recorded under a known information condition. This is sufficient for the present study; we do not need to assume that coherent retrospective narratives are necessary for understanding, identity, or cognition. The purpose of the trace is auditability, not psychological realism.

## 2.6 What current LLM systems reproduce—and what they do not

Several strands of LLM research reproduce parts of the process described above, but they manipulate different variables. Together they motivate controls for long-context access, segmentation, intermediate reasoning, and persistent textual state.

### Whole and long-context reading

The most direct way to process a document with an LLM is to place as much of the document as possible into the context window and request an answer, summary, or interpretation. Larger context windows make more information available, but information availability should not be confused with uniform information use. Liu et al. (2024) show in multi-document question answering and key-value retrieval that performance can depend strongly on where relevant information occurs in a long context, with degradation when relevant evidence appears in the middle.

This result does not establish that incremental reading is better, nor does it test temporal interpretation. It establishes a narrower point: the ability to supply a completed long document does not imply that the model uses every part of that document equivalently. Long-context research therefore concerns access and utilization, while our question concerns the timing of access.

### Chunking and retrieval

Document-processing pipelines often divide long texts into smaller units before retrieval, summarization, or analysis. Operationally, this can resemble incremental reading, but segmentation alone does not create a history of provisional interpretation. If each chunk is processed without preserving what the model previously believed, the model is receiving less text at once without necessarily accumulating an interpretive trajectory.

For this reason, **Chunked Reading** is an explicit baseline. Its clean comparison with True Slow Reading asks whether persistent intermediate interpretation contributes anything beyond future-blind segmented exposure itself.

### Chain-of-thought and iterative refinement

Chain-of-thought prompting demonstrates that generating intermediate reasoning steps can improve performance on multiple reasoning tasks (Wei et al., 2022). Self-Refine similarly shows that a model can generate an initial output, critique it, and iteratively produce a better output without additional training (Madaan et al., 2023). These methods establish that multiple intermediate textual states can matter at inference time.

Slow reading manipulates a different variable. In standard chain-of-thought or refinement settings, the relevant task input is typically already available when the reasoning sequence begins. The model may move through multiple states, but those states are computed under broadly the same evidence set. In true slow reading, the evidence set itself changes:

\[
\mathcal{E}_1
\subset
\mathcal{E}_2
\subset
\cdots
\subset
\mathcal{E}_n.
\]

This is also why we do not treat a generated reading trace as hidden cognition made visible. Turpin et al. (2023) show that chain-of-thought explanations can omit or misrepresent factors that influenced an answer, including experimentally introduced biases. Intermediate text can be behaviorally useful without being a faithful transcript of an internal computation. Our protocol therefore treats interpretations, predictions, and revisions as **observable commitments produced under controlled information conditions**, not as direct measurements of a model's private reasoning process.

### Reflection and persistent textual states

Agent systems provide another relevant precedent: intermediate text can persist across otherwise separate inference steps. Generative Agents store natural-language experience records, synthesize higher-level reflections, and retrieve them to influence later planning (Park et al., 2023). Reflexion stores verbal reflections on task feedback in episodic memory and reuses them in later trials without updating model weights (Shinn et al., 2023). Think-in-Memory explicitly stores evolving "thoughts" and combines recalled historical thoughts with new post-thinking updates (Liu et al., 2023).

These systems show that earlier model outputs can be externalized and reintroduced later as durable state. Their primary questions concern agent behavior, learning from trial-and-error, or long-term memory rather than the information condition under which a document is first interpreted. They therefore provide an engineering precedent for persistent state, not an answer to the slow-reading question.

## 2.7 The missing comparison: actual future visibility

Across these literatures, many components of slow reading already exist separately. Human comprehension research provides strong evidence that language processing is incremental and can be predictive. Good-Enough Processing motivates treating incomplete or incorrect intermediate interpretations as measurable states rather than automatically discarding them. Prediction-error research motivates distinguishing new evidence from evidence that arrives after an expectation has been formed. Reconstructive-memory work motivates preserving earlier commitments separately from later reinterpretations. LLM research provides long-context access, segmentation, intermediate reasoning, iterative refinement, and persistent textual state.

The unresolved comparison is simpler than any one of these theories:

> When the model and document are held fixed, what changes if future text is genuinely unavailable while an intermediate interpretation is formed?

We evaluate four conditions:

- **Whole Reading**: the complete text is available before interpretation;
- **Chunked Reading**: text is revealed incrementally without a persistent intermediate interpretation;
- **Simulated Slow Reading**: the complete text remains available while the model performs the same segment-by-segment interpretive protocol used in slow reading;
- **True Slow Reading**: the same protocol is used, but unrevealed text is technically unavailable.

These conditions are not treated as a fully crossed factorial design. Instead, the analysis relies on pre-specified contrasts with clear roles.

**True Slow vs. Simulated Slow** isolates the effect of actual future visibility while holding the segment schedule and persistent interpretive protocol as similar as possible.

**True Slow vs. Chunked** isolates the contribution of persistent intermediate interpretation under future-blind segmented exposure.

**True Slow vs. Whole** is the main practical comparison against the conventional completed-text baseline, but it is not interpreted as isolating a single causal factor because segmentation and intermediate-state persistence also differ.

This structure is intentionally modest. It does not assume that slow reading is more accurate, more natural, or more human. It asks whether interpreting a completed text is behaviorally equivalent to interpreting that same text before its future is known.

---

## Sources used in this draft

These are working references for the manuscript draft, not yet the final bibliography.

- Altmann, G. T. M., & Kamide, Y. (1999). *Incremental interpretation at verbs: restricting the domain of subsequent reference*. Cognition, 73(3), 247–264. DOI: 10.1016/S0010-0277(99)00059-1.
- Conway, M. A., & Pleydell-Pearce, C. W. (2000). *The construction of autobiographical memories in the self-memory system*. Psychological Review, 107(2), 261–288. DOI: 10.1037/0033-295X.107.2.261.
- Ferreira, F., & Patson, N. D. (2007). *The "Good Enough" approach to language comprehension*. Language and Linguistics Compass, 1, 71–83. DOI: 10.1111/j.1749-818X.2007.00007.x.
- Groves, I., et al. (2025). *How prediction error drives memory updating: role of locus coeruleus*. Trends in Neurosciences. PubMed PMID: 41047330. Bibliographic details to verify before final bibliography.
- Iser, W. (1978). *The Act of Reading: A Theory of Aesthetic Response*. Johns Hopkins University Press.
- Liu, L., Yang, X., Shen, Y., Hu, B., Zhang, Z., Gu, J., & Zhang, G. (2023). *Think-in-Memory: Recalling and Post-thinking Enable LLMs with Long-Term Memory*. arXiv:2311.08719.
- Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., & Liang, P. (2024). *Lost in the Middle: How Language Models Use Long Contexts*. Transactions of the Association for Computational Linguistics, 12, 157–173. DOI: 10.1162/tacl_a_00638.
- Madaan, A., et al. (2023). *Self-Refine: Iterative Refinement with Self-Feedback*. NeurIPS 2023. DOI: 10.52202/075280-2019.
- Park, J. S., O'Brien, J. C., Cai, C. J., Morris, M. R., Liang, P., & Bernstein, M. S. (2023). *Generative Agents: Interactive Simulacra of Human Behavior*. UIST 2023. DOI: 10.1145/3586183.3606763.
- Shinn, N., Cassano, F., Gopinath, A., Narasimhan, K., & Yao, S. (2023). *Reflexion: Language Agents with Verbal Reinforcement Learning*. NeurIPS 2023. DOI: 10.52202/075280-0377.
- Tanenhaus, M. K., Spivey-Knowlton, M. J., Eberhard, K. M., & Sedivy, J. C. (1995). *Integration of visual and linguistic information in spoken language comprehension*. Science, 268(5217), 1632–1634. DOI: 10.1126/science.7777863.
- Turpin, M., Michael, J., Perez, E., & Bowman, S. R. (2023). *Language Models Don't Always Say What They Think: Unfaithful Explanations in Chain-of-Thought Prompting*. arXiv:2305.04388.
- Wei, J., et al. (2022). *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models*. NeurIPS 2022. DOI: 10.52202/068431-1800.
- Zwaan, R. A., & Radvansky, G. A. (1998). *Situation models in language comprehension and memory*. Psychological Bulletin, 123(2), 162–185. DOI: 10.1037/0033-2909.123.2.162.
