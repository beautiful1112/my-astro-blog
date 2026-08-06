# IGMPv3 Max Resp Code and QQIC encoding

IGMPv3 uses compact floating-style encodings so one-byte fields can represent both fine short intervals and large values.

## Max Resp Code

The decoded result is in **deciseconds**.

If code < 128:

**value = code**

If code ≥ 128, interpret:

~~~text
  7 6 5 4 3 2 1 0
 +-+-+-+-+-+-+-+-+
 |1| exp | mant  |
 +-+-+-+-+-+-+-+-+
~~~

**value = (mantissa OR 0x10) << (exponent + 3)**

Then divide by 10 for seconds.

Example code **0x96**:

- Binary: 1 001 0110
- exp = 1
- mant = 6
- value = (6 OR 16) << 4 = 22 × 16 = 352 deciseconds
- Max Resp Time = **35.2 seconds**

## QQIC

QQIC uses the same bit formula, but the decoded result is directly in **seconds**.

- QQIC 125 means 125 seconds.
- QQIC 0x96 means 352 seconds.

## Zero values

- QRV = 0 means use the locally configured/default Robustness Variable.
- QQIC = 0 tells a non-querier to use its configured/default Query Interval.
- Do not apply the IGMPv1 “zero means 10 seconds” compatibility rule to an actual ≥12-byte v3 Query.

## Packet-decoder check

Capture tools often show both raw code and decoded time. When validating a timer problem, record both; a raw value above 127 is not a direct decimal interval.

Primary reference: [RFC 3376, Sections 4.1.1 and 4.1.7](https://www.rfc-editor.org/rfc/rfc3376.html#section-4.1.1).

