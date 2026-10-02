# The Effect: The Case of the Tutoring Program
### Storyboard for an animated explainer of *The Effect: An Introduction to Research Design and Causality* by Nick Huntington-Klein

**Format:** auto-play animated film in one self-contained web page (SVG + JavaScript + Web Audio), about **11 min 30 s**
**Audience:** viewers with some stats background (knows what a mean, a regression line, and a correlation are)
**Coverage:** every numbered chapter (1–23), one scene each, plus a cold open, two part cards, and a finale
**Credits:** based on *The Effect* by Nick Huntington-Klein (free at theeffectbook.net) · explainer by Brijesh Shetty, github.com/brijs

---

## 1. The big idea

The whole film is one detective case. A fictional newspaper in the town of Riverbend reports that *tutored students score 15 points higher in math*. Our detective, **Arrow**, spends the film working out how much of that gap is really caused by tutoring. Every chapter becomes one step in the investigation, and every method in Part 2 is tried on the same case, so the viewer sees the same question answered in different ways.

The setting is a **detective's case board**: pins are variables, red string is causal arrows, index cards are assumptions. A causal diagram literally *is* the evidence board, which keeps the visual language tied to the book's core tool.

All numbers in the case are illustrative, and the film says so in the finale.

## 2. Character bible: Arrow

| Trait | Detail |
|---|---|
| Look | Small round ink-blue figure, cream-white eyes, tiny fedora, oversized magnifying glass. Instead of a tail, a length of red string ending in an arrowhead. |
| Signature move | Pulls string from the tail and pins it between two variables to draw a causal arrow. |
| Personality | Curious, skeptical of easy answers, delighted by a clean design. |
| Expressions | **Curious** (head tilt) · **Suspicious** (squint, one eyebrow up) · **Eureka** (eyes wide, glass raised) · **Worried** (sweat drop) · **Proud** (tips hat) |
| Voice | Short handwritten speech bubbles. Max 2 lines per bubble, about 12 words per line. |
| Walk | Bouncy 4-frame hop, synced to footstep sounds on the music's beat. |

### Supporting cast (pins on the board)
| Pin | Variable | Notes |
|---|---|---|
| **T** | Tutoring (hours per week) | Treatment, teal pin |
| **Y** | Math score | Outcome, red pin |
| **I** | Family income | Observed confounder |
| **M** | Motivation | Unobserved confounder, dashed outline |
| **H** | Homework time | Mediator on the front-door path |
| **Z** | Tutoring lottery | Instrument |
| **C** | "Featured in the newspaper" | Collider (T → C ← Y) |
| **E** | Entrance test score | Running variable, cutoff 60 |

## 3. Visual direction

| Token | Hex | Use |
|---|---|---|
| Night desk | `#1A2238` | Space around the board, part cards |
| Cork | `#B48A57` | Board surface |
| Index card | `#F4F6F9` | Cards, chart panels |
| Red string | `#C62B36` | Causal arrows, outcome |
| Highlighter | `#F4D03F` | "The variation we keep" |
| Treated teal | `#2A8C82` | Treated group |
| Control slate | `#6B7A90` | Untreated group, ghost/counterfactual lines |

**Type:** *Fraunces* for chapter titles and on-card headings; *Kalam* (handwriting) for Arrow's bubbles and pinned notes. Fallbacks: Georgia, serif / "Comic Neue", cursive.

**Principles**
- One memorable thing: **the red string**. It is always the causal arrow, and it is the only saturated red on screen apart from the outcome pin.
- Highlighter yellow always means "the variation we're using". Viewers learn the color code by chapter 5 and it pays off in every Part 2 method.
- Charts are drawn on index cards pinned to the board, so plots and diagrams live in the same world.
- Stage is 16:9, letterboxed on phones; captions sit inside the stage, never over key visuals.

## 4. Sound design

All sounds are synthesized in the browser with Web Audio (no audio files), and every cue is scheduled on the **same master clock as the animation**, so a pin lands on the exact frame its click plays. Music runs at **92 BPM** in Part 1 (one beat = 0.652 s); key visual hits are snapped to beats.

