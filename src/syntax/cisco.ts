import type { LanguageRegistration } from 'shiki';

/** TextMate grammar for Cisco IOS and FortiGate CLI, highlighted by Shiki. */
export const cisco: LanguageRegistration = {
  name: 'cisco',
  scopeName: 'source.cisco',
  aliases: ['ios', 'ios-xe', 'fortigate', 'fortios'],
  patterns: [
    { include: '#comment' },
    { include: '#prompt' },
    { include: '#string' },
    { include: '#syslog' },
    { include: '#ipv4' },
    { include: '#interface' },
    { include: '#hyphenated' },
    { include: '#keyword' },
    { include: '#number' },
  ],
  repository: {
    comment: {
      patterns: [
        {
          // Cisco comments are "!" or "! text". Ping success is a run of bangs.
          match: String.raw`^\s*(?:!\s.*|!\s*$|#.*)$`,
          name: 'comment.line.cisco',
        },
        {
          match: String.raw`(?<=\s)#[^\n]*`,
          name: 'comment.line.number-sign.cisco',
        },
      ],
    },
    prompt: {
      match: String.raw`^(?:[A-Za-z][\w.@:-]*)(?:\([^)\n]*\))?[#>]`,
      name: 'entity.name.function.prompt.cisco',
    },
    string: {
      match: String.raw`(?:"[^"\n]*"|'[^'\n]*')`,
      name: 'string.quoted.cisco',
    },
    syslog: {
      match: String.raw`%[A-Z0-9]+(?:[-_][A-Z0-9]+)+`,
      name: 'constant.other.syslog.cisco',
    },
    ipv4: {
      match: String.raw`\d{1,3}(?:\.\d{1,3}){3}(?:/\d{1,2})?`,
      name: 'string.unquoted.ip.cisco',
    },
    interface: {
      match: String.raw`\b(?:GigabitEthernet|FastEthernet|Loopback|Port-channel|Ethernet|Tunnel|Vlan|Gi|Fa|Lo|Tu|Po|Et|gi|fa|lo|tu)\d+(?:/\d+)*\b|\b[Gg]\d+/\d+\b`,
      name: 'support.type.interface.cisco',
    },
    hyphenated: {
      match: String.raw`\b[A-Za-z]+(?:-[A-Za-z0-9]+)+\b`,
      name: 'entity.name.class.cisco',
    },
    keyword: {
      match: String.raw`(?i)\b(?:show|interface|access-list|permit|deny|ping|source|shutdown|router|network|exit|address|sparse-mode|neighbor-filter|multicast-routing|pim|ospf|bgp|vlan|description|encapsulation|config|edit|set|next|unset|system|tunnel|remote-gw|local-gw|allowaccess|route-map|community-list|standard|prefix-list|neighbor|remote-as|mroute|boundary|dr-priority|rp-candidate|bsr-candidate|join-group|igmp|sparse|dense|ip|no|end|int)\b`,
      name: 'keyword.other.cisco',
    },
    number: {
      match: String.raw`\b\d+\b`,
      name: 'constant.numeric.cisco',
    },
  },
};
