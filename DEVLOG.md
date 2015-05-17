Ongoing devlog. Will cover research stuff, notes, and progress

2015.May.16
-----------
First major commit!

The main collector stuff works.  Grab flows, put them in ES.  Tried throwing a huge tcpreplay at it, system fell over pretty quickly, handles normal load quite well.  I want to play around with the replay to see how many flows per second I can actually take.

I'm not thrilled with the overall structure of the code.  I'm brand new to any significant javascript so I'm not comfortable with the idioms and "proper" way to do things.  First thing up is figuring out the package and object system.

Think I want to package my libs as local npm modules and I think grunt is the makefile to get everything working.

2015.May.17
-----------