| Cue | Sound | Used when |
|---|---|---|
| `pin` | Short click plus a tiny noise burst | A variable is pinned |
| `string` | Rising plucked glissando | A causal arrow is drawn |
| `snip` | Two quick metallic clicks | An arrow is cut |
| `door-shut` | Low thud with a short creak | A back door is closed |
| `door-creak` | Slow rising creak | A path is opened (collider) |
| `ding` | Bright bell | Key takeaway lands |
| `buzz` | Low square-wave buzz | Wrong answer, bias revealed |
| `type` | Typewriter ticks | Title cards type on |
| `stamp` | Rubber-stamp thump | Case-note stamp |
| `whoosh` | Filtered noise sweep | Scene transitions |
| `paper` | Rustle | Cards shuffle, crumple |
| `drop` | Plop, pitch mapped to the value | Data points fall onto a chart |
| `step` | Soft footstep | Arrow walks (on the beat) |
| `dice` | Rattle | Randomization, lottery, simulation |
| `tick` | Clock tick | Time-based methods (Ch 16–18) |
| `magnet` | Hum then click | Matching pairs snap together |
| `motif` | 4-note "Arrow theme" on vibraphone | Every chapter title |

**Music beds**
- **Part 1, "Investigation":** walking upright-bass line, brushed hi-hat, soft minor-key piano chords, 92 BPM.
- **Part 2, "Toolbox":** same bass motif, brighter, 100 BPM, adds vibraphone.
- **Finale:** the motif resolves to a major chord.
- Music ducks by about 6 dB under every SFX cue and under each `ding`.

## 5. Master timeline

| # | Time | Length | Scene |
|---|---|---|---|
| 0 | 00:00–00:30 | 30 s | Cold open: the headline |
| — | 00:30–00:38 | 8 s | Part 1 card: The Design of Research |
| 1 | 00:38–01:02 | 24 s | Ch 1 Designing Research |
| 2 | 01:02–01:26 | 24 s | Ch 2 Research Questions |
| 3 | 01:26–01:50 | 24 s | Ch 3 Describing Variables |
| 4 | 01:50–02:16 | 26 s | Ch 4 Describing Relationships |
| 5 | 02:16–02:44 | 28 s | Ch 5 Identification |
| 6 | 02:44–03:12 | 28 s | Ch 6 Causal Diagrams |
| 7 | 03:12–03:38 | 26 s | Ch 7 Drawing Causal Diagrams |
| 8 | 03:38–04:14 | 36 s | Ch 8 Causal Paths and Closing Back Doors |
| 9 | 04:14–04:44 | 30 s | Ch 9 Finding Front Doors |
| 10 | 04:44–05:12 | 28 s | Ch 10 Treatment Effects |
| 11 | 05:12–05:36 | 24 s | Ch 11 Causality with Less Modeling |
| — | 05:36–05:44 | 8 s | Part 2 card: The Toolbox |
| 12 | 05:44–06:04 | 20 s | Ch 12 Opening the Toolbox |
| 13 | 06:04–06:32 | 28 s | Ch 13 Regression |
| 14 | 06:32–07:00 | 28 s | Ch 14 Matching |
| 15 | 07:00–07:24 | 24 s | Ch 15 Simulation |
| 16 | 07:24–07:52 | 28 s | Ch 16 Fixed Effects |
| 17 | 07:52–08:18 | 26 s | Ch 17 Event Studies |
| 18 | 08:18–08:48 | 30 s | Ch 18 Difference-in-Differences |
| 19 | 08:48–09:18 | 30 s | Ch 19 Instrumental Variables |
| 20 | 09:18–09:48 | 30 s | Ch 20 Regression Discontinuity |
| 21 | 09:48–10:12 | 24 s | Ch 21 Partial Identification |
| 22 | 10:12–10:38 | 26 s | Ch 22 A Gallery of Rogues |
| 23 | 10:38–11:02 | 24 s | Ch 23 Under the Rug |
| 24 | 11:02–11:30 | 28 s | Finale: case board and credits |

Every chapter scene follows the same rhythm: **title (0–2 s, `type` + `motif`) → setup → the key move → takeaway (`ding`) → transition (`whoosh`)**.

---

## 6. Scene by scene

Times inside each scene are offsets from the scene start.

