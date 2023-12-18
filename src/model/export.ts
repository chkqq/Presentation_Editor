import { Slide, SlideElement } from "./types";
import { Size } from '../core/types/types'
import { jsPDF } from 'jspdf'
import CanvasTextWrapper from 'canvas-text-wrapper';
import { uuid } from "uuidv4";

function getBase64FromPicture(src: string, size: Size): Promise<string> {
    return new Promise((resolve) => {
        const img: HTMLImageElement = new Image(size.width, size.height);
        img.src = src;
        img.crossOrigin = 'use-credentials';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            if (ctx)
                ctx.drawImage(img, 0, 0);
            const uri = canvas.toDataURL('image/png', 1.0);
            resolve(uri);
        };
    });
}

function addTextBox(doc: jsPDF, object: SlideElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx && object.textProps) {
        const text = object.textProps.textValue;
        const width = object.size.width;
        const height = object.size.height;
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = object.textProps.textColor;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 4;
        CanvasTextWrapper.CanvasTextWrapper(canvas, text, {
            font: `${object.textProps.fontWeight} ${object.textProps.fontSize}px ${object.textProps.font}`,
            textAlign: "left"
        });
        const base64 = canvas.toDataURL();
        doc.addImage(
            base64,
            'PNG',
            object.position.x,
            object.position.y,
            width,
            height
        )
    }
}

function addRect(doc: jsPDF, object: SlideElement, mode: string) {
    doc.rect(
        object.position.x,
        object.position.y,
        object.size.width,
        object.size.height,
        mode);
}

function addTriangle(doc: jsPDF, object: SlideElement, mode: string) {
    doc.triangle(object.position.x + object.size.width / 2,
        object.position.y,
        object.position.x,
        object.position.y + object.size.height,
        object.position.x + object.size.width,
        object.position.y + object.size.height,
        mode);
}

function addEllipse(doc: jsPDF, object: SlideElement, mode: string) {
    doc.ellipse(
        object.position.x + object.size.width / 2,
        object.position.y + object.size.height / 2,
        object.size.width / 2,
        object.size.height / 2,
        mode);
}

function addFigure(doc: jsPDF, object: SlideElement) {
    if (object.figure) {
        doc.setDrawColor(object.figure.strokeColor);
        doc.setFillColor(object.figure.fillColor)
        doc.setLineWidth(object.figure.strokeWidth);
        const drawingMode = 'FD'; //DrawFill
        if (object.figure.form === 'rectangle') {
            addRect(doc, object, drawingMode);
        } else if (object.figure.form === 'triangle') {
            addTriangle(doc, object, drawingMode);
        } else if (object.figure.form === 'circle') {
            addEllipse(doc, object, drawingMode);
        }    
    }
    
}

function addImage(doc: jsPDF, object: SlideElement, base64: string) {
    doc.addImage(
        base64,
        'PNG',
        object.position.x,
        object.position.y,
        object.size.width,
        object.size.height
    );
}

async function addObjectOnPage(doc: jsPDF, object: SlideElement) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        if (object.elementType === 'text') {
            addTextBox(doc, object);
        } else if (object.elementType === 'figure') {
            addFigure(doc, object);
        } else if (object.elementType === 'image') {
            const base64 = await getBase64FromPicture(object.image!, object.size);
            addImage(doc, object, base64);
        }
        resolve(Promise);
    });
}

async function addObjectsOnPage(doc: jsPDF, elements: Array<SlideElement>) {
    const promises = elements.map(async (SlideElement) => {
        return addObjectOnPage(doc, SlideElement);
    });
    await Promise.all(promises);
}

async function setBackgroundImage(doc: jsPDF, image: SlideElement) {
    const base64 = await getBase64FromPicture(image.image!, image.size);
    doc.addImage (
        base64,
        'jpg',
        0,
        0,
        818,
        582
    );
}

function setBackgroundColor(doc: jsPDF, color: string) {
    doc.setFillColor(color);
    doc.rect(
        0,
        0,
        818,
        582,
        'F'
    );
}

async function addSlides(doc: jsPDF, slides: Array<Slide>) {
    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        if (slide.background.length <= 7)
        {
            setBackgroundColor(doc, slide.background)
        }
        else
        {
            const bgImage: SlideElement = {
                elementId: uuid(),
                position: {
                    x: 0,
                    y: 0
                },
                elementType: 'image',
                size: {
                    width: 818,
                    height: 582
                },
                image: slide.background
            } 
            await setBackgroundImage(doc, bgImage);
        }
        await addObjectsOnPage(doc, slide.elements);
        doc.addPage();
    }
}


export { addSlides, getBase64FromPicture }