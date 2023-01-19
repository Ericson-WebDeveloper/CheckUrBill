export const imageToBas64 = (element: HTMLInputElement, callback: (image: string | ArrayBuffer | null) => void) => {
    let file = element.files![0];
    let reader = new FileReader();

    reader.onloadend = function() {
        callback(reader.result);
        // console.log('RESULT', reader.result)
    }
    reader.readAsDataURL(file);
}