### Scene 0 · Cold open · 00:00–00:30
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0.0 | Black. A desk lamp clicks on, revealing the cork board. | — | — | lamp click |
| 1.5 | Newspaper clipping pinned: *Riverbend Gazette: "Tutored students score 15 points higher!"* | — | — | `pin`, `paper` |
| 6.0 | Arrow pops up from behind the board, magnifying glass on the "15". | Suspicious | "Fifteen points. But did tutoring *cause* that?" | pop, `motif` |
| 12.0 | Pins T and Y appear; Arrow draws red string T → Y. | Curious | — | `pin` ×2, `string` |
| 16.0 | A shadowy third pin with "?" fades in behind them. | Worried | "Or is something else pulling the strings?" | low cello note |
| 20.0 | Title types on: **The Effect**, then "a case file in 23 chapters", then "after the book by Nick Huntington-Klein". | Tips hat | — | `type` |
| 28.0 | Board slides away. | — | — | `whoosh` |

### Part 1 card · 00:30–00:38
Night-desk background, a manila folder stamped **Part 1: The Design of Research**. The Investigation music bed starts on the stamp. Sound: `stamp`, music in.

### Scene 1 · Ch 1 Designing Research · 00:38–01:02
**Key idea:** data can't answer a question by itself; a research design decides *what* you need to learn from the data before you touch it.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | A spreadsheet card is pinned; Arrow stares at it, nothing happens. | Curious | "Staring at data doesn't answer anything." | `pin` |
| 8 | A blueprint unrolls over the board. Four cards pin on beats: **Question → Theory → Design → Data**. | Hops along each card | — | `paper`, `pin` ×4 on beats |
| 16 | The four cards link with string; the spreadsheet slides to the end of the chain. | Eureka | "Plan what you need to learn. *Then* open the data." | `string`, `ding` |
| 22 | Transition. | — | — | `whoosh` |

### Scene 2 · Ch 2 Research Questions · 01:02–01:26
**Key idea:** a good research question is specific, answerable with data, and grounded in a theory of why things happen; know whether you're asking a descriptive or a causal question.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Card: "Is tutoring good?" | Suspicious | "Good for what? For whom? Compared to what?" | `pin`, `buzz` |
| 8 | Arrow crumples it and lobs it into a bin. | — | — | `paper`, bin thunk |
| 11 | New card writes itself: "Does one hour a week of tutoring *raise* a student's math score?" A tag flips from *descriptive* to **causal**. | Proud | "Specific. Answerable. And it's causal." | handwriting scratch, `stamp` |
| 20 | Takeaway. | — | "A sharp question tells you what data you need." | `ding`, `whoosh` |

### Scene 3 · Ch 3 Describing Variables · 01:26–01:50
**Key idea:** every variable has a distribution, with a shape, a center (mean, median) and a spread (variance, SD); skewed variables like income have long tails, and a log can tame them.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Score dots rain onto a card and stack into a histogram. | Watches, head bobbing | "A variable isn't one number. It's a whole shape." | `drop` ×many, pitch by value |
| 9 | A mean line slides in; spread brackets stretch to ±1 SD. | Points with glass | "Center… and spread." | `pin`, `string` |
| 14 | Second card: income histogram with a long right tail; Arrow squashes it with a log, and it becomes bell-like. | Proud | "Long tails? Try the log." | squash *boing* |
| 22 | Takeaway. | — | — | `ding`, `whoosh` |

### Scene 4 · Ch 4 Describing Relationships · 01:50–02:16
**Key idea:** relationships are about conditional distributions: how Y's mean changes with X. A fitted line summarizes it; "controlling for" a variable means removing the part of each variable it explains and looking at what's left.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Scatter: tutoring hours vs score. | Curious | — | `drop` ×many |
| 6 | Data sliced into bins; a yellow diamond marks each bin's mean. | — | "What's the average score *given* each level of tutoring?" | `pin` per diamond on beats |
| 12 | A line fits through the diamonds. | Eureka | — | `string` |
| 16 | Arrow squeegees away the part of score explained by income; points settle into residuals around zero. | Wipes | "Controlling for income: keep only what income *can't* explain." | squeegee swipe |
| 24 | Takeaway. | — | — | `ding`, `whoosh` |

### Scene 5 · Ch 5 Identification · 02:16–02:44
**Key idea:** the data are produced by a data-generating process that mixes many reasons together. Identification means isolating the specific variation that answers your question and ruling out the other explanations.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | The 15-point gap appears as a tangled ball of yarn: red (tutoring effect), purple (motivation), green (income). | Worried | "That 15-point gap is a tangle of reasons." | low rumble |
| 9 | Arrow pulls the purple thread out, then the green. | Tugging | — | `string` descending ×2 |
| 16 | Only the red thread remains, glowing with highlighter yellow. | Eureka | "Identification: find the variation where *only* your answer is left." | `ding` |
| 24 | Small note pins: "Know the process that made your data." | — | — | `pin`, `whoosh` |

