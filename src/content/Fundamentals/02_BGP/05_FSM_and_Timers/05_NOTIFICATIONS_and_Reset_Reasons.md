# NOTIFICATION and reset reasons

A NOTIFICATION identifies a fatal BGP condition and normally closes the session. Categories include message header, OPEN, UPDATE, Hold Timer, FSM, and Cease errors. Cease subcodes can clarify administrative shutdown, max-prefix, resource exhaustion, configuration change, connection rejection, or collision resolution.

Modern error handling avoids resetting an entire session for some malformed UPDATE attributes by treating affected NLRI as withdrawn. Always capture the exact code/subcode and peer log before manually clearing the session.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
