<!DOCTYPE html>
<html>
<head>
    <title><%= request.getAttribute("title") %></title>
</head>
<body>
    Hello, <%= request.getParameter("name") %>!<br>
    Greetings from JSP.
</body>
</html>
