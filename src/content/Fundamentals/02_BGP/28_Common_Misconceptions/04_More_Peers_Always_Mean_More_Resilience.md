# Misconception: More BGP Peers Always Mean More Resilience

Multiple peers can share:

- One physical fiber.
- One exchange fabric.
- One line card or router.
- One power feed.
- One provider backbone.
- One route reflector or underlay next hop.

They may also fail to expose alternative paths because of policy or route reflection.

Resilience comes from independent failure domains, sufficient backup capacity, usable alternate routes, and tested recovery—not raw neighbor count.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
