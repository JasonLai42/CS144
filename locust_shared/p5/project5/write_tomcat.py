import sys, time, random
from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(0.5, 1)

    @task
    def save(self):
        # generate a random postid between 1 and 500
        postid = random.randint(1, 500)
        res = self.client.post("/editor/post?action=save&username=cs144&postid=" + str(postid) + "&title=Hello&body=***World!***", name="/editor/post?action=save")