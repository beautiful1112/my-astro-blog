---
title: Four days to pass the CCIE exam
description: A personal account of preparing for and passing the CCIE lab exam under intense time pressure, version changes, and SDN challenges.
date: 2023-11-26
tags: [CCIE]
category: Thoughts and Reflections
cover: /images/cisco-ccie-logo.png
---

It has been more than half a month since I passed the CCIE certification exam, but now, thinking about it, I still remember the situation and feel a lot. As an older examinee, I was not proficient in lab practice, temporarily changed the solution, and encountered design changes. So many debuff superimposed together, and I finally passed the exam. Now I think it is somewhat unreal. Now I will review the whole preparation process and share with you:

## Cisco changed the version, and I had to reschedule

While preparing for Cisco, I initially signed up for the wallslab institution and booked the exam on March 14th. But I was very upset when I heard that Cisco had changed the lab version in early March. It is horrible for me to ask for leave because of my work, so I have to reschedule. At that time, I did not get the exam place in April, but only got the exam place on March 27. I thought that I would take a gamble like this, in case there was good news from my institution.

But my agency is really very irresponsible. Not only do they not have enough performance to run the lab machine, but also they don't deal with the questions I have in the practice of SDN.

By chance, I re-enrolled in WOLF's lab class. Although they do not have the new version, my English is good enough for design, so I can handle some new questions even if I encounter them. I just want to have enough performance lab machines to practice. WOLF's rack is rich in resources and strong in performance, so it doesn't get stuck when the device is fully open. And at this time, from the exam, only five days, the actual practice time is only four days.

## Temporary modification of the solution, all kinds of difficulties

Cisco's new CCIE exam is divided into three sections: the first is traditional routing and switching, the second is SDN, and the third is Python. The routing and switching part was easy to practice, and the Python part was easy to do because I had a little programming background. But the SDN part of the second part is very difficult for me. Because I am not familiar with Cisco's SDN system in my daily work, I am confused about solutions and errors, and can only memorize them by rote.

When I started working with WOLF's rack, I was devastated. Because when I used the solution I used before, all the errors were reported on WOLF's rack. It didn't work at all. The exam was less than two days away. Fortunately, WOLF's teacher was patient enough to explain the relevant knowledge points to me and go over the solution. I also settled down to prepare for the last practice, and successfully completed the lab experiment.

Since my exam was on Monday, I took the high-speed train from Shanghai to Beijing on Sunday. Arriving at the hotel around 3 pm, I immediately opened my laptop and began my final lab exercise.

At first, the traditional part was done quickly and without problems. When I did the SDN part, it was very smooth at the beginning. As a result, I was overwhelmed with joy. After adding ISE to DNAC, I did not add an AAA configuration to the network, and then I made a provision. By the time I found out, it was too late. If you push the configuration again, error code 10025 will be reported.

I have no choice but to restore snapshots of DNAC and ISE and reset switches SW400, SW501, SW502, and SW510. So my time was down again, and I asked WOLF's teacher to help me stretch it out again. I am also very grateful to the other students who selflessly squeezed out the rack time for me.

By 9:30 p.m., I was finally done. However, it is still not ideal, because the two hosts of SW400 did not get the addresses, and the problem was not found. At this time, I could not care so much; the end of the rack, out of the hotel for dinner, the state of mind has been boom...

At 10:30 in the evening, WOLF's teacher held another online meeting for me, telling me the precautions in the examination room and encouraging me to be careful. If I had done these, I could pass. At this point, my mind has recovered. The worst thing is to retake the exam; just do it!

## To the examination room, the last fight

The next morning, I first had two cups of espresso, and then I ate three baozi downstairs in Yintai. I bought a bottle of mineral water, a bottle of Coke, and a bottle of mints.

Cisco China on the 8th floor of Block C of the Intime Center. When I went there in the morning, I didn't know how to write it down as 10 floors, ran to the 10th floor and found it wrong, and ran down. But luckily, the examiner had not come yet, so I sat outside and waited, thinking that I would not be the only one taking the exam today.

