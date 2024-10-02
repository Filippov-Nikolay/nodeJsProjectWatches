function openBox(box) { // Функция под нозванием openBox, принимает параметр box

    display = document.getElementById(box).style.display; // Получает тип display по id

    if(display == 'none')  { // Если display имеет значение none - будет поставлено значение block
        document.getElementById(box).style.display = 'block';
    } else { // Если display имеет значение block - будет поставлено значение none
        document.getElementById(box).style.display = 'none';
    }
}