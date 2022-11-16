function cursos() {
  const items = document.getElementsByClassName("curso-secundario");
  let isVisible = false;

  for (let i = 0; i < items.length; i++) {
    if (items[i].classList.contains("hidden")) {
      isVisible = true;
    }
    items[i].classList.toggle("hidden");
  }

  const btn = document.querySelector("button.maisCursos");
  if (isVisible) {
    btn.innerHTML = "Ver Menos";
  } else {
    btn.innerHTML = "Ver Mais";
  }
}