I waited until around 8 o'clock, when another candidate came, and then the examiner came too. The examiner first gave us a signature form, let us sign, and check the certificate; each received a bracelet and storage things. When we entered the examination room, we stood in front of our respective racks, and the examiner read out the notes. He was very detailed and very nice.

After the examiner read the notes, I sat down, put away the water and peppermint, and entered my test number. When I saw the resource and the title in the design section, I took a deep breath and said to myself: "Hey bro, it was make or break!" About 45% of the questions in the design section have been updated. However, since my English is OK, I can understand the resources and questions, so I should have given the correct answers. (So, guys, don't put down the theoretical knowledge; always renew.)

It took me about an hour and a half to finish the design part. After finishing, I did not rush to finish. Following the method of Teacher WOLF, I wrote down on scratch paper the mistakes that are easy to make and the details that must be paid attention to. Then I roughly listed several contents of SDN, and prepared to mark √ every time I completed each link, so that I knew what I was doing.

I went outside to use one of the toilets, took another sip of Coke with a mint in it, rubbed my face, and began to DOO parts. The traditional part is basically, but I made a lot of mistakes in 1.2 at the beginning, perhaps because the keyboard was not familiar to me. I stopped in time to wipe my sweaty hands, let my nervous mood calm down, and then began to knock again, feeling much better.

By the time I got to 1.4, I had that kind of mind flow, immersed in the rhythm of my own version, and it was pretty good. In 1.12 DMVPN error, R62 seems to have been slightly modified by the examiner for preconfiguration, which is different from the general preconfiguration and lacks some configuration. None of this is a problem, though, because the WOLF comes with even less preload on the rack. In 1.15, I encountered R3 and R4 exchanging all IPv4 and IPv6 routes, so I need to pay attention.

At 1.16, when it was time to eat, another examinee and I went to the leisure area of Cisco for dinner.

Examiner unified order box lunch: chicken and cow covered rice, especially delicious! After a quick meal, I hurried back to the door to wait for another candidate. Because I heard that if you eat too slowly, the examiner might add a mistake to your exam.

When we both arrived, we knocked on the door and went back to the exam room.

After finished the routing and switching part, I'll do the third part first, because that's easier. When I finished, save it and let it go. After I finished the traditional part and all the symptoms were confirmed, I took a sip of water and started the 2.1 part that was the most stressful to me. DNAC released the AAA configuration.

Since it took me 2 hours and 15 minutes to finish the first and third parts, SDN is quite sufficient. I roughly recalled the various pits in 2.1, and successfully configured the content of ISE (there was no incident on ISE).

When changing DNAC, I learned from the previous lessons. I carefully confirmed all the required confirmations and deleted the re-added addition. In any case, I finished all of them. The AAA configuration starts to be delivered. I was relieved to see that the push was successful and AAA configuration was available on all four switches. The biggest hurdle was over. (I also had a BUG with ISE; TACACS doesn't have a log, which I found innocuous, if not deductible.)

The rest of the part was done step by step; the web page was a bit stuck, the mouse was not very good, and this part really took me a long time. In Part 2.3, ensure that the port name and address are correct; otherwise, the BGP neighbor cannot get up. I was relieved when 2.4 was finished. At 2.5, R23, 24, and two BGP neighbors of vedge did not get up. I was in a panic that I was going to have to think about retaking it...

After I calmed down, I carefully sorted out the mistakes and found that I had written the address of the interface on the two vedge backwards... After modification, redistributed the configuration; everything is fine!

Half an hour before the end of the exam, I saved all the devices and exited configuration mode, and then checked the route again and various details of the configuration. Once you're clear, you have 20 minutes until the end of the test. End the test!

## A nervous wait is the final fruit

After finishing the exam, I had dinner with my relatives working in Beijing. Although it was an Internet celebrity roast duck restaurant, I did not care about it. After all, I did not know what the result would be. I received the email at 8:30 p.m., and returned to the hotel's official website at 9:30 to confirm it. When I saw the PASS, I was really in tears of joy. This test is too extreme!

## Conclusion

I am an older networker, and is a half-skilled networker who switched to a job I was not trained for. This CCIE examination not only verified my mastery of theoretical knowledge, but also gave me greater confidence to challenge higher goals and pursue a more meaningful life.
