import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://card-2b2db-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")
const image = document.getElementById("image")
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    if (inputValue){
         push(shoppingListInDB, inputValue)
         clearInputFieldEl()
    }
   
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        let list_leght=itemsArray.length
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(i+1,currentItem,list_leght)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}
function allCheckedFunc(){
    const image = document.getElementById("image");
    image.src = 'https://media.tenor.com/567uraHuM78AAAAi/cat-cats';
    setTimeout(function () {
        image.src = 'https://i.pinimg.com/originals/b6/89/0e/b6890e2e8d07eecbd8bd07ac36f580a3.png';
      }, 2000);
}
// Функция для добавления элемента в список с сохранением состояния подчеркивания
function appendItemToShoppingListEl(i, item,list_leght) {
    let itemID = item[0];
    let itemValue = item[1];

    let newEl = document.createElement("li");
    let span = document.createElement("span");
    span.textContent = i; // Добавляем индекс с точкой

    let itemText = document.createTextNode(itemValue);
    newEl.appendChild(span);
    newEl.appendChild(itemText);

    // Проверяем, был ли элемент подчеркнут
    let checkedItems = JSON.parse(localStorage.getItem('checkedItems')) || [];
    if (checkedItems.includes(itemID)) {
        newEl.classList.add('checked');
    }

    newEl.addEventListener("click", function() {
        newEl.classList.toggle("checked");
 
        // Обновляем массив состояний подчеркивания в localStorage при клике
        if (newEl.classList.contains("checked")) {
            checkedItems.push(itemID);
        } else {
            checkedItems = checkedItems.filter(id => id !== itemID);
        }
        localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
        
        let allChecked = true;
        let listItems = shoppingListEl.querySelectorAll("li");
        listItems.forEach(function(item) {
            if (!item.classList.contains("checked")) {
                allChecked = false;
            }
        });
        if (allChecked) {
            allCheckedFunc();
        }
    });
      newEl.addEventListener("dblclick", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);

        // Удаляем состояние подчеркивания из массива в localStorage при удалении элемента
        checkedItems = checkedItems.filter(id => id !== itemID);
        localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
    });
    
    shoppingListEl.append(newEl);
}
