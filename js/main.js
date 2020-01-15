var init = function () {
    var closeBtns = document.querySelectorAll(".options .close-button");
    for (var i = 0; i < closeBtns.length; i++) {
        closeBtns[i].onclick = function () {
            this.parentElement.style.display = 'none';
        }
    }

    var toggleOption = document.querySelectorAll('.label-option');
    toggleOption.forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            this.nextElementSibling.style.display = 'block';
        })
    })

}

var textarea = document.querySelector('.input-text');

textarea.addEventListener('keydown', autosize);

function autosize() {
    var el = this;
    setTimeout(function () {
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
    }, 0);
}

document.addEventListener("DOMContentLoaded", init, false);