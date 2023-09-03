Regarding my choice of the maximum number of users to meet the 1000ms constraint for Part 2:

For the mixed_tomcat load test, I used the command:
    locust -f mixed_tomcat.py --host=http://tomcat:8888 --headless -u 400 -r 100 -t 30s
for the final output, and you can see the final number of users I chose is 400. It should be noted that for 98%, 
400 users achieves well under 1000ms, hovering around ~500ms. But I chose 400, because it was more consistent in 
staying under 1000ms than 500 users, which I found to vary anywhere from ~800ms to ~1400ms for 98% of responses.

I followed a similar methodology for the mixed_node testing.