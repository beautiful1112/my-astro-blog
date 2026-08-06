# Case 10: Sequence gap without packet loss

A UDP datagram can contain multiple application messages, and session resets may redefine the sequence. A decoder that assumes one datagram equals one application sequence reports false gaps.

Network packet sequence, protocol message sequence, event sequence, and book-update identity may be separate layers. Follow the exact venue specification.

