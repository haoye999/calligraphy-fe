/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "material-ui-image";
import axios from "axios";
import "./index.css";

function UploadFile({ setLoading }) {
  const [url, setUrl] = useState("");
  const [resultIouUrl, setResultIouUrl] = useState("");
  const [resultSkUrl, setResultSkUrl] = useState("");
  const [iou, setIou] = useState(0);
  const [sk, setSk] = useState(0);

  const upload = (file) => {
    const data = new FormData();
    data.append("photo", file);
    setLoading(true);
    axios
      .post("http://localhost:5000/score", data)
      .then((res) => res.data)
      .then(({ iou, iou_size, sk_size, sk }) => {
        setLoading(false);
        setResultIouUrl(`http://localhost:5000/${iou_size}`);
        setResultSkUrl(`http://localhost:5000/${sk_size}`);
        setIou(iou);
        setSk(sk);
      })
      .catch(() => setLoading(false));
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const url = reader.result;
        setUrl(url);
      };
      reader.readAsDataURL(file);

      upload(file);
    });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div className="container">
      <div className="drag" {...getRootProps()}>
        <input {...getInputProps()} />
        {acceptedFiles.length ? (
          <>
            <Image style={{ width: "100%" }} src={url} />
            <p>原始图像</p>
          </>
        ) : (
          <p>拖拽或点击选中文件</p>
        )}
      </div>
      <div className="drag">
        <Image
          onClick={() => window.open(resultIouUrl)}
          src={resultIouUrl}
          imageStyle={{ height: "auto" }}
          style={{ width: "100%" }}
        />
        <p>IOU评分: {(iou * 100).toFixed(2)}</p>
      </div>
      <div className="drag">
        <Image
          onClick={() => window.open(resultSkUrl)}
          src={resultSkUrl}
          imageStyle={{ height: "auto" }}
          style={{ width: "100%" }}
        />
        <p>骨架评分: {(sk).toFixed(2)}</p>
      </div>
    </div>
  );
}

export default UploadFile;
