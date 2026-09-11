# EVPN Multi-Site

Each site has a local spine-leaf fabric and border gateway pair. Border gateways exchange EVPN routes across two independent data-center interconnect links.

```text
Site 1 ID 101                         Site 2 ID 102
  Spines / RR                           Spines / RR
  Leaves                                Leaves
  BGW pair <--- DCI 1 EVPN eBGP ---> BGW pair
           <--- DCI 2 ------------->
                RT policy · Site-ID
```

Local RRs stay site-local. BGWs are the only speakers that should re-originate or summarize EVPN toward the other site.

## Related

- [Stretch only when required](01_Stretch_Only_When_Required.md)
- [DCI choices](03_DCI_Choices.md)

---
