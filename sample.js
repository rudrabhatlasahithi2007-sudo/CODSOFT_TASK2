const express = require("express"); 
const session = require("express-session"); 
 
const app = express(); 
 
// Session Middleware 
app.use( 
    session({ 
        secret: "secretkey",          // Secret key for signing session ID cookie 
        resave: false,                // Don't save session if unmodified 
        saveUninitialized: true,      // Save new sessions 
        cookie: { 
            maxAge: 60000             // Session expires after 1 minute (60,000 ms) 
        } 
    }) 
); 
 
// Home Route 
app.get("/", (req, res) => { 
    if (req.session.visits) { 
        req.session.visits++; 
    } else { 
        req.session.visits = 1; 
    } 
 
    res.send(`You visited this page ${req.session.visits} times.`); 
}); 
 
// Start Server 
app.listen(3000, () => { 
    console.log("Server running on http://localhost:3000"); 
}); 