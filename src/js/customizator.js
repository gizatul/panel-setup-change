export default class Customizator {
  constructor() {
    this.btnBlock = document.createElement('div');
    this.colorPicker = document.createElement('input');
    this.clear = document.createElement('div');
    this.scale = localStorage.getItem('scale') || 1; //в ls из ключа scale получаем значение, если его нет, то по умол. будет 1
    this.color = localStorage.getItem('color') || '#ffffff'; //в ls из ключа color получаем значение, если его нет, то по умол. будет #ffffff - белый цвет

    this.btnBlock.addEventListener('click', (e) => { //после нажатия на кнопку запускаем ф-ю onScaleChange, кот-я ниже
      this.onScaleChange(e); //событие e нужно для последующей проверки его существования
    });
    this.colorPicker.addEventListener('input', (e) => {
      this.onColorChange(e);
    });
    this.clear.addEventListener('click', () => {
      this.reset();
    });
  }

  //получение значения на нажимаемую кнопку
  onScaleChange(e) {
    const body = document.querySelector('body');
    if (e) {
      this.scale = +e.target.value.replace(/x/g, '');
    }

    //Ф-я рекурсии
    const recursy = (elem) => {
      elem.childNodes.forEach(node => { //перебор всех дочерних элементов body. childNodes приходят в виде массива
        if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0) { //если название ноды текст и (берем все пробелы (s+) и заменяем на пустую строку) и после этого символов больше чем 0, то...
          if (!node.parentNode.getAttribute('data-fz')) { //если значение атрибута отсутствует
            let value = window.getComputedStyle(node.parentNode, null).fontSize; //получаем размер шрифта  родителя ноды
            node.parentNode.setAttribute('data-fz', +value.replace(/px/g, ''));
            node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + 'px';
          } else {
            node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * this.scale + 'px';
          }
        } else { //если условие выше не выполняются
          recursy(node); //то снова запускаем ф-ю рекурсии
        }
      });
    }
    recursy(body);
    localStorage.setItem('scale', this.scale);
  }

  onColorChange(e) {
    const body = document.querySelector('body');
    body.style.backgroundColor = e.target.value; //присваиваем значение получаемое от inputa цвета
    localStorage.setItem('color', e.target.value); //установка значения цвета в localstorage
  }

  setBgColor() {
    const body = document.querySelector('body');
    body.style.backgroundColor = this.color; //записываем цвет из localstorage
    this.colorPicker.value = this.color; //записываем цвет в цветовой input
  }

  //Размещаем стили на страницу в head
  injectStyle() {
    const style = document.createElement('style'); //создаем элемент style
    style.innerHTML =` 
    .panel {
      display: flex;
      justify-content: space-around;
      align-items: center;
      position: fixed;
      top: 10px;
      right: 0;
      border: 1px solid rgba(0,0,0, .2);
      box-shadow: 0 0 20px rgba(0,0,0, .5);
      width: 300px;
      height: 60px;
      background-color: #fff;
    }
    .scale {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100px;
      height: 40px;
    }
    .scale_btn {
      display: block;
      width: 40px;
      height: 40px;
      border: 1px solid rgba(0,0,0, .2);
      border-radius: 4px;
      font-size: 18px;
    }
    .color {
      width: 40px;
      height: 40px;
    }
    .clear {
      font-size: 20px;
      cursor: pointer;
    }`; //в style прописываем стили панели
    document.querySelector('head').appendChild(style); //размещаем в head наши стили
  }
  //Метод очистки localstorage
  reset() {
    localStorage.clear(); //используем метод очистки ls
    this.scale = 1; //устанавливаем значение масштаба по умолчанию
    this.color = '#ffffff'; //устанавливаем значение цвета по умол
    this.onScaleChange(); //вызываем ф-ю установки масштаба
    this.setBgColor(); //вызываем ф-ю установки цвета
  }

  render() { //рендер панели справа сверху
    this.onScaleChange();
    this.setBgColor();
    this.injectStyle(); //вызываем для установки стилей панели
    let scaleInputS = document.createElement('input'),
        scaleInputM = document.createElement('input'),
        panel = document.createElement('div');

    panel.append(this.btnBlock, this.colorPicker, this.clear); // в панель размещаем блок с кнопками и выбор цвета

    this.clear.innerHTML =`&times`;
    this.clear.classList.add('clear');

    scaleInputS.classList.add('scale_btn');
    scaleInputM.classList.add('scale_btn');
    this.btnBlock.classList.add('scale');
    this.colorPicker.classList.add('color');

    scaleInputS.setAttribute('type', 'button');
    scaleInputM.setAttribute('type', 'button');
    scaleInputS.setAttribute('value', '1x');
    scaleInputM.setAttribute('value', '1.5x');
    this.colorPicker.setAttribute('type', 'color');
    this.colorPicker.setAttribute('value', '#ffffff');

    this.btnBlock.append(scaleInputS, scaleInputM);

    panel.classList.add('panel');
    document.querySelector('body').append(panel);
  }
}