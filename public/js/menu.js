const btnMobile = document.getElementById("btnMobile")
    
const toogleMenu = (event)=>{

    if(event.type === "touchstart")
        event.preventDefault()

    const nav = document.getElementById("nav")
    nav.classList.toggle("active")
}

const scrollToIdOnClick = (event)=>{
    event.preventDefault()
    
    const nav = document.getElementById("nav")
    nav.classList.toggle("active")

    const element = event.target
    const id = element.getAttribute("href")
   
    const section = document.querySelector(id)
    
    window.scroll({
        top:section.offsetTop,
        behavior:"smooth"
    })

}
const menuItems = document.querySelectorAll("#menu a[href^='#']")

menuItems.forEach(item=>{
    item.addEventListener("click",scrollToIdOnClick)
})

btnMobile.addEventListener("click",toogleMenu)
btnMobile.addEventListener("touchstart",toogleMenu)