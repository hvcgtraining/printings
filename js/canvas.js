var canvasPadding = 50 * 2;
var canvasWidth = window.innerWidth - 430 - canvasPadding;
var canvasHeight = window.innerHeight - 45 - canvasPadding;

var currentShape = this;

var bgItem, srcImg, bgImg, background, textOptions, textColor, textFontSize, textFontFamily, textDec;
textOptions = document.querySelector('.field-text-option');
textColor = document.querySelector('#text-color');
textFontSize = document.querySelector('#font-size-text');
textFontFamily = document.querySelector('#font-family-text');
textDec = document.querySelectorAll('.text-dec')

// Create Background
bgImg = new Image();
bgImg.onload = function () {


    var map = new Konva.Image({
        x: 0,
        y: 0,
        image: bgImg,
        name: 'bg-image',
        width: stage.width(),
        height: stage.height()

    });

    layer.add(map);
    layer.batchDraw();
    stage.add(layer);
    map.moveToBottom();

}

// Create Image

// Add Image
var imgItem = document.querySelectorAll('.image-item img')
imgItem.forEach(item => {
    item.onclick = function (e) {
        var canvasImg = new Image();
        canvasImg.onload = function () {
            var imgSrc = new Konva.Image({
                x: 0,
                y: 0,
                image: canvasImg,
                draggable: true,
                name: 'canvas-image'
            })
            layer.add(imgSrc);
            stage.add(layer);
            layer.batchDraw();
        }
        var imgItemSrc = this.getAttribute('src');
        canvasImg.src = imgItemSrc;

    }
})
// Change Background
bgItem = document.querySelectorAll('.bg-item img');
bgItem.forEach(item => {
    item.onclick = function (e) {
        stage.find('.bg-image').destroy();
        srcImg = this.getAttribute('src');
        bgImg.src = srcImg
    }
})

// Upload Image
var uploadImgBtn = document.querySelector('#upload-img');
uploadImgBtn.onchange = function () {
    uploadImage(this);
}

function uploadImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var canvasImg = new Image();
            canvasImg.onload = function () {
                var imgSrc = new Konva.Image({
                    x: 0,
                    y: 0,
                    image: canvasImg,
                    draggable: true,
                    name: 'canvas-image'
                })
                layer.add(imgSrc);

                stage.add(layer);
                layer.batchDraw();
            }

            canvasImg.src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}
// Upload Background
var uploadBtn = document.querySelector('#upload-bg');
uploadBtn.onchange = function () {
    readURL(this);
};
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            stage.find('.bg-image').destroy();
            bgImg.src = e.target.result;
        }

        reader.readAsDataURL(input.files[0]);
    }
}


function writeMessage(message) {
    text.text(message);
    layer.draw();
}

var stage = new Konva.Stage({
    container: 'canvas-container',
    width: 550,
    height: 550
});

var layer = new Konva.Layer({
    zIndex: 1
});

stage.add(layer);

document.querySelector(".add-text").addEventListener("click", function () {
    var text = document.querySelector(".input-text").value;
    if (!text.trim()) {
        text = "Sample text";
    }

    var newText = new Konva.Text({
        x: 130,
        y: 200,
        text: text,
        fontSize: 56,
        fontFamily: 'Open Sans',
        fill: '#004080',
        name: 'text',
        draggable: true
    });


    layer.add(newText);

    //remove all transformer before create new
    stage.find('Transformer').destroy();

    // create new transformer
    var tr = new Konva.Transformer();
    layer.add(tr);
    tr.attachTo(newText);
    layer.draw();

    currentTarget = newText.attrs.name;
    console.log(text);
    text = '';
    document.getElementById("textarea-custom").value = '';
}, false)



