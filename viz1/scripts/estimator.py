__author__ = 'Filippo'

p=range(101)

p[85]=914723
p[86]=814211
p[87]=712908
p[88]=640619
p[89]=537998
p[90]=435563
p[91]=344987
p[92]=281389
p[93]=216978
p[94]=169449
p[95]=129717
p[96]=95223
p[97]=68138
p[98]=45900
p[99]=32266
p[100]=53364

tot = 0
for i in range(85,101):
    tot += p[i]

print tot

perc = {}
for i in range(85,101):
    perc[i] =float( p[i])/tot

print perc