### Scene 6 · Ch 6 Causal Diagrams · 02:44–03:12
**Key idea:** a causal diagram draws the data-generating process. Nodes are variables, arrows mean "causes", there are no loops, and unobserved variables still belong on the diagram.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Pins T, Y, I, M land on the board on beats; M has a dashed outline. | Pins them | "Variables become pins." | `pin` ×4 |
| 8 | Arrow draws T → Y, I → T, I → Y, M → T, M → Y. | Pulling string | "Every arrow says: this causes that." | `string` ×5 |
| 18 | M pulses: "unobserved". | Suspicious | "We can't measure motivation. It still goes on the board." | soft pulse |
| 24 | Takeaway. | Proud | "Each arrow is an assumption you have to defend." | `ding`, `whoosh` |

### Scene 7 · Ch 7 Drawing Causal Diagrams · 03:12–03:38
**Key idea:** start by listing everything relevant, then simplify: drop variables that don't matter, merge ones that act alike, and break feedback loops by adding time.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | The board floods with about 15 pins and a mess of string. | Overwhelmed, spinning | "Everything affects everything…" | `pin` flurry, `paper` |
| 8 | Arrow unpins irrelevant ones (shoe size, weather); they flutter off. | Plucking | "Drop what doesn't matter." | pop ×3 |
| 13 | "Parent education" and "Income" merge into one **Background** pin. | — | "Merge what acts alike." | merge *whoomp* |
| 18 | A loop T ⇄ Y splits into T(year 1) → Y(year 1) → T(year 2). | Eureka | "Break loops with time." | `snip`, `string` |
| 23 | Takeaway. | — | — | `ding`, `whoosh` |

### Scene 8 · Ch 8 Causal Paths and Closing Back Doors · 03:38–04:14 (centerpiece)
**Key idea:** front-door paths start with an arrow *out of* the treatment and carry the effect; back-door paths start with an arrow *into* the treatment and create bias. Controlling for a variable on a back door closes it, but a path through a **collider** is already closed, and controlling for the collider opens it.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Diagram redrawn as a house: T and Y are rooms; paths are corridors with doors. Front door T → H → Y glows yellow. | Walks the corridor | "Front doors carry the effect." | `step` on beats, `string` |
| 9 | Back door T ← I → Y swings open; wind blows papers through. | Worried | "Back doors carry bias." | wind, `door-creak` |
| 14 | Arrow puts a padlock labeled "control for income" on I; the door slams. | Proud | "Control for income: door closed." | `door-shut` |
| 19 | Back door through M rattles; Arrow tries the padlock, but M is unobserved and the lock won't fit. | Worried, sweat drop | "Can't control what we can't measure." | rattle, `buzz` |
| 25 | Collider: T → C ← Y (*featured in the newspaper*). The path is closed. Arrow reaches to control C, and the door creaks *open*. | Shocked | "Never control for a collider. It opens the path." | `door-creak`, `buzz` |
| 32 | Takeaway. | — | "Close every back door. Leave colliders alone." | `ding`, `whoosh` |

### Scene 9 · Ch 9 Finding Front Doors · 04:14–04:44
**Key idea:** when some back doors can't be closed, find variation in treatment that has *no* back doors: a randomized experiment, or a natural experiment that randomizes for you. A third route, the front-door method, uses a mediator.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Recap: the M back door still open. | Worried | "Motivation's door won't lock." | rattle |
| 6 | A lottery drum spins and assigns tutoring slots. | Cranking | "So let chance decide who gets tutoring." | `dice` |
| 12 | Every string into T gets snipped; only Lottery → T remains. | Eureka | "Nothing else points into treatment now." | `snip` ×3, `ding` |
| 19 | Card: "Natural experiment: a rule or accident that did the randomizing." | Points | — | `pin` |
| 24 | Small aside: T → H → Y highlighted. "The front-door method: trace the effect through a mediator." | — | — | `string`, `whoosh` |

