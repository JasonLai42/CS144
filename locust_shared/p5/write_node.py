import sys, time, random
from locust import HttpUser, task, between

class MyUser(HttpUser):
    wait_time = between(0.5, 1)

    @task
    def save(self):
        # generate a random postid between 1 and 500
        postid = random.randint(1, 500)
        res = self.client.post("/api/posts", json={"username":"cs144", "postid":str(postid), "title":"Hello", "body":"***World!***"}, name="/api/posts")

    def on_start(self):
        """on_start is called when a Locust start before any task is scheduled"""
        res = self.client.post("/login", data={"username":"cs144", "password": "password"})
        if res.status_code != 200:
            print("Failed to authenticate the cs144 user on the server")
            sys.exit();