stage.on('click', function (e) {
    // if click on empty area - remove all transformers
    if (e.target === stage) {
        stage.find('Transformer').destroy();
        textOptions.style.display = 'none';
        closeTextAreas();
        layer.draw();
        return;

    }
    if (e.target.hasName('bg-image')) {
        stage.find('Transformer').destroy();
        closeTextAreas();
        textOptions.style.display = 'none';
        layer.draw();
    }


    currentShape = e.target;


    if (e.target.hasName('text')) {
        var iptText = document.querySelector('.input-text');
        iptText.value = e.target.attrs.text;



        currentShape.addEventListener('dblclick', function () {
            closeTextAreas();
            // create textarea over canvas with absolute position

            // first we need to find position for textarea
            // how to find it?

            // at first lets find position of text node relative to the stage:
            var textPosition = currentShape.getAbsolutePosition();

            // then lets find position of stage container on the page:
            var stageBox = stage.container().getBoundingClientRect();

            // so position of textarea will be the sum of positions above:
            var areaPosition = {
                x: stageBox.left + textPosition.x,
                y: stageBox.top + textPosition.y
            };
            // Display text options
            textOptions.style.top = areaPosition.y + 50 + 'px';
            textOptions.style.left = areaPosition.x + 'px';
            textOptions.style.display = 'block';
            // Change text color
            textColor.value = currentShape.fill();
            textColor.onchange = function () {
                currentShape.fill(textColor.value);
                layer.draw();
            }
            // Change Font Size Text
            textFontSize.value = currentShape.fontSize();
            textFontSize.onchange = function () {
                currentShape.fontSize(+textFontSize.value);
                layer.draw();
            }

            // Change Font Family Text
            textFontFamily.value = currentShape.fontFamily();
            textFontFamily.onchange = function () {
                currentShape.fontFamily(textFontFamily.value)
                layer.draw();
            }

            // Change text Decoration
            let isBold, isItalic, isUnderline, isLineThrough = false;
            textDec.forEach(item => {
                item.onclick = function (e) {

                    var data = item.getAttribute('data-dec');
                    switch (data) {

                        case 'bold':
                            if (!isBold) {
                                currentShape.fontStyle('bold');
                                layer.draw();
                                isBold = true;
                                break;
                            } else {
                                currentShape.fontStyle('');
                                layer.draw();
                                isBold = false;
                                break;
                            }

                        case 'italic':
                            if (!isItalic) {
                                currentShape.fontStyle('italic');
                                layer.draw();
                                isItalic = true;
                                break;
                            } else {
                                currentShape.fontStyle('');
                                layer.draw();
                                isItalic = false;
                                break;
                            }

                        case 'underline':
                            if (!isUnderline) {
                                currentShape.textDecoration('underline');
                                layer.draw();
                                isUnderline = true;
                                break;
                            } else {
                                currentShape.textDecoration('');
                                layer.draw();
                                isUnderline = false;
                                break;
                            }

                        case 'line-through':
                            if (!isLineThrough) {
                                currentShape.textDecoration('line-through');
                                layer.draw();
                                isLineThrough = true;
                                break;
                            } else {
                                currentShape.textDecoration('');
                                layer.draw();
                                isLineThrough = false;
                                break;
                            }

                    }
                }
            })

            // create textarea and style it
            var textarea = document.createElement('textarea');
            textarea.setAttribute("class", "textarea-edit");
            document.body.appendChild(textarea);

            textarea.value = currentShape.text();
            textarea.style.position = 'absolute';
            textarea.style.top = areaPosition.y + 'px';
            textarea.style.left = areaPosition.x + 'px';
            textarea.style.width = currentShape.width();

            textarea.focus();

            textarea.addEventListener('keydown', function (e) {
                console.log(e.keyCode);
                // hide on enter
                if (e.keyCode === 13) {
                    currentShape.text(textarea.value);
                    closeTextAreas();
                    layer.draw();
                }
            });
        });
    }



    // create new transformer
    if (!e.target.hasName('bg-image')) {
        stage.find('Transformer').destroy();


        var tr = new Konva.Transformer();
        layer.add(tr);
        tr.attachTo(e.target);
        layer.draw();
    }


});

// setup menu
var menuNode = document.getElementById('context-menu');
document.getElementById('delete-button').addEventListener('click', function () {
    currentShape.destroy();
    layer.draw();
});

window.addEventListener('click', function () {
    // hide menu 
    menuNode.style.display = 'none';
});


stage.on('contextmenu', function (e) {
    // prevent default behavior
    e.evt.preventDefault();
    if (e.target === stage) {
        // if we are on empty place of the stage we will do nothing
        return;
    }
    stage.find('Transformer').destroy();
    // show menu
    menuNode.style.display = 'initial';
    var containerRect = stage.container().getBoundingClientRect();
    menuNode.style.top = containerRect.top + stage.getPointerPosition().y + 30 + 'px';
    menuNode.style.left = containerRect.left + stage.getPointerPosition().x + 30 + 'px';
});

function closeTextAreas() {
    var textareas = document.querySelectorAll(".textarea-edit");
    if (textareas) {
        for (var i = 0; i < textareas.length; i++) {
            document.body.removeChild(textareas[i]);
        }
    }

}
// Export Canvas
function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    delete link;
}

document.getElementById('save').addEventListener(
    'click',
    function () {
        var dataURL = stage.toDataURL();
        downloadURI(dataURL, 'stage.png');
    },
    false
);

// Template
const templates = [
    {
        textData: [
            {
                text: "This is a test template",
                fontSize: 48,
                fontFamily: 'Pacifico',
                color: '#ff0000',
                x: 100.15104131410479,
                y: 351.0471220932542,
                rotation: -29.93118584621161,
            }
        ],
        imgsData: [
            {
                x: 340,
                y: 249,
                scaleX: 0.74,
                scaleY: 0.74,
                src: 'images/sticker/4.png'

            },
            {
                x: 2,
                y: 0,
                scaleX: 0.5,
                scaleY: 0.5,
                src: 'images/sticker/8.png'

            }
        ],
        bgUrl: 'images/background/bg-8.jpg'
    }
]
function createText(options) {
    console.log(options.textData[0].text);
    for (var i = 0; i < options.textData.length; i++) {
        var newText = new Konva.Text({
            x: options.textData[i].x,
            y: options.textData[i].y,
            text: options.textData[i].text,
            fontSize: options.textData[i].fontSize,
            fontFamily: options.textData[i].fontFamily,
            fill: options.textData[i].color,
            name: 'text',
            draggable: true,
            rotation: options.textData[i].rotation
        });

        layer.add(newText);
    }


    //remove all transformer before create new
    stage.find('Transformer').destroy();

    // create new transformer
    var tr = new Konva.Transformer();
    layer.add(tr);
    tr.attachTo(newText);
    layer.draw();

    currentTarget = newText.attrs.name;
}
function createBg(options) {
    stage.find('.bg-image').destroy();
    bgImg.src = options.bgUrl;
}
function createImage(options) {

    const array = options.imgsData;
    array.forEach(function (item) {
        var newImage = new Image();
        newImage.onload = function () {
            let newImgSrc = new Konva.Image({
                x: item.x,
                y: item.y,
                image: newImage,
                draggable: true,
                name: 'canvas-image',
                scaleX: item.scaleX,
                scaleY: item.scaleY
            })
            layer.add(newImgSrc);
            layer.batchDraw();
        }
        newImage.src = item.src;
    })



}

document.querySelector('.template-item').addEventListener('click', function (e) {
    stage.find('Text').destroy();
    stage.find('Image').destroy();
    createBg(templates[0]);
    createText(templates[0]);
    createImage(templates[0])
}, false)