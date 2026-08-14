// JavaScript source code
let orderList;
let persistantOrderList = sessionStorage.getItem("orders")
let totalPrintedThisCycle = 0;
function storeOrderList() {
    sessionStorage.setItem("orders", JSON.stringify(orderList))
    persistantOrderList = sessionStorage.getItem("orders");

}
//Checks if system storage has previous
function checkOrderList() {
    if (sessionStorage.getItem("orders") !== null) {
        orderList = [] = JSON.parse(persistantOrderList);
    }
    else {
        orderList = [];
    }
}

checkOrderList();


//Order object constructor, so that multiple can be made using the same format
function order(id, country, orderNumber, orderStatus) {
    this.id = id;
    this.country = country;
    this.orderNumber = orderNumber;
    this.orderStatus = orderStatus;
}

//So, i already wrote all this code free, but I encased it in a larger function so i can call all this whenever it is needed (like on button click instead of always on startup)
function placeOrder() {
    //Creates a promise that fetches from the API, which will return a random meal with the main ingredient that the user has input
    let getAMeal = new Promise(function (resolve, reject) {

        function getUserInput() {
            let userInput = prompt("Please enter an ingredient")
            let mainMealIngredient = userInput.replace(" ", "_").toLowerCase()
            console.log(mainMealIngredient)
            return mainMealIngredient
        }


        let response = fetch("https://www.themealdb.com/api/json/v1/1/filter.php?i=" + getUserInput())
            .then(response => {
                let data = response.json();


                if (response !== null) {
                    resolve(data);
                }
                else {
                    reject(Error("BUZZER NOISE"))
                }

            })

    })
    //Calls to see the result of the promise
    getAMeal.then(
        function (result) { //Checks if the data recieved from the API was recieved (successful promise), and if it returned actual data
            if (result.meals !== null) {// Calls random favorite to get a random meal, this meal is then printed out to the console


                let randomMeal = randomChefFavorite(result.meals.length)


                //Creates new object based on results of meal chosen
                let newOrder = new order(result.meals[randomMeal].idMeal, result.meals[randomMeal].strCountry, orderList.length + 1, "Incomplete")

                orderList.push(newOrder)

                storeOrderList();
                displayOrders();

            }
            else {
                displayOrders();
                alert("Sorry, but there is no meal with that ingredient")
            }
        },
        //Checks if promise failed
        function (error) {
            console.log(error);
        }

    )
}
//Utilising code from w3schools (but changed for my purpose, I rewrote and changed everything), to get random value to pick a random meal as the chef favorite (from the array based on picked ingredient)
function randomChefFavorite(max) {
    let rndNum = Math.floor(Math.random() * (max + 1));
    return rndNum;
}




//Function to display the orders in the html document, and create the input that allows orders to be completed
function displayOrders() {
    let orderSection = document.getElementById("orderSection")


    //Again, not elegent, but this reoves all children so no duplicates can be made
    function removeDuplicates() {
        while (orderSection.hasChildNodes()) {
            list.removeChild(orderSection.firstChild);
        }
    }
    

    //I Know that this isn't the most elegent solution to reprinting the same order, but it works (skipps order if it was already printed in this session)
    for (let i = 0; i < orderList.length; i++) {
        console.log(i + " " + totalPrintedThisCycle + " Before")
        if (orderList[i].orderStatus === "Incomplete" && i >= totalPrintedThisCycle && orderList !== null) {


            let orderContainer = orderSection.appendChild(document.createElement("div"));
            orderContainer.innerHTML = `<div class = "order"> Order Number :${orderList[i].orderNumber}` + "<br/>" + `ID : ${orderList[i].id}` + "<br/>" + `Status : ${orderList[i].orderStatus}` + "<br/>" + `</div>`;
            orderContainer.innerHTML += `<label for="order${i}"> Please Enter code to complete </label>  <input type = "text"" id ="order${i}"/>`
            orderContainer.innerHTML += `<button id="submitButton" onclick="completeOrder(order${i}.value, ${i})">Submit</button>`
            totalPrintedThisCycle++;
        }

        else if (orderList[i].orderStatus === "Completed") {
            totalPrintedThisCycle++
        }

        console.log(i + " " + totalPrintedThisCycle + " After")

    }
    
    console.log(orderList)
}

//Checks values on input code and order code, and if they are the same, then changes the status of the order to Complete
function completeOrder(code, orderNum) {
    console.log(code, orderNum)
    if (code == orderList[orderNum].id) {
        orderList[orderNum].orderStatus = "Completed"
        console.log(orderList[orderNum].orderStatus)
        console.log(orderList)
        storeOrderList();
        alert("Order Complete, this will be reflected on page reload")
        displayOrders();
        
    }
    else {
        alert("Wrong code, sorry, please try again")
        console.log(orderList[orderNum].orderStatus)
        console.log(orderList[orderNum].id)
    }
}

displayOrders();