# Lab: Measure BGP Failover Loss

## Topology

A source and destination communicate through primary and backup eBGP edges.

## Objectives

Break convergence into measurable stages.

## Tasks

1. Send sequence-numbered traffic at a known rate.
2. Synchronize device and measurement clocks.
3. Record physical/BFD detection, BGP invalidation, best-path selection, RIB, and FIB times.
4. Fail the primary link, node, and upstream next hop separately.
5. Repeat with BFD and PIC/backup installation changes.
6. Calculate lost packets and maximum consecutive-loss interval.

## Lesson

The operational metric is data-plane loss under each failure model, not one protocol timer.

---

