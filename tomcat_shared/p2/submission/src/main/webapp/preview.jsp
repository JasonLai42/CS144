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
    <div>
        <form action="post" method="POST">
            <input type="hidden" name="username" value="<%= request.getAttribute("username") %>">
            <input type="hidden" name="postid" value="<%= request.getAttribute("postid") %>">
            <input type="hidden" name="title" value="<%= request.getAttribute("post_title") %>">
            <input type="hidden" name="body" value="<%= request.getAttribute("post_body") %>">
            <button type="submit" name="action" value="open">Close Preview</button>
        </form>
    </div>
    <div>
        <h1 id="title"><p><%= request.getAttribute("post_title") %></p></h1>
        <div id="body"><p><%= request.getAttribute("post_body") %></p></div>
    </div>
</body>
</html>