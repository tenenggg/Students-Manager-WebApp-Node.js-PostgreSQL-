we also use expression functions a lot because there's a reasons

there's exist 3 type of functions that is declaration, declaration+assignment, expression
arrow function is the same as expression just a shorter version so its a expression type

so the only type u should be using is declaration or expression as declaration+assignment have too many cons 
like memory efficient(theres exist 2 callers variable), can be redeclared and undpredictable blockscope, but it is 
hoisted(the good one)

and the time u should be using definition is when u want to take advantages of the hoisting ONLY 
as it also have the same cons like declaration+assignment, which is can be redeclared and undpredictable blockscope, 
but the only good things about function declaration is it is hoisted and memory efiicient, as its have one callers

and the time u should be using expression is when u want for most of times because it haves:
memory efficient, can't be declared(less chance of mistakes), predictable block scope, can only exist in
block scope if u make it block scope (unlike definition, its inconsistent), and the only bad side is not hoisted,
so u need to assign first and call after.






we also use template strings for more efficient codes and cleaner codes
as when using template strings, u can call variable directly, if not using template strings, u need longer code 
to call the variable.



we also use async and await a lot because there's a reasons
async and await is used to handle asynchronous operations, which are operations that take a long time to complete, such as fetching data from a server, reading a file, or waiting for a timer to finish
if we dont use async and await, our code will run before the server response, so the web will crash
so we use these to so that it pauses the code(the async operation only, not the whole code), runs the async operation, and then continues the code, so that it runs smoothly and not crashes the web
also the process that involves async and await is usually called as callback function and is done in background
it is applied to API calls, file reading, and timer functions
for example, when we fetch data from a server, we use async and await to handle the response, if we dont use async and await, our code will run before the server response, so the web will crash

also javascript is single threaded, which means it can only do one thing at a time, if we use regular code for slow operations (like fetching data), the entire webpage would freeze and wait.
let javascript do other things while waiting for the slow operation to complete, so that the web doesnt freeze


so the process is :
1. await pauses ONLY the async function it's inside (at background)
2. JavaScript puts that function "on hold" 
3. All other code continues running normally (the code that didn't involve async and await)
4. When the server responds, JavaScript comes back to finish the paused function




                EXAMPLE OF ASYNC WITH AWAIT

                async function createStudent() {
                    console.log("1 - Start");
                    
                    const res = await fetch(ENDPOINT);  // ⏸️ PAUSES here, waits for server
                    
                    console.log("2 - Got response");    // Runs AFTER server responds
                    console.log("3 - Status:", res.ok); // Runs AFTER server responds
                }

                createStudent();
                console.log("4 - Outside function");

                // Output:
                // 1 - Start
                // 4 - Outside function          ← Runs immediately
                // ... (waits 2 seconds for server) ...
                // 2 - Got response              ← Runs after waiting
                // 3 - Status: true              ← Runs after waiting









                EXAMPLE OF ASYNC WITHOUT AWAIT

                async function createStudent() {
                    console.log("1 - Start");
                    
                    const res = fetch(ENDPOINT);  // ❌ NO await - doesn't wait!
                    
                    console.log("2 - This runs immediately!");  // Doesn't wait for server!
                    console.log("3 - res is:", res);            // res is a Promise, not the response!
                    console.log("4 - res.ok:", res.ok);         // undefined! (res isn't ready yet)
                }

                createStudent();
                console.log("5 - Outside function");

                // Output:
                // 1 - Start
                // 2 - This runs immediately!     ← Doesn't wait!
                // 3 - res is: Promise {<pending>} ← It's a Promise, not data!
                // 4 - res.ok: undefined          ← Can't access data yet!
                // 5 - Outside function
                // ... (server responds later, but we already moved on) ...




                anything other than async and await will run immediately


for the things that didn't involve async and await, is the usual code that we run, like simple calculations, variable assignments etc


