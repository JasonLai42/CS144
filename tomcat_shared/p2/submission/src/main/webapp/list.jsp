<!-- HTML body adapted from the page source of the CS144 Project 2 Demo Website: http://oak.cs.ucla.edu/editor/post?action=list&username=junghoo -->
<%@ page import ="java.util.ArrayList"%>
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
        <form action="post" method="POST" id="0">
            <input type="hidden" name="username" value="<%= request.getAttribute("username") %>">
            <input type="hidden" name="postid" value="0">
            <button type="submit" name="action" value="open">New Post</button>
        </form>
    </div>
    <table>
        <tr><th>Title</th><th>Created</th><th>Modified</th><th>&nbsp;</th></tr>
        <% 
            ArrayList<Integer> postids = (ArrayList<Integer>) request.getAttribute("postids");
            ArrayList<String> titles = (ArrayList<String>) request.getAttribute("titles");
            ArrayList<String> bodies = (ArrayList<String>) request.getAttribute("bodies");
            ArrayList<String> create_times = (ArrayList<String>) request.getAttribute("create_times");
            ArrayList<String> modify_times = (ArrayList<String>) request.getAttribute("modify_times");

            for(int i = 0; i < titles.size(); i++) {
                int post_id = (int)postids.get(i);
                String post_title = (String)titles.get(i);
                String created_time = (String)create_times.get(i);
                String modified_time = (String)modify_times.get(i);
        %>
            <tr>
                <form id="<%= post_id %>" action="post" method="POST"> 
                    <input type="hidden" name="username" value="<%= request.getAttribute("username") %>">
                    <input type="hidden" name="postid" value="<%= post_id %>">
                    <td><%= post_title %></td>
                    <td><%= created_time %></td>
                    <td><%= modified_time %></td>
                    <td>
                        <button type="submit" name="action" value="open">Open</button>
                        <button type="submit" name="action" value="delete">Delete</button>
                    </td>
                </form>
            </tr>
        <% 
            }
        %>
    </table>
</body>
</html>