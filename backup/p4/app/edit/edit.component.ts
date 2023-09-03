// Adapted from TA project 4 discussion: https://ccle.ucla.edu/pluginfile.php/4451405/mod_resource/content/0/project%204%20discussion.pdf
import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // Input and output to edit component
  @Input() post: Post;
  @Output() savePost = new EventEmitter<Post>();
  @Output() deletePost = new EventEmitter<Post>();
  @Output() previewPost = new EventEmitter<Post>();

}
