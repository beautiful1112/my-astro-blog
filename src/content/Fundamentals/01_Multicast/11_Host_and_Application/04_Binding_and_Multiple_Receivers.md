# Binding and multiple receiver processes

`SO_REUSEADDR`, `SO_REUSEPORT`, wildcard versus group-address binding, and delivery to multiple sockets vary by OS. Test the exact target kernel.

A production receiver should log selected interface/index, group/source/port, effective socket buffers, join result, first/last packet time, sequence state, and kernel/socket drop counters. Reuse behavior can otherwise distribute packets between processes in surprising ways.