### Scene 10 · Ch 10 Treatment Effects · 04:44–05:12
**Key idea:** effects differ across people. ATE averages over everyone, ATT over the treated, ATUT over the untreated, and designs often give a weighted average of specific people's effects (like LATE for compliers). Know which one your design delivers.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | A row of eight student figures, each with its own effect bar (+20, +3, 0, +12, …). | Curious | "Tutoring doesn't help everyone equally." | `drop` per bar |
| 9 | All bars slide together into one average: **ATE**. | — | "Average over everyone: ATE." | `pin` |
| 14 | Only tutored students light up teal: **ATT**. | — | "Over the treated: ATT." | `pin` |
| 19 | Spotlight shifts to students whose tutoring depended on the lottery: **LATE**. | Raises glass | "Over those your design moved: LATE." | spotlight hum |
| 24 | Takeaway. | Proud | "Ask: *whose* effect am I estimating?" | `ding`, `whoosh` |

### Scene 11 · Ch 11 Causality with Less Modeling · 05:12–05:36
**Key idea:** you rarely know the full diagram. Focus on the parts that matter for your treatment, and test predictions your assumptions imply, such as placebo effects that should be zero.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Fog rolls over most of the board. | Worried | "We'll never see the whole map." | low wind |
| 7 | Arrow's flashlight lights only the arrows into T. | Searching | "You only need the roads into treatment." | flashlight click |
| 13 | Placebo test card: "Tutoring's effect on height." A gauge needle settles at 0; green check. | Eureka | "Test what *should* come out zero." | gauge tick, `ding` |
| 22 | Transition. | — | — | `whoosh` |

### Part 2 card · 05:36–05:44
A heavy toolbox lands on the desk; folder stamped **Part 2: The Toolbox**. Music switches to the brighter Toolbox bed on the clank. Sound: clank, `stamp`.

### Scene 12 · Ch 12 Opening the Toolbox · 05:44–06:04
**Key idea:** Part 2's methods are templates: designs that have worked before, each with the assumptions it needs to identify an effect.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | The lid opens; tools rise one by one with tags: wrench (Regression), magnet (Matching), dice (Simulation), mirror (Fixed Effects), clock (Event Study), split clock (DiD), lever (IV), ruler (RD), net (Bounds). | Wide-eyed | — | metallic clink per tool on beats |
| 12 | Each tool's tag flips to show "needs: …" assumptions. | Proud | "Every tool is a template plus its assumptions." | `paper`, `ding` |
| 18 | Transition. | — | — | `whoosh` |

### Scene 13 · Ch 13 Regression · 06:04–06:32
**Key idea:** regression fits a line; adding controls closes back doors by comparing people with the same values of those controls. The coefficient is the effect *under those assumptions*, and the standard error measures how uncertain it is.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Scatter T vs Y; a line drops in. Badge: **slope +15**. | Suspicious | "Raw slope: 15. Our old headline." | `drop`, `string` |
| 9 | Arrow tightens the wrench on "+ income". The line flattens; badge rolls to **+6**. | Wrenching | "Add a control. That back door closes." | ratchet clicks, `door-shut` |
| 17 | A shaded band shimmers around the line. | Points | "The band is our uncertainty." | soft shimmer |
| 22 | Small note: "Still open: motivation." | Worried | — | `pin`, `buzz` (soft) |
| 26 | Transition. | — | — | `ding`, `whoosh` |

### Scene 14 · Ch 14 Matching · 06:32–07:00
**Key idea:** pair each treated person with untreated people who look alike on the back-door variables (by distance or propensity score), weight them, check balance, and drop those with no comparable match (common support).
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Tutored students (teal) on the left, untutored (slate) on the right, each with an income tag. | Curious | "Compare like with like." | `pin` cascade |
| 8 | A magnet pulls look-alike pairs together. | Holding magnet | — | `magnet` ×4 |
| 15 | Students with no look-alike fade out. | — | "No match? No comparison." | soft fade tone |
| 20 | A balance scale levels out between the groups. | Proud | "Balanced groups, fair comparison." | scale creak, `ding` |
| 26 | Transition. | — | — | `whoosh` |

### Scene 15 · Ch 15 Simulation · 07:00–07:24
**Key idea:** create fake data where you set the true effect, run your method many times, and see whether it recovers the truth. (Bootstrapping is the same spirit, resampling your real data.)
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Arrow sets a dial: **true effect = 10**. | Turning dial | "Build a world where you know the answer." | dial clicks |
| 7 | Dice cascade; a histogram of 1,000 estimates builds. Method A centers on 10. | Watching | — | `dice`, `drop` stream |
| 14 | Method B's histogram centers on 16. | Suspicious | "This one's biased." | `buzz` |
| 19 | Takeaway. | Proud | "Test your method before trusting it." | `ding`, `whoosh` |

