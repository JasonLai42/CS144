// Adapted from TA project 4 discussion: https://ccle.ucla.edu/pluginfile.php/4451405/mod_resource/content/0/project%204%20discussion.pdf
// Adapted from project 4 spec: http://oak.cs.ucla.edu/classes/cs144/project4/
import { Component } from '@angular/core';
import { Post } from './post';
import { BlogService } from './blog.service';
import { ListComponent } from './list/list.component'
import { EditComponent } from './edit/edit.component'
import { PreviewComponent } from './preview/preview.component'
import * as cookie from 'cookie';

enum AppState { List, Edit, Preview };

function parseJWT(token) {
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Webapp title
  title = 'angular-blog';
  // Username of authenticated user we get from JWT
  username: string;
  // Posts that need to be displayed by the list component for this user
  posts: Post[];
  // Values to be passed to either edit or preview components
  currentPost: Post;
  // Control which components to display
  appState: AppState;
  
  constructor(private blogService: BlogService) {
    // Get username from JWT
    let cookies = cookie.parse(document.cookie);
    this.username = parseJWT(cookies.jwt).usr;

    blogService.fetchPosts(this.username).then((posts) => {
      // Fetch the posts for the given username
      this.posts = posts;
      // Set the app state to display link
      if(!window.location.hash) {
        window.location.hash = `#/`;
      }
      else {
        this.onHashChange();
      }
    });

    // Hashchange
    window.addEventListener("hashchange", () => this.onHashChange());
  }

  /* Hashchange Event Handler */

  onHashChange() {
    // Parse the window.location.hash to get what fragment we have
    var hash_split = window.location.hash.split("/");

    // If preview
    if(hash_split.length === 3 && hash_split[0] === "#" && hash_split[1] === "preview") {
      // Test if postid is a legit number
      let postid_str = hash_split[2];
      if(typeof postid_str === "string" && !Number.isNaN(Number(postid_str))) {
        let postid = Number(postid_str);
        // Search for this postid in our local array
        let post_found = false;
        this.posts.forEach((post, index) => {
          if(post.postid === postid) {
            this.currentPost = post;
            post_found = true;
          }
        });
        // Switch display to preview component or list component if we didn't find such a post
        if(post_found) {
          this.appState = AppState.Preview;
        }
        else {
          this.appState = AppState.List;
        }
        return;
      }
    }
    // Else if edit
    else if(hash_split.length === 3 && hash_split[0] === "#" && hash_split[1] === "edit") {
      // Test if postid is a legit number
      let postid_str = hash_split[2];
      if(typeof postid_str === "string" && !Number.isNaN(Number(postid_str))) {
        let postid = Number(postid_str);
        // If postid is 0, then we are creating a new post
        if(postid === 0) {
          // Create a new post object and set it to the currentPost member
          // Our Post class definition sets postid to 0 already
          const post: Post = new Post();
          this.currentPost = post;
          this.appState = AppState.Edit;
        }
        // Else search for the post in local array
        else {
          let post_found = false;
          this.posts.forEach((post, index) => {
            if(post.postid === postid) {
              this.currentPost = post;
              post_found = true;
            }
          });
          // Switch display to preview component or edit component if we didn't find such a post
          if(post_found) {
            this.appState = AppState.Edit;
          }
          else {
            this.appState = AppState.List;
          }
        }
        return;
      }
    }
    // Else if list
    else if(hash_split.length === 2 && hash_split[0] === "#" && hash_split[1] === "") {
      // Set the appstate to display the list component
      this.appState = AppState.List;
      return;
    }
  }

  /* List Component Event Handlers */

  newPost() {
    // Switch to edit view
    window.location.hash = `#/edit/0`;
  }

  openPost(post: Post) {
    // Set the currentPost to the post user clicked on then open it in edit view
    window.location.hash = `#/edit/${post.postid}`;
  }

  /* Edit Component Event Handlers */

  savePost(post: Post) {
    // Set the new or updated post in our db
    this.blogService.setPost(this.username, post).then((new_post) => {
      // If it's a new post
      if(post.postid === 0) {
        // Create a temp post with the returned attributes that we'll push onto the local array
        let temp_post: Post = new Post();
        temp_post.postid = new_post.postid;
        temp_post.created = new_post.created;
        temp_post.modified = new_post.modified;
        temp_post.title = post.title;
        temp_post.body = post.body;
        // Push the new post onto the local array
        this.posts.push(temp_post);
        // Push should push the new post to the back of the local array but just in case
        this.posts.sort((a, b) => {
          return Number(a.postid) - Number(b.postid);
        });
      }
      // Else if it's an updated post
      else {
        // Create a temp post with the returned attributes that we'll push onto the local array
        let temp_post: Post = new Post();
        temp_post.postid = post.postid;
        temp_post.created = post.created;
        temp_post.modified = new_post.modified;
        temp_post.title = post.title;
        temp_post.body = post.body;
        // Iterate through the local posts array and update the edited post to the new one
        this.posts.forEach((old_post, index) => {
          if(old_post.postid == post.postid) {
            this.posts[index] = temp_post;
          }
        });
      }
      // Switch to list view
      window.location.hash = `#/`;
    });
  }

  deletePost(post: Post) {
    // Delete this post from the db
    this.blogService.deletePost(this.username, post.postid);
    // Iterate through the local array and splice out the deleted post
    this.posts.forEach((old_post, index) => {
      if(old_post.postid === post.postid) {
        this.posts.splice(index, 1);
      }
    });
    // Switch to list view
    window.location.hash = `#/`;
  }

  previewPost(post: Post) {
    // Switch to display the blog post's preview
    window.location.hash = `#/preview/${post.postid}`;
  }

  /* Preview Component Event Handlers */

  editPost(post: Post) {
    // Switch back to edit view from preview view
    window.location.hash = `#/edit/${post.postid}`;
  }

}
