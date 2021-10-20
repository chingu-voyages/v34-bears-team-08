import ImageKit from 'imagekit-javascript';
import { writable } from "svelte/store";


export const filesForUpload = writable([]);
//The img url which gets returned once successfully posted
export const image = writable({});

const imagekit = new ImageKit({
publicKey : import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
    urlEndpoint : import.meta.env.VITE_IMAGEKIT_URL_END_POINT,
    authenticationEndpoint : import.meta.env.VITE_IMAGEKIT_AUTHENTICATION_END_POINT,
});

export function upload (image) {
    const file = get(filesForUpload)[0]
    return imagekit.upload({
        file,
        fileName : file.name ||  "default.jpg",
        tags : [""]
    }, function (err, result) {
        image = result;
        console.log({arguments,urls: imagekit.url({
            src: result.url,
            transformation: [
                {
                  height: "100",
                  width: "100",
                  quality: "50",
                  format: "png",
                  overlayText: "ImageKit",
                  overlayTextColor: "purple",
                  focus: "auto"
                }
              ]
        })});
    })
}





