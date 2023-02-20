function cursos() {
  const items = document.getElementsByClassName("curso-secundario");
  const itemsArray = Array.from(items);
  let isVisible = false;

  for (let i = 0; i < itemsArray.length; i++) {
    if (itemsArray[i].classList.contains("hidden")) {
      isVisible = true;
    }
    itemsArray[i].classList.toggle("hidden");
  }

  const btn = document.querySelector("button.maisCursos");
  if (isVisible) {
    btn.innerHTML = "Ver Menos";
  } else {
    btn.innerHTML = "Ver Mais";
  }
}

const btnDarkMode = document.getElementById("btn-dark-mode");

function darkMode(event) {
  document.body.classList.toggle("dark-mode", event.target.checked);
}
btnDarkMode.addEventListener("change", darkMode);
