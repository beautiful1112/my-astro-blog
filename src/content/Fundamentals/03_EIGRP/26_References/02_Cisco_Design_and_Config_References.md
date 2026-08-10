# Cisco Design and Config References

Use current Cisco Feature Navigator / configuration guides for your IOS/IOS XE train—command syntax drifts (classic vs named).

## Topics to bookmark in Cisco docs

- Configuring EIGRP / Named EIGRP  
- EIGRP stub routing  
- EIGRP route summarization  
- EIGRP wide metrics  
- EIGRP IPv6  
- EIGRP authentication (MD5 key chains; HMAC-SHA in named)  
- DMVPN + EIGRP design notes (hub stub, summary, split horizon)  
- IP bandwidth-percent / pacing  

## Design themes (Cisco Validated / enterprise WAN)

- Hub-and-spoke: stub at spokes, summarize at hub  
- Query domain bounding as first SIA defense  
- Prefer named mode for new dual-stack designs  
- Careful redistribution with tags at PE-CE or domain borders  

## Study tip

When a guide shows classic `router eigrp AS`, re-derive the named AF/af-interface equivalent—Module 13 is the map.

---
