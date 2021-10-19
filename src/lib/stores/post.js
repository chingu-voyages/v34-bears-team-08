import ImageKit from 'imagekit';
import { writable } from "svelte/store";

export const fileForUpload = writable(0);
//The img url which gets returned once successfully posted
export const image = writable({});

{/* <script type="text/javascript" src="https://unpkg.com/imagekit-javascript/dist/imagekit.min.js"></script> */}
const imagekit = new ImageKit({
    publicKey : process.env['IMAGEKIT_PUBLIC_KEY'],
    urlEndpoint : process.env['IMAGEKIT_URL_END_POINT'],
    authenticationEndpoint : process.env['IMAGEKIT_AUTHENTICATION_END_POINT'],
});

function upload () {
    imagekit.upload({
        file : fileForUpload.files[0],
        fileName : fileForUpload.files[0].name ||  "default.jpg",
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



