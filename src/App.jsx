import React, { useMemo, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#EEEFF0',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

export default function Dropzone(props) {

  const [textDrop, setTextdrop] = useState("Arrastra un archivo o haz click para seleccionar.");

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {

      setTextdrop("Seleccionado: " + file.name)

      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        console.log(binaryStr)

        console.log(arrayBufferToFile(binaryStr, 'myfile'))

        //arrayBufferToJson(binaryStr)

        arrayBufferToImg(binaryStr)

      }

      reader.readAsArrayBuffer(file)

    })

  }, [])


  const arrayBufferToFile = (buffer, filename) => {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    return new File([blob], filename, { type: 'application/octet-stream' });
  };

  const arrayBufferToJson = (buffer) => {

    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);

    const blob = new Blob([buffer], { type: 'text/plain' });
    const objectURL = URL.createObjectURL(blob);

    link.href = objectURL;
    link.download = 'data.json';
    link.click();

  }

  const arrayBufferToImg = (buffer) => {


    var blob2 = new Blob([buffer], { type: "image/jpeg" }); //application/octet-stream
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob2);

    var img = document.querySelector("#photo");
    img.src = imageUrl;
    img.removeAttribute("hidden");

    //To open in other tab
    //location.href = imageUrl

    //To download as image
    var a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);

    a.setAttribute("download", "YourFileName.jpeg");
    a.setAttribute("href", imageUrl);
    //a.appendChild(img);
    a.click();

  }

  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({ accept: { 'image/*': [] }, onDrop });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      {console.log(file)}
    </li>
  ));

  return (

    <div className="container p-5">

      <h3>Selecciona o desliza un archivo</h3>

      <div className='w-50 h6' {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>{textDrop}</p>
      </div>

      {/*Drag 'n' drop some files here, or click to select files*/}

      <br />

      {/* <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside> */}

      <div className='row'>
        <div className='col-md-5'>
          <img className='img-fluid' id="photo" src="" alt="miImage" hidden />
        </div>
      </div>

    </div>

  );

}