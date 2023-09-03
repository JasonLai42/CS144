import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  postTitle: string;
  postBody: string;

  constructor() { }

  ngOnInit(): void {
    // On initialization of this component, we want to convert the inputted post's title and body using commonmark
    this.convertToHTML();
  }

  // Need to have a changes function to check if Input changed so we can call convertToHTML() again
  // This is because ngOnInit() only executes once, so if user uses a deep link to change preview, it won't be called again and the preview won't change accordingly
  ngOnChanges(): void {
    // On initialization of this component, we want to convert the inputted post's title and body using commonmark
    this.convertToHTML();
  }

  convertToHTML(): void {
    // Create a parser and renderer
    var parser = new Parser();
    var renderer = new HtmlRenderer();

    // Parse the title and body using commonmark, then render as HTML
    this.postTitle = renderer.render(parser.parse(this.post.title));
    this.postBody = renderer.render(parser.parse(this.post.body));
  }

  // Input and output to the preview component
  @Input() post: Post;
  @Output() editPost = new EventEmitter<Post>();

}
