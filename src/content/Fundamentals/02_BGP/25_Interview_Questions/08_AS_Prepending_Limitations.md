# Interview: Why Might AS Prepending Fail?

## Question

You prepend your ASN three times. Inbound traffic does not move. Why?

## Strong answer

Prepend only lengthens AS_PATH. Remote decision may never reach that step because:

1. Remote LOCAL_PREF prefers another path.
2. Remote filters or de-prefers your longer path entirely.
3. More-specifics elsewhere win longest match.
4. You prepended on the wrong peer/session.
5. Communities would have been the provider’s supported lever—not prepend.

Inbound TE is influencing **someone else’s** policy. Prepend is a hint, not a guarantee.

## Follow-ups

- Ordered decision steps before AS_PATH?
- Provider community alternatives?
- MED vs prepend across two providers?

## Cross-links

[LOCAL_PREF beats AS_PATH case](../24_Practical_Cases/04_LOCAL_PREF_Beats_Shorter_AS_Path.md), [Outbound/inbound TE](../11_Policy_and_Traffic_Engineering/06_Outbound_and_Inbound_Traffic_Engineering.md).

---
