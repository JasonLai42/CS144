// Adapted from TA project 4 discussion: https://ccle.ucla.edu/pluginfile.php/4451405/mod_resource/content/0/project%204%20discussion.pdf
// Adapted from project 4 spec: http://oak.cs.ucla.edu/classes/cs144/project4/
import { Component } from '@angular/core';
import { Post } from './post';
import { BlogService } from './blog.service';
import { ListComponent } from './list/list.component'
import { EditComponent } from './edit/edit.component'
import { PreviewComponent } from './preview/preview.component'

enum AppState { List, Edit, Preview };

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
    blogService.fetchPosts(this.username).then((posts) => {
      // Fetch the posts for the given username
      this.posts = posts;
      // Set the app state to display just the list component
      this.appState = AppState.List;
    });
  }

  /* List Component Event Handlers */

  newPost() {
    // Create a new post object and set it to the currentPost member
    // Our Post class definition sets postid to 0 already
    const post: Post = new Post();
    this.currentPost = post;
    // Switch to edit view
    this.appState = AppState.Edit;
  }

  openPost(post: Post) {
    // Set the currentPost to the post user clicked on then open it in edit view
    this.currentPost = post;
    this.appState = AppState.Edit;
  }

  /* Edit Component Event Handlers */

  savePost(post: Post) {
    // Set the new or updated post in our db
    this.blogService.setPost(this.username, post).then((new_post) => {
      // If it's a new post
      if(post.postid === 0) {
        // Push the new post onto the local array
        this.posts.push(new_post);
        // Push should push the new post to the back of the local array but just in case
        this.posts.sort((a, b) => {
          return Number(a.postid) - Number(b.postid);
        });
        // We set the currentPost to the new post, but we switch to list view so it doesn't matter...
        this.currentPost = new_post;
        this.appState = AppState.List;
      }
      // Else if it's an updated post
      else {
        // Iterate through the local posts array and update the edited post to the new one
        this.posts.forEach((old_post, index) => {
          if(old_post.postid == post.postid) {
            this.posts[index] = new_post;
          }
        });
        // We set the currentPost to the updated post, but we switch to list view so it doesn't matter...
        this.currentPost = new_post;
        this.appState = AppState.List;
      }
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
    this.appState = AppState.List;
  }

  previewPost(post: Post) {
    // Switch to display the blog post's preview
    this.appState = AppState.Preview;
  }

  /* Preview Component Event Handlers */

  editPost(post: Post) {
    // Switch back to edit view from preview view
    this.appState = AppState.Edit;
  }

}
