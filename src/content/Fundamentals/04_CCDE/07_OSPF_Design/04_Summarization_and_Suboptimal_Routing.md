# Summarization and suboptimal routing

ABR summarization hides specifics. Traffic then follows the **summary metric**, which may not be the best specific path.

```text
Area 10: 10.10.1.0/24 via west
         10.10.2.0/24 via east
ABR advertises 10.10.0.0/16 into area 0
Core cannot choose west vs east per subnet
```

That is often **acceptable** (stability). If a requirement is optimal exit per prefix, you cannot summarize that heavily—or you leak specifics / use TE/BGP.

Always pair a summary with a **discard route** on the ABR to avoid blackholing traffic for holes in the summary.

## Interview framing

“I summarize for stability and know I may sacrifice optimal exit. If the business needs per-prefix exit, I leak or move that policy to BGP.”

---
