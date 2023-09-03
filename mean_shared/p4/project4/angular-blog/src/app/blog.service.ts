// Adapted from TA project 4 discussion: https://ccle.ucla.edu/pluginfile.php/4451405/mod_resource/content/0/project%204%20discussion.pdf
import { Injectable } from '@angular/core';
import { Post } from './post';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

    constructor() { }

    fetchPosts(username: string): Promise<Post[]> {
        return fetch(`/api/posts?username=${username}`, { method: 'GET' }).then(response => response.json());
    }

    getPost(username: string, postid: number): Promise<Post> {
        return fetch(`/api/posts?username=${username}&postid=${postid}`, { method: 'GET' }).then(response => response.json());
    }

    setPost(username: string, post: Post): Promise<Post> {
        return fetch(`/api/posts`, { 
                                        method: 'POST', 
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }, 
                                        body: JSON.stringify({
                                            username: username,
                                            postid: post.postid,
                                            title: post.title,
                                            body: post.body
                                        })
                                    }).then(response => response.json());
    }

    deletePost(username: string, postid: number): Promise<void> {
        return fetch(`/api/posts?username=${username}&postid=${postid}`, { method: 'DELETE' }).then(response => response.json());
    }
}