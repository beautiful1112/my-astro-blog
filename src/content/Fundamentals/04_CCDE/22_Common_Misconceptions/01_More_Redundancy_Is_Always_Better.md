# Misconception: more redundancy is always better

## The myth

“Add another box, another link, another protocol—more HA.”

## Why it is wrong

Redundancy that **shares fate** or **adds control-plane complexity** can lower availability (loops, split brain, human error). Cost spent on a useless third path is not spent on the path that was actually shared.

## Counterexample

Two cores, one STP domain, one stretched VLAN: you bought a larger outage.

## Correct habit

Name the domain you are splitting. If you cannot, you added parts, not HA.

Related: [Fate sharing](../15_High_Availability_and_Scale/04_Fate_Sharing.md).

---
