export default class Customizator {
  constructor() {
    this.btnBlock = document.createElement('div');
    this.colorPicker = document.createElement('input');

    this.btnBlock.addEventListener('click', (e) => { //после нажатия на кнопку запускаем ф-ю onScaleChange, кот-я ниже
      this.onScaleChange(e);
    });
    this.colorPicker.addEventListener('input', (e) => {
      this.onColorChange(e);
    })
  }

  //получение значения на нажимаемую кнопку
  onScaleChange(e) {
    let scale;
    const body = document.querySelector('body');
    if (e.target.value) {
      scale = +e.target.value.replace(/x/g, '');
    }

    //Ф-я рекурсии
    function recursy(elem) {
      elem.childNodes.forEach(node => { //перебор всех дочерних элементов body. childNodes приходят в виде массива
        if (node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0) { //если название ноды текст и (берем все пробелы (s+) и заменяем на пустую строку) и после этого символов больше чем 0, то...
          if (!node.parentNode.getAttribute('data-fz')) { //если значение атрибута отсутствует
            let value = window.getComputedStyle(node.parentNode, null).fontSize; //получаем размер шрифта  родителя ноды
            node.parentNode.setAttribute('data-fz', +value.replace(/px/g, ''));
            node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * scale + 'px';
          } else {
            node.parentNode.style.fontSize = node.parentNode.getAttribute('data-fz') * scale + 'px';
          }
        } else { //если условие выше не выполняются
          recursy(node); //то снова запускаем ф-ю рекурсии
        }
      });
    }
    recursy(body);
  }

  onColorChange(e) {
    const body = document.querySelector('body');
    body.style.backgroundColor = e.target.value; //присваиваем значение получаемое от inputa цвета
    console.log(e.target.value);
  }

  render() { //рендер панели справа сверху
    let scaleInputS = document.createElement('input'),
        scaleInputM = document.createElement('input'),
        panel = document.createElement('div');

    panel.append(this.btnBlock, this.colorPicker); // в панель размещаем блок с кнопками и выбор цвета

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