### Scene 16 · Ch 16 Fixed Effects · 07:24–07:52
**Key idea:** compare each individual to themselves over time. Removing each person's average wipes out every fixed difference between people (observed or not), keeping only within-person variation.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Three students' yearly points as clusters at very different heights. Across clusters, the trend is misleading. | Suspicious | "Different students, different baselines." | `tick` ×3 |
| 10 | Arrow holds up a mirror to each cluster; each slides down to center on its own mean. | Eureka | — | slide *swoosh* ×3 |
| 16 | Stacked clusters reveal a clear within-student slope. | Points | "Compare each student to *themselves*." | `string` |
| 22 | The M pin's dashed outline cracks. | Proud | "Anything fixed about them, even motivation, drops out." | crack, `ding` |
| 27 | Transition. | — | — | `whoosh` |

### Scene 17 · Ch 17 Event Studies · 07:52–08:18
**Key idea:** with one treated group, use the trend before treatment to predict what would have happened after; the gap between prediction and reality is the effect. Pre-treatment "effects" should be near zero.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Riverbend School's average score plotted over time. | Curious | — | `tick` per point |
| 8 | Tutoring launches; a vertical line drops. | — | — | gong |
| 11 | A dashed slate line extends the pre-trend forward. | Drawing | "Where would scores have gone anyway?" | `string` |
| 16 | The gap between the actual and dashed lines shades yellow. | Eureka | "That gap is the effect." | `ding` |
| 21 | Pre-period points sit flat at zero; check mark. | Proud | "Before treatment, no 'effect'. Good sign." | `pin`, `whoosh` |

### Scene 18 · Ch 18 Difference-in-Differences · 08:18–08:48
**Key idea:** take the before-after change for the treated group and subtract the before-after change for an untreated group. Works if both would have moved in parallel without treatment (parallel trends).
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Two lines: Riverbend (teal) and Hillside (slate), rising in parallel. | Curious | "Two schools, moving together." | `tick` ×6 |
| 9 | Riverbend adopts tutoring; its line jumps. | — | — | gong |
| 12 | A ghost teal line continues parallel to Hillside. | Drawing | "Hillside shows us Riverbend's 'anyway'." | `string` |
| 18 | Chalk: (after − before)ₜᵣₑₐₜₑ𝒹 − (after − before)ᶜᵒⁿᵗʳᵒˡ; the gap is highlighted. | Writing | "Difference… in differences." | chalk scratch ×2, `ding` |
| 25 | The ghost line wobbles. | Worried | "Only works if they'd have stayed parallel." | wobble, `whoosh` |

### Scene 19 · Ch 19 Instrumental Variables · 08:48–09:18
**Key idea:** an instrument shifts treatment, and affects the outcome *only* through treatment. Using only the part of treatment driven by the instrument isolates a front door; the result is a local effect for those the instrument moved. Weak instruments make this fragile.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | The lottery returns: Z → T → Y. M still lurks behind T. | Curious | — | `pin`, `string` |
| 8 | T's variation pours into a funnel; only the yellow, lottery-driven slice passes through. | Pouring | "Keep only the tutoring the lottery caused." | pour, `ding` |
| 16 | A sneaky string tries to run Z → Y directly; Arrow stamps a big X on it. | Stern | "The instrument can't touch scores on its own." | `stamp`, `snip` |
| 22 | The trickle thins to a drip: "weak instrument". | Worried | "Too little push, and the estimate wobbles." | drip, `whoosh` |

### Scene 20 · Ch 20 Regression Discontinuity · 09:18–09:48
**Key idea:** when treatment is assigned by a cutoff on a running variable, people just above and just below are nearly identical, so the jump at the cutoff is the effect there. Watch for people manipulating which side they land on.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | X-axis: entrance test score. A ruler drops a line at **60**: below gets tutoring. | Measuring | "Score under 60? You get tutoring." | ruler *thwack* |
| 8 | Scatter of later math scores; fitted lines on each side, with a jump at 60. | — | — | `drop` stream, `string` ×2 |
| 15 | Arrow's magnifying glass zooms into a narrow band around 60. | Eureka | "59 and 61 are basically the same student." | zoom whoosh, `ding` |
| 22 | A pile-up of students just under 60 flashes red. | Suspicious | "Unless people are gaming the cutoff." | alarm *bleep* |
| 28 | Transition. | — | — | `whoosh` |

