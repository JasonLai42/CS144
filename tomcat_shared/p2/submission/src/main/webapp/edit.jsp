<!-- Code started out from the skeleton of the CS144 Project 2 zip file -->
<!-- HTML body adapted from the page source of the CS144 Project 2 Demo Website: http://oak.cs.ucla.edu/editor/post -->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title><%= request.getAttribute("page_title") %></title>
</head>
<body>
    <div><h1><%= request.getAttribute("page_title") %></h1></div>
    <form action="post" method="POST">
        <div>
            <button type="submit" name="action" value="save">Save</button>
            <button type="submit" name="action" value="list">Close</button>
            <button type="submit" name="action" value="preview">Preview</button>
            <button type="submit" name="action" value="delete">Delete</button>
        </div>
        <input type="hidden" name="username" value="<%= request.getAttribute("username") %>">
        <input type="hidden" name="postid" value="<%= request.getAttribute("postid") %>">
        <div>
            <label for="title">Title</label>
            <input type="text" name="title" value="<%= request.getAttribute("post_title") %>">
        </div>
        <div>
            <label for="body">Body</label>
            <textarea style="height: 20rem;" name="body"><%= request.getAttribute("post_body") %></textarea>
        </div>
    </form>
</body>
</html>
