# Case 6: Capture sees packets but the application reports gaps

Possible causes include NIC ring overflow, socket-queue overflow, process descheduling, decoder rejection, session mismatch, kernel-bypass steering, or unexpected multi-socket reuse behavior. An external TAP can also see frames the host NIC loses.

Compare the same sequences at TAP, NIC/bypass API, socket, decoder, and book-application stages.

