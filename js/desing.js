const themeMode = document.querySelector("#themeMode")

themeMode.addEventListener("click" , (e) => {
    e.preventDefault()
    themeMode.classList.toggle('activo')
})