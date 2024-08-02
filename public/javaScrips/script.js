const changeBg = document.getElementById("change-bg")
const body = document.getElementById("body")
var bg = "light"

changeBg.addEventListener("click",()=>{
         if(bg == "light"){
            bg = "dark"
            changeBg.innerHTML = "light"
            body.style.backgroundColor = "rgb(4, 4, 133)"
            
         }
         else{
            bg = "light"
            changeBg.innerHTML = "dark"
            body.style.backgroundColor = "rgb(123, 157, 238)"
         }
})