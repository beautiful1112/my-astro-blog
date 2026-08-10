# Common neighbor mismatches

Most “EIGRP won’t neighbor” tickets collapse into a short symptom table. Use it before deep DUAL theory.

## Symptom → likely cause

| Symptom / observation | Likely mismatch or fault | First check |
|---|---|---|
| Empty neighbor table, Hellos outbound | AS mismatch | `show ip protocols` both sides |
| Empty neighbor table | K-value mismatch | `metric weights` / Hello K TLVs |
| Empty neighbor table | Primary subnet mismatch / secondary only | Interface IPs, masks |
| Empty neighbor table | `passive-interface` | `show ip protocols` |
| Empty neighbor table | ACL/CoPP drop proto 88 or 224.0.0.10 | ACL, capture |
| Neighbors flap Hold→0 | Timer mismatch / loss | Hello/Hold, interface errors |
| Never up with auth configured | Keychain/key/mode mismatch | `show key chain`, auth config |
| Up on hub, not spoke NBMA | Multicast NBMA issue | Static `neighbor` |
| Up then stuck queues | Unicast ACK path broken | ACL unicast proto 88 |
| IPv6 AF down, IPv4 up | RID missing / AF not enabled | RID, AF config |
| Same LAN, only some peers | Static neighbor disabled mcast | Remove static on LAN |
| Different VRF | Interface VRF mismatch | `vrf forwarding` |

Related: [Neighbor formation requirements](01_Neighbor_Formation_Requirements.md), [K-values and mismatch](../07_Metrics_and_K_Values/04_K_Values_and_Mismatch.md).

## Ordered triage

```text
1. Interface up + same subnet primary?
2. EIGRP enabled (network / af-interface) and not passive?
3. Same AS + same K-values?
4. Auth match?
5. Capture: Hello seen both ways (224.0.0.10 or unicast)?
6. Only then: platform bugs / capacity
```

## Configuration patterns (deliberate break/fix lab)

### Cisco IOS / IOS XE

```text
! Break K-values on R2 only
router eigrp 100
 metric weights 0 1 1 1 1 1
! Restore defaults: K1=1 K3=1 others 0
 metric weights 0 1 0 1 0 0
```

## Verification

```text
show ip eigrp neighbors
show ip eigrp interfaces detail
show ip protocols
debug eigrp packets hello
undebug all
```

Document one row of the table per lab break—interview gold.

## Risks

- Changing multiple variables before retest.
- Fixating on DUAL while adjacency never formed.
- Assuming logs always say “K-value mismatch” (often silent ignore).

## Interview framing

“If EIGRP neighbors won’t form, I walk AS, K-values, primary subnet, passive, auth, then proto-88 multicast/unicast path—before I talk about successors or SIA.”

---
