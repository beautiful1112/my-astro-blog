# AI fabric design notes

CCDE v3.1 / AI Infrastructure elective: training fabrics care about **bandwidth, incast, latency, and lossless behavior**.

Typical needs:

- Nonblocking or carefully subscribed leaf-spine
- Lossless Ethernet (PFC/ECN) or InfiniBand / RoCEv2
- Storage adjacent to GPUs (data gravity)
- Separate or carefully QoS’d frontend vs backend fabric
- Power/cooling and job completion as the ROI metric

Do not copy an enterprise campus QoS 12-class model and call it an AI fabric. Elephant RDMA plus loss equals job death.

This note is **core literacy**. The AI elective goes deeper on compute/storage; still apply R/C/A.

## Interview framing

“AI training is an east-west, often lossless, data-gravity problem. I design the backend fabric for job completion, not for Internet-edge pretty diagrams.”

---