### Scene 21 · Ch 21 Partial Identification · 09:48–10:12
**Key idea:** if your assumptions can't pin down a single number, report bounds. Weaker assumptions give wider bounds; each added assumption narrows them.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | A single estimate dot bursts into a wide range bar. | Worried | "Without strong assumptions, one number isn't honest." | burst |
| 9 | Arrow pins an assumption card; a clamp narrows the bar. A second card narrows it again. | Cranking | "Each assumption buys a tighter range." | clamp creak ×2 |
| 17 | Final bar labeled "somewhere between +2 and +9". | Proud | "Sometimes the answer is a range." | `ding` |
| 22 | Transition. | — | — | `whoosh` |

### Scene 22 · Ch 22 A Gallery of Rogues: Other Methods · 10:12–10:38
**Key idea:** beyond the main toolbox are other templates (such as synthetic control, which builds a weighted blend of untreated units as a stand-in), methods for modeling how effects vary (such as machine-learning approaches), and structural estimation built on explicit theory.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Three "wanted" posters on the board. | Strolling past | "A few more characters worth knowing." | `step`, `paper` |
| 6 | **Synthetic Control:** grey town lines blend into one ghost Riverbend. | — | "Build a control from a blend of others." | blend chord |
| 12 | **Heterogeneous effects:** a tree splits students into branches, each with its own effect. | — | "Let the data say who benefits most." | branch pops |
| 18 | **Structural estimation:** gears of a theory model turn. | Tips hat | "Or model the whole machine with theory." | gear clicks |
| 24 | Transition. | — | — | `whoosh` |

### Scene 23 · Ch 23 Under the Rug · 10:38–11:02
**Key idea:** nearly every study rests on assumptions that are often brushed aside: which model to trust, whether variables measure what we think, missing data, spillovers between people, extreme fat-tailed data, and what exactly the "treatment" is.
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Title card. | — | — | `type`, `motif` |
| 2 | Arrow lifts the corner of a rug. Dust bunnies scatter, each labeled: *Which model?*, *Measuring the right thing?*, *Missing data*, *Spillovers*, *Fat tails*, *What is the treatment?* | Shocked | "Every study sweeps something under here." | rug flap, squeaks ×6 |
| 12 | Arrow catches them in a jar labeled "Limitations". | Scooping | — | jar clink ×3 |
| 18 | Takeaway. | Proud | "Good researchers say what's under the rug." | `ding`, `whoosh` |

### Scene 24 · Finale · 11:02–11:30
| t | Visual | Arrow | Caption | Sound |
|---|---|---|---|---|
| 0 | Camera pulls back: the full case board, with every chapter's card linked by red string. | Standing proud | — | music swell |
| 6 | Back to the Gazette clipping: "15 points" is crossed out; a handwritten note reads "≈ 6 points, *if* our assumptions hold." | Writing | "Not as catchy. Much more true." | chalk scratch, `stamp` |
| 13 | Folder stamped **Case open: keep asking why**. | Tips hat | — | `stamp`, motif resolves to major |
| 18 | Credits: *Based on* The Effect *by Nick Huntington-Klein, free at theeffectbook.net.* *Explainer by Brijesh Shetty · github.com/brijs.* *All case numbers are illustrative.* | Waves | — | final chord |
| 28 | Lamp clicks off. | — | — | lamp click |

---

## 7. Build notes

- **One page, one clock.** A single timeline object drives SVG animation and schedules every Web Audio cue on `AudioContext.currentTime`, so sight and sound stay locked even if the tab stutters.
- **Start screen.** Browsers block sound until a tap, so the film opens on a closed case folder with a "Open the case" button.
- **Controls:** play/pause, scrubber with 23 chapter ticks (tap to jump), mute, captions on/off, music volume.
- **Accessibility:** captions on by default; reduced-motion mode swaps big moves for fades; all colors pass contrast on the board.
- **Mobile:** 16:9 stage scales to the screen width; landscape recommended, with a gentle rotate hint in portrait.
- **Delivery:** published as a shareable web page.
