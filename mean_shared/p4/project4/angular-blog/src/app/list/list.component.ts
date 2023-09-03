// Adapted from TA project 4 discussion: https://ccle.ucla.edu/pluginfile.php/4451405/mod_resource/content/0/project%204%20discussion.pdf
import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  // Input and output to the list component
  @Input() posts: Post[];
  @Output() openPost = new EventEmitter<Post>();
  @Output() newPost = new EventEmitter<Post>();